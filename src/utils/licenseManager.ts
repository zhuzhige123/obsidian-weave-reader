import { logger } from "../utils/logger";
/**
 * 激活码管理系统
 * 结合本地RSA签名验证和云端设备管理
 * 支持邮箱绑定和自动设备轮换
 */

import { type App, Platform } from "obsidian";
import {
	CURRENT_PLUGIN_VERSION,
	LICENSE_PUBLIC_KEY,
	SUPPORTED_ACTIVATION_PRODUCT_IDS,
} from "../config/plugin-runtime";
import type { ActivationCodeData, CloudSyncInfo, LicenseInfo, LicensedProduct } from "../types/license";
import {
	LICENSED_PRODUCTS,
	licenseAppliesToProduct,
	mapActivationDataToEntitlements,
	normalizeLicenseInfo,
} from "./license-state";
import {
	isCloudLicenseConfigured,
	LICENSE_CLOUD_MAX_DEVICES,
} from "../config/license-cloud-config";
import { sanitizeCloudLicenseUserMessage } from "./activation-privacy";
import { CloudLicenseValidator } from "./cloudLicenseValidator";
import { CloudValidationLease } from "./license-validation-lease";
import { assertSubmittedEmailMatchesActivationOwner } from "./license-owner-email";
import {
	DEVICE_FINGERPRINT_VERSION,
	generateStableDeviceFingerprint,
} from "./device-fingerprint";

// 重新导出类型供其他模块使用（向后兼容）
export type { LicenseInfo, CloudSyncInfo, ActivationCodeData };

function getRuntimePlatformLabel(): string {
	if (Platform.isWin) return "win32";
	if (Platform.isMacOS) return "darwin";
	if (Platform.isLinux) return "linux";
	if (Platform.isAndroidApp) return "android";
	if (Platform.isIosApp) return "ios";
	if (Platform.isDesktop || Platform.isDesktopApp) return "desktop";
	if (Platform.isMobile || Platform.isMobileApp) return "mobile";
	return "unknown-platform";
}

export class LicenseManager {
	// 云端验证器
	private cloudValidator: CloudLicenseValidator;
	private cloudValidationLease = new CloudValidationLease();
	private app: App | null = null;

	constructor() {
		this.cloudValidator = new CloudLicenseValidator();
	}

	initializeCloud(app: App): void {
		this.app = app;
		this.cloudValidationLease.clear();
		this.cloudValidator.setApp(app);
		ActivationAttemptLimiter.setApp(app);
	}

	/**
	 * 生成稳定的设备指纹（与 Weave 主插件共用同一安装级 device id）。
	 */
	private async generateDeviceFingerprint(): Promise<string> {
		if (!this.app) {
			throw new Error("LicenseManager requires App before generating a device fingerprint");
		}
		return generateStableDeviceFingerprint(this.app);
	}

	/**
	 * SHA256 哈希函数
	 */
	private async sha256(message: string): Promise<string> {
		const msgBuffer = new TextEncoder().encode(message);
		const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
	}

	/**
	 * Base64 解码
	 */
	private base64Decode(str: string): Uint8Array {
		const binaryString = atob(str);
		const bytes = new Uint8Array(binaryString.length);
		for (let i = 0; i < binaryString.length; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}
		return bytes;
	}

	/**
	 * 验证 RSA 签名
	 */
	private async verifySignature(data: string, signature: string): Promise<boolean> {
		try {
			// 导入公钥
			const publicKey = await crypto.subtle.importKey(
				"spki",
				new Uint8Array(
					this.base64Decode(LICENSE_PUBLIC_KEY.replace(/-----[^-]+-----/g, "").replace(/\s/g, ""))
				),
				{
					name: "RSASSA-PKCS1-v1_5",
					hash: "SHA-256",
				},
				false,
				["verify"]
			);

			// 验证签名
			const dataBuffer = new TextEncoder().encode(data);
			const signatureBuffer = this.base64Decode(signature);

			return await crypto.subtle.verify(
				"RSASSA-PKCS1-v1_5",
				publicKey,
				new Uint8Array(signatureBuffer),
				dataBuffer
			);
		} catch (error) {
			logger.error("签名验证失败:", error);
			return false;
		}
	}

