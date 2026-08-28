import { describe, expect, it } from "vitest";
import { CloudValidationLease } from "../license-validation-lease";

const DAY_MS = 24 * 60 * 60 * 1000;
const NOW = Date.parse("2026-04-10T12:00:00.000Z");

describe("CloudValidationLease", () => {
	it("starts invalid and requires validation", () => {
		expect(new CloudValidationLease().getStatus(NOW)).toEqual({
			valid: false,
			needsValidation: true,
		});
	});

	it("accepts only a success recorded in the current process", () => {
		const lease = new CloudValidationLease();
		lease.recordSuccess(NOW - DAY_MS);

		expect(lease.getStatus(NOW)).toEqual({ valid: true, needsValidation: false });
	});

	it("requires validation after it expires", () => {
		const lease = new CloudValidationLease();
		lease.recordSuccess(NOW - 8 * DAY_MS);

		expect(lease.getStatus(NOW)).toEqual({ valid: false, needsValidation: true });
	});

	it("clears on a new plugin initialization", () => {
		const lease = new CloudValidationLease();
		lease.recordSuccess(NOW);
		lease.clear();

		expect(lease.getStatus(NOW)).toEqual({ valid: false, needsValidation: true });
	});
});
