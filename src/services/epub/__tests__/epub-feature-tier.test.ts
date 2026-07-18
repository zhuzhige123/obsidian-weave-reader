import { beforeEach, describe, expect, it } from "vitest";
import {
	EPUB_ALL_LOCAL_FEATURES_ENABLED,
	EPUB_CORE_FEATURE_ID_SET,
	EPUB_FEATURE_IDS,
	EPUB_PREMIUM_FEATURE_IDS,
	EPUB_PREMIUM_FEATURE_ID_SET,
	isEpubCoreFeature,
	isEpubPremiumFeature,
} from "../../../config/epub-feature-tier";
import { PremiumFeatureGuard, PREMIUM_FEATURES } from "../../premium/PremiumFeatureGuard";

describe("epub-feature-tier", () => {
	it("treats excerpt notes and reading progress as core", () => {
		expect(isEpubCoreFeature(EPUB_FEATURE_IDS.EXCERPT_NOTES)).toBe(true);
		expect(isEpubCoreFeature(EPUB_FEATURE_IDS.READING_PROGRESS)).toBe(true);
		expect(isEpubCoreFeature(EPUB_FEATURE_IDS.READING_REFERENCE)).toBe(false);
	});

	it("lists premium epub capabilities separately from core", () => {
		expect(isEpubPremiumFeature(EPUB_FEATURE_IDS.READING_PROGRESS)).toBe(false);
		expect(isEpubPremiumFeature(EPUB_FEATURE_IDS.READING_REFERENCE)).toBe(true);
		expect(isEpubPremiumFeature(EPUB_FEATURE_IDS.PARAGRAPH_MODE)).toBe(true);
		expect(EPUB_CORE_FEATURE_ID_SET.size).toBeGreaterThan(0);
		expect(EPUB_PREMIUM_FEATURE_ID_SET.size).toBeGreaterThan(0);
	});
});

describe("PremiumFeatureGuard epub tier", () => {
	beforeEach(() => {
		PremiumFeatureGuard.getInstance().isPremiumActive.set(false);
		PremiumFeatureGuard.getInstance().premiumFeaturesPreviewEnabled.set(false);
	});

	it("allows reading progress without a license", () => {
		const guard = PremiumFeatureGuard.getInstance();
		expect(guard.canUseFeature(EPUB_FEATURE_IDS.READING_PROGRESS)).toBe(true);
		expect(guard.isPremiumFeature(EPUB_FEATURE_IDS.READING_PROGRESS)).toBe(false);
	});

	it("enables every local reader capability without a license", () => {
		const guard = PremiumFeatureGuard.getInstance();
		expect(EPUB_ALL_LOCAL_FEATURES_ENABLED).toBe(true);
		for (const featureId of EPUB_PREMIUM_FEATURE_IDS) {
			expect(guard.canUseFeature(featureId)).toBe(true);
			expect(guard.shouldShowFeatureEntry(featureId)).toBe(true);
			expect(guard.getFeatureEntryTitle("Feature", featureId)).toBe("Feature");
		}
		expect(guard.canUseFeature(PREMIUM_FEATURES.EPUB_READING_REFERENCE)).toBe(true);
	});
});