	/**
	 * 解析激活码
	 */
	private parseActivationCode(activationCode: string): { data: string; signature: string } | null {
		try {
			// 激活码格式: BASE64_DATA.BASE64_SIGNATURE
			const parts = activationCode.split(".");
			if (parts.length !== 2) {
				return null;
			}

			const [dataBase64, signatureBase64] = parts;
			const data = atob(dataBase64);

			return {
				data,
				signature: signatureBase64,
			};
		} catch (error) {
			logger.error("激活码解析失败:", error);
			return null;
		}
	}

	private getInvalidTargetProductMessage(targetProduct: LicensedProduct): string {
		return targetProduct === LICENSED_PRODUCTS.EPUB
			? "激活码不适用于当前 EPUB 插件"
			: "激活码不适用于当前产品";
	}

	/**
	 * 验证激活码
	 */
	async validateActivationCode(
		activationCode: string,
		_deviceFingerprint?: string,
		options?: {
			targetProduct?: LicensedProduct;
		}
	): Promise<{
		isValid: boolean;
		data?: ActivationCodeData;
		error?: string;
	}> {
		try {
			// 解析激活码
			const parsed = this.parseActivationCode(activationCode);
			if (!parsed) {
				return { isValid: false, error: "激活码格式无效" };
			}

			// 验证签名
			const isSignatureValid = await this.verifySignature(parsed.data, parsed.signature);
			if (!isSignatureValid) {
				return { isValid: false, error: "激活码签名验证失败" };
			}

			let data: ActivationCodeData;
			try {
				data = JSON.parse(parsed.data) as ActivationCodeData;
			} catch {
				return { isValid: false, error: "激活码内容损坏，请重新复制完整激活码" };
			}

			const entitlements = mapActivationDataToEntitlements(data);
			if (entitlements.length === 0) {
				return { isValid: false, error: "激活码不适用于当前产品" };
			}

			if (options?.targetProduct) {
				const applicable = licenseAppliesToProduct(
					normalizeLicenseInfo({
						activationCode,
						isActivated: true,
						activatedAt: new Date().toISOString(),
						deviceFingerprint: "",
						expiresAt: data.expiresAt,
						productVersion: CURRENT_PLUGIN_VERSION,
						licenseType: data.licenseType,
						issuedProductId: data.productId,
						entitlements,
						features: data.features,
					}),
					options.targetProduct
				);
				if (!applicable) {
					return {
						isValid: false,
						error: this.getInvalidTargetProductMessage(options.targetProduct),
					};
				}
			}

			// 验证过期时间
			const now = new Date();
			const expiresAt = new Date(data.expiresAt);
			if (now > expiresAt) {
				return { isValid: false, error: "激活码已过期" };
			}

			// 验证设备数量限制（现在支持最多5台设备）
			// 设备绑定和验证在 validateCurrentLicense 中处理

			return { isValid: true, data };
		} catch (error) {
			logger.error("激活码验证失败:", error);
			return { isValid: false, error: "激活码验证过程中发生错误" };
		}
	}

