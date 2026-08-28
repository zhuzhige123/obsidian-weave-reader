import { describe, expect, it, vi } from "vitest";
import { LicenseManager } from "../licenseManager";
import type { LicenseInfo } from "../../types/license";

function buildLicense(overrides: Partial<LicenseInfo> = {}): LicenseInfo {
	return {
		activationCode: "signed-code",
		isActivated: true,
		activatedAt: "2026-04-01T00:00:00.000Z",
		deviceFingerprint: "device",
		expiresAt: "2099-04-01T00:00:00.000Z",
		productVersion: "0.7.20",
		licenseType: "lifetime",
		boundEmail: "owner@example.com",
		issuedProductId: "weave-epub-reader",
		entitlements: ["epub-premium"],
		...overrides,
	};
}

function createManager() {
	const manager = new LicenseManager();
	const cloudValidator = {
		setApp: vi.fn(),
		validate: vi.fn(),
		clearCache: vi.fn(),
	};
	(manager as any).cloudValidator = cloudValidator;
	vi.spyOn(manager as any, "generateDeviceFingerprint").mockResolvedValue("device");
	const validateActivationCode = vi
		.spyOn(manager, "validateActivationCode")
		.mockResolvedValue({ isValid: true });

	return { manager, cloudValidator, validateActivationCode };
}

describe("LicenseManager current license validation", () => {
	it("keeps inactive records free without parsing an activation code or calling cloud validation", async () => {
		const { manager, cloudValidator, validateActivationCode } = createManager();

		const result = await manager.validateCurrentLicense(
			buildLicense({ isActivated: false, activationCode: "", boundEmail: undefined })
		);

		expect(result).toMatchObject({ isValid: false, error: "许可证未激活" });
		expect(validateActivationCode).not.toHaveBeenCalled();
		expect(cloudValidator.validate).not.toHaveBeenCalled();
	});

	it("downgrades activated records that lack a bound email", async () => {
		const { manager, cloudValidator } = createManager();

		const result = await manager.validateCurrentLicense(buildLicense({ boundEmail: undefined }));

		expect(result).toMatchObject({
			isValid: false,
			error: "许可证缺少绑定邮箱，请重新激活",
		});
		expect(cloudValidator.validate).not.toHaveBeenCalled();
	});

	it("forces cloud validation for an activated record after manager initialization", async () => {
		const { manager, cloudValidator } = createManager();
		cloudValidator.validate.mockResolvedValue({ valid: true });

		const persistedAt = new Date().toISOString();
		const result = await manager.validateCurrentLicense(
			buildLicense({
				cloudSync: {
					status: "synced",
					syncedAt: persistedAt,
					lastValidatedAt: persistedAt,
				},
			})
		);

		expect(result.isValid).toBe(true);
		expect(cloudValidator.validate).toHaveBeenCalledTimes(1);
	});

	it("downgrades when initial cloud validation is unavailable", async () => {
		const { manager, cloudValidator } = createManager();
		cloudValidator.validate.mockResolvedValue({
			valid: false,
			is_network_error: true,
		});

		const result = await manager.validateCurrentLicense(buildLicense());

		expect(result).toMatchObject({
			isValid: false,
			error: "许可证验证暂时不可用，请恢复网络后重试",
		});
	});
});
