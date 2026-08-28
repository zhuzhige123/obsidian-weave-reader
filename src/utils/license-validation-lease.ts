import { LICENSE_CLOUD_REVALIDATION_DAYS } from "../config/license-cloud-config";

const DAY_MS = 24 * 60 * 60 * 1000;

export interface CloudValidationLeaseStatus {
	valid: boolean;
	needsValidation: boolean;
}

export class CloudValidationLease {
	private lastSuccessfulValidationAt: number | null = null;

	recordSuccess(now = Date.now()): void {
		this.lastSuccessfulValidationAt = now;
	}

	clear(): void {
		this.lastSuccessfulValidationAt = null;
	}

	getStatus(now = Date.now()): CloudValidationLeaseStatus {
		if (this.lastSuccessfulValidationAt === null) {
			return { valid: false, needsValidation: true };
		}

		const expiresAt =
			this.lastSuccessfulValidationAt + LICENSE_CLOUD_REVALIDATION_DAYS * DAY_MS;
		const valid = now < expiresAt;
		return { valid, needsValidation: !valid };
	}
}