	/**
	 * 激活许可证：本地 RSA 验签 + 云端邮箱绑定与设备登记
	 */
	async activateLicense(
		activationCode: string,
		email: string,
		options?: {
			targetProduct?: LicensedProduct;
		}
	): Promise<{
		success: boolean;
		licenseInfo?: LicenseInfo;
		error?: string;
		cloudInfo?: {
			isFirstActivation?: boolean;
			replacedOldDevice?: boolean;
			devicesUsed?: number;
			devicesMax?: number;
		};
	}> {
		try {
			// 验证邮箱格式
			if (!email || !this.isValidEmail(email)) {
				return { success: false, error: "请输入有效的邮箱地址" };
			}
			const sanitizedEmail = email.toLowerCase().trim();

			// 生成设备指纹
			const deviceFingerprint = await this.generateDeviceFingerprint();

			// 本地RSA签名验证（必须通过）
			const validation = await this.validateActivationCode(activationCode, deviceFingerprint, options);
			if (!validation.isValid || !validation.data) {
				return { success: false, error: validation.error };
			}

			const data = validation.data;

			const ownerEmailCheck = assertSubmittedEmailMatchesActivationOwner(sanitizedEmail, data);
			if (!ownerEmailCheck.ok) {
				return { success: false, error: ownerEmailCheck.error };
			}

			if (!isCloudLicenseConfigured()) {
				return {
					success: false,
					error: "云服务未配置，无法完成激活。请稍后再试或联系支持。",
				};
			}

			const cloudResult = await this.cloudValidator.activate(
				activationCode,
				deviceFingerprint,
				sanitizedEmail,
				getRuntimePlatformLabel()
			);

			if (!cloudResult.success) {
				return {
					success: false,
					error: cloudResult.error || "云端激活失败",
				};
			}

			this.cloudValidationLease.recordSuccess();

			const maxDevices = Math.min(
				cloudResult.max_devices ?? data.maxDevices ?? LICENSE_CLOUD_MAX_DEVICES,
				LICENSE_CLOUD_MAX_DEVICES
			);
			const nowIso = new Date().toISOString();

			const licenseInfo: LicenseInfo = {
				activationCode,
				isActivated: true,
				activatedAt: nowIso,
				deviceFingerprint,
				expiresAt: cloudResult.expires_at || data.expiresAt,
				productVersion: CURRENT_PLUGIN_VERSION,
				licenseType: data.licenseType,
				issuedProductId: data.productId,
				entitlements: mapActivationDataToEntitlements(data),
				features: Array.isArray(data.features) ? [...data.features] : [],
				userId: data.userId,
				maxDevices,
				fingerprintVersion: DEVICE_FINGERPRINT_VERSION,
				boundEmail: sanitizedEmail,
				cloudSync: {
					status: "synced",
					syncedAt: nowIso,
					lastValidatedAt: nowIso,
					devicesUsed: cloudResult.devices_count ?? 1,
					devicesMax: maxDevices,
				},
				source: "local",
				metadata: data.metadata,
			};

			logger.info("EPUB 许可证云端激活成功");

			return {
				success: true,
				licenseInfo,
				cloudInfo: {
					isFirstActivation: (cloudResult.devices_count ?? 1) <= 1,
					replacedOldDevice: cloudResult.replaced_old_device,
					devicesUsed: cloudResult.devices_count,
					devicesMax: maxDevices,
				},
			};
		} catch (error) {
			logger.error("许可证激活失败:", error);
			return { success: false, error: "激活过程中发生错误" };
		}
	}

	/**
	 * 移除激活状态
	 */
	deactivateLicense(): {
		success: boolean;
		message?: string;
		error?: string;
	} {
		try {
			logger.info("移除许可证激活状态");
			return {
				success: true,
				message: "许可证激活状态已移除",
			};
		} catch (error) {
			logger.error("移除激活状态失败:", error);
			return {
				success: false,
				error: "移除激活状态时发生错误",
			};
		}
	}

	/**
	 * 验证邮箱格式
	 */
	private isValidEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	/**
	 * 验证当前许可证状态（增强版 - 支持云端验证和自动迁移）
	 */
	async validateCurrentLicense(
		licenseInfo: LicenseInfo,
		options?: {
			targetProduct?: LicensedProduct;
		}
	): Promise<{
		isValid: boolean;
		error?: string;
		warnings?: string[];
	}> {
		const warnings: string[] = [];

		try {
			const normalizedLicense = normalizeLicenseInfo(licenseInfo, {
				source: licenseInfo.source,
				sourcePluginId: licenseInfo.sourcePluginId,
			});

			// 基础状态检查
			if (!normalizedLicense.isActivated) {
				return { isValid: false, error: "许可证未激活" };
			}

			if (!normalizedLicense.activationCode) {
				return { isValid: false, error: "激活码信息缺失" };
			}

			if (options?.targetProduct && !licenseAppliesToProduct(normalizedLicense, options.targetProduct)) {
				return {
					isValid: false,
					error: this.getInvalidTargetProductMessage(options.targetProduct),
				};
			}

			// 验证许可证数据完整性
			const requiredFields = [
				"activationCode",
				"activatedAt",
				"deviceFingerprint",
				"expiresAt",
				"productVersion",
			];
			for (const field of requiredFields) {
				if (!normalizedLicense[field as keyof LicenseInfo]) {
					return { isValid: false, error: `许可证数据不完整，缺少${field}字段` };
				}
			}

			if (!normalizedLicense.boundEmail?.trim()) {
				return { isValid: false, error: "许可证缺少绑定邮箱，请重新激活" };
			}

			// 验证时间有效性
			const now = new Date();
			const activatedAt = new Date(normalizedLicense.activatedAt);
			const expiresAt = new Date(normalizedLicense.expiresAt);

			// 检查激活时间是否合理
			if (activatedAt > now) {
				return { isValid: false, error: "许可证激活时间异常" };
			}

			// 检查过期时间
			if (now > expiresAt) {
				return { isValid: false, error: "许可证已过期" };
			}

			// 检查即将过期的情况
			const daysUntilExpiry = Math.ceil(
				(expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
			);
			if (normalizedLicense.licenseType !== "lifetime" && daysUntilExpiry <= 30) {
				warnings.push(`许可证将在${daysUntilExpiry}天后过期`);
			}

			// 验证设备指纹
			const currentFingerprint = await this.generateDeviceFingerprint();

			if (
				!normalizedLicense.fingerprintVersion ||
				normalizedLicense.fingerprintVersion < DEVICE_FINGERPRINT_VERSION
			) {
				logger.debug("迁移设备指纹到跨插件稳定版本...");
				normalizedLicense.deviceFingerprint = currentFingerprint;
				normalizedLicense.fingerprintVersion = DEVICE_FINGERPRINT_VERSION;
				if (normalizedLicense.cloudSync) {
					normalizedLicense.cloudSync = {
						...normalizedLicense.cloudSync,
						lastValidatedAt: "",
					};
				}
				this.cloudValidator.clearCache();
				warnings.push(
					"设备指纹已更新；主插件与阅读器将共用同一设备位。若设备数仍异常，请重新激活一次"
				);
			}

			const cloudCheck = await this.performCloudValidation(
				normalizedLicense,
				currentFingerprint
			);
			if (!cloudCheck.ok) {
				return { isValid: false, error: cloudCheck.error };
			}

			// 重新验证激活码
			const validation = await this.validateActivationCode(normalizedLicense.activationCode, undefined, options);
			if (!validation.isValid) {
				return { isValid: false, error: validation.error };
			}

			// 验证产品版本兼容性
			if (normalizedLicense.productVersion && normalizedLicense.productVersion !== CURRENT_PLUGIN_VERSION) {
				warnings.push(
					`许可证版本(${normalizedLicense.productVersion})与当前版本(${CURRENT_PLUGIN_VERSION})不匹配`
				);
			}

			// 检查激活时间是否过于久远（可能的时钟问题）
			const daysSinceActivation = Math.ceil(
				(now.getTime() - activatedAt.getTime()) / (1000 * 60 * 60 * 24)
			);
			if (daysSinceActivation > 3650) {
				// 超过10年
				warnings.push("许可证激活时间异常久远，请检查系统时间");
			}

			Object.assign(licenseInfo, normalizedLicense);

			return {
				isValid: true,
				warnings: warnings.length > 0 ? warnings : undefined,
			};
		} catch (error) {
			logger.error("许可证验证失败:", error);
			return { isValid: false, error: "验证过程中发生错误" };
		}
	}

	/**
	 * 定期验证许可证状态
	 */
	async performPeriodicValidation(licenseInfo: LicenseInfo): Promise<{
		isValid: boolean;
		shouldReactivate: boolean;
		error?: string;
		warnings?: string[];
	}> {
		const validation = await this.validateCurrentLicense(licenseInfo);

		if (!validation.isValid) {
			// 判断是否需要重新激活
			const shouldReactivate = !!(
				validation.error?.includes("设备指纹") ||
				validation.error?.includes("数据不完整") ||
				validation.error?.includes("激活码")
			);

			return {
				isValid: false,
				shouldReactivate,
				error: validation.error,
				warnings: validation.warnings,
			};
		}

		return {
			isValid: true,
			shouldReactivate: false,
			warnings: validation.warnings,
		};
	}

	/**
	 * 获取许可证剩余天数
	 */
	getLicenseRemainingDays(licenseInfo: LicenseInfo): number {
		const now = new Date();
		const expiresAt = new Date(licenseInfo.expiresAt);
		const diffTime = expiresAt.getTime() - now.getTime();
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	}

	/**
	 * 检查是否为试用版
	 */
	isTrialVersion(licenseInfo: LicenseInfo): boolean {
		return !licenseInfo.isActivated || licenseInfo.activationCode === "";
	}

	/**
	 * 执行云端验证（内部方法）
	 */
	private async performCloudValidation(
		licenseInfo: LicenseInfo,
		currentFingerprint: string
	): Promise<{ ok: boolean; error?: string }> {
		try {
			if (!licenseInfo.boundEmail?.trim()) {
				return { ok: false, error: "许可证缺少绑定邮箱，请重新激活" };
			}

			if (!isCloudLicenseConfigured()) {
				return { ok: false, error: "云服务未配置，无法验证许可证" };
			}

			if (!this.cloudValidationLease.getStatus().needsValidation) {
				return { ok: true };
			}

			const cloudResult = await this.cloudValidator.validate(
				licenseInfo.activationCode,
				currentFingerprint,
				licenseInfo.boundEmail,
				{ bypassCache: true }
			);

			if (cloudResult.valid) {
				const nowIso = new Date().toISOString();
				licenseInfo.cloudSync = {
					status: "synced",
					syncedAt: licenseInfo.cloudSync?.syncedAt || nowIso,
					lastValidatedAt: nowIso,
					devicesUsed: cloudResult.devices_count ?? licenseInfo.cloudSync?.devicesUsed,
					devicesMax: cloudResult.max_devices ?? licenseInfo.cloudSync?.devicesMax ?? licenseInfo.maxDevices,
				};
				this.cloudValidationLease.recordSuccess();
				return { ok: true };
			}

			if (cloudResult.is_network_error) {
				logger.warn("许可证云端验证暂时不可用");
				return {
					ok: false,
					error: "许可证验证暂时不可用，请恢复网络后重试",
				};
			}

			return {
				ok: false,
				error: sanitizeCloudLicenseUserMessage(
					cloudResult.error || "云端验证失败，此设备可能已被其他设备挤占，请重新激活"
				),
			};
		} catch (error) {
			logger.error("云端验证错误:", error);
			return {
				ok: false,
				error: error instanceof Error ? error.message : "云端验证异常",
			};
		}
	}
}

/**
 * 激活码前端验证结果
 */
export interface ActivationCodeValidationResult {
	isValid: boolean;
	error?: string;
	warning?: string;
}

/**
 * 激活尝试记录
 */
interface ActivationAttempt {
	timestamp: number;
	success: boolean;
	deviceFingerprint: string;
}

/**
 * 防暴力破解限制器
 */
export class ActivationAttemptLimiter {
	private static readonly MAX_ATTEMPTS = 5; // 最大尝试次数
	private static readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 锁定时间：15分钟
	private static readonly ATTEMPT_WINDOW = 5 * 60 * 1000; // 时间窗口：5分钟
	private static readonly STORAGE_KEY = "weave_activation_attempts";
	private static app: App | null = null;

	static setApp(app: App): void {
		this.app = app;
	}

	/**
	 * 检查是否可以尝试激活
	 */
	static async canAttemptActivation(): Promise<{
		canAttempt: boolean;
		error?: string;
		remainingTime?: number;
	}> {
		const deviceFingerprint = await this.generateSimpleFingerprint();
		const attempts = this.getAttempts();
		const now = Date.now();

		// 清理过期的尝试记录
		const validAttempts = attempts.filter(
			(attempt) => now - attempt.timestamp < this.ATTEMPT_WINDOW
		);

		// 获取当前设备的尝试记录
		const deviceAttempts = validAttempts.filter(
			(attempt) => attempt.deviceFingerprint === deviceFingerprint
		);

		// 检查是否被锁定
		const lastFailedAttempt = deviceAttempts
			.filter((attempt) => !attempt.success)
			.sort((a, b) => b.timestamp - a.timestamp)[0];

		if (lastFailedAttempt) {
			const timeSinceLastAttempt = now - lastFailedAttempt.timestamp;
			const failedAttempts = deviceAttempts.filter(
				(attempt) => !attempt.success && now - attempt.timestamp < this.LOCKOUT_DURATION
			);

			if (failedAttempts.length >= this.MAX_ATTEMPTS) {
				const remainingTime = this.LOCKOUT_DURATION - timeSinceLastAttempt;
				if (remainingTime > 0) {
					return {
						canAttempt: false,
						error: `激活尝试次数过多，请等待 ${Math.ceil(remainingTime / 60000)} 分钟后重试`,
						remainingTime,
					};
				}
			}
		}

		// 保存清理后的尝试记录
		this.saveAttempts(validAttempts);

		return { canAttempt: true };
	}

	/**
	 * 记录激活尝试
	 */
	static async recordAttempt(success: boolean): Promise<void> {
		const deviceFingerprint = await this.generateSimpleFingerprint();
		const attempts = this.getAttempts();

		attempts.push({
			timestamp: Date.now(),
			success,
			deviceFingerprint,
		});

		this.saveAttempts(attempts);
	}

	/**
	 * 获取尝试记录
	 */
	private static getAttempts(): ActivationAttempt[] {
		try {
			const storedUnknown: unknown = this.app?.loadLocalStorage(this.STORAGE_KEY);
			if (typeof storedUnknown !== "string" || !storedUnknown) {
				return [];
			}
			const parsed: unknown = JSON.parse(storedUnknown);
			if (!Array.isArray(parsed)) {
				return [];
			}
			return parsed.filter(
				(entry): entry is ActivationAttempt =>
					Boolean(entry && typeof entry === "object") &&
					typeof (entry as ActivationAttempt).timestamp === "number" &&
					typeof (entry as ActivationAttempt).success === "boolean" &&
					typeof (entry as ActivationAttempt).deviceFingerprint === "string"
			);
		} catch {
			return [];
		}
	}

	/**
	 * 保存尝试记录
	 */
	private static saveAttempts(attempts: ActivationAttempt[]): void {
		try {
			// 只保留最近的50条记录
			const recentAttempts = attempts.slice(-50);
			this.app?.saveLocalStorage(this.STORAGE_KEY, JSON.stringify(recentAttempts));
		} catch {
			// 忽略存储错误
		}
	}

	/**
	 * 生成简单的设备指纹（用于尝试限制）
	 */
	private static async generateSimpleFingerprint(): Promise<string> {
		const components = [
			getRuntimePlatformLabel(),
			`${screen.width}x${screen.height}`,
			new Date().getTimezoneOffset().toString(),
		];

		const fingerprint = components.join("|");
		const encoder = new TextEncoder();
		const data = encoder.encode(fingerprint);
		const hashBuffer = await crypto.subtle.digest("SHA-256", data);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		return hashArray
			.map((b) => b.toString(16).padStart(2, "0"))
			.join("")
			.substring(0, 16);
	}

	/**
	 * 重置尝试记录（用于测试）
	 */
	static resetAttempts(): void {
		this.app?.saveLocalStorage(this.STORAGE_KEY, undefined);
	}
}

/**
 * 激活码前端验证工具
 */
export class ActivationCodeValidator {
	/**
	 * 验证激活码格式
	 */
	static validateFormat(activationCode: string): ActivationCodeValidationResult {
		// 基础检查
		if (!activationCode || typeof activationCode !== "string") {
			return {
				isValid: false,
				error: "请输入激活码",
			};
		}

		const trimmedCode = activationCode.trim();

		// 长度检查 - 真实激活码通常在500-800字符之间
		if (trimmedCode.length < 200) {
			return {
				isValid: false,
				error: "激活码长度过短，请检查是否完整复制",
			};
		}

		if (trimmedCode.length > 2000) {
			return {
				isValid: false,
				error: "激活码长度过长，请检查是否包含多余内容",
			};
		}

		// 格式检查: BASE64_DATA.BASE64_SIGNATURE
		const parts = trimmedCode.split(".");
		if (parts.length !== 2) {
			return {
				isValid: false,
				error: "激活码格式不正确，应为两部分用点号分隔",
			};
		}

		const [dataBase64, signatureBase64] = parts;

		// 检查Base64格式
		try {
			atob(dataBase64);
			atob(signatureBase64);
		} catch {
			return {
				isValid: false,
				error: "激活码包含无效字符，请检查是否正确复制",
			};
		}

		// 检查数据部分是否为有效JSON
		try {
			const dataString = atob(dataBase64);
			const dataUnknown: unknown = JSON.parse(dataString);
			if (!dataUnknown || typeof dataUnknown !== "object" || Array.isArray(dataUnknown)) {
				return {
					isValid: false,
					error: "激活码数据不完整",
				};
			}
			const data = dataUnknown as Record<string, unknown>;

			// 检查必要字段
			const requiredFields = ["userId", "productId", "licenseType", "expiresAt"];
			for (const field of requiredFields) {
				if (!data[field]) {
					return {
						isValid: false,
						error: `激活码数据不完整，缺少${field}字段`,
					};
				}
			}

			// 检查产品ID（兼容更名前的旧产品ID）
			if (!SUPPORTED_ACTIVATION_PRODUCT_IDS.has(String(data.productId))) {
				return {
					isValid: false,
					error: "此激活码不适用于当前产品",
				};
			}

			// 检查过期时间格式
			const expiresAt = new Date(data.expiresAt);
			if (Number.isNaN(expiresAt.getTime())) {
				return {
					isValid: false,
					error: "激活码过期时间格式无效",
				};
			}

			// 检查是否已过期
			if (expiresAt < new Date()) {
				return {
					isValid: false,
					error: "激活码已过期",
				};
			}
		} catch {
			return {
				isValid: false,
				error: "激活码数据格式无效",
			};
		}

		return {
			isValid: true,
		};
	}

	/**
	 * 实时验证激活码输入
	 */
	static validateInput(input: string): ActivationCodeValidationResult {
		if (!input.trim()) {
			return { isValid: false };
		}

		// 检查是否包含非法字符
		const validChars = /^[A-Za-z0-9+/=.\s-]+$/;
		if (!validChars.test(input)) {
			return {
				isValid: false,
				warning: "激活码包含特殊字符，请检查是否正确复制",
			};
		}

		// 检查基本长度
		if (input.length < 100) {
			return {
				isValid: false,
				warning: "激活码长度不足，请继续输入",
			};
		}

		// 检查是否包含点号分隔符
		if (!input.includes(".")) {
			return {
				isValid: false,
				warning: "激活码应包含点号分隔符",
			};
		}

		return { isValid: true };
	}
}

export const licenseManager = new LicenseManager();
