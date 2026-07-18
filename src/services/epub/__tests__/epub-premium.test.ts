import { beforeEach, describe, expect, it } from "vitest";
import { App } from "obsidian";
import { PremiumFeatureGuard, PREMIUM_FEATURES } from "../../premium/PremiumFeatureGuard";
import { canOpenBookWithCurrentLicense, canOpenEpubFile } from "../epub-premium";

describe("epub-premium book format access", () => {
	beforeEach(() => {
		PremiumFeatureGuard.getInstance().isPremiumActive.set(false);
	});

	it("allows EPUB and TXT without a license", () => {
		expect(canOpenBookWithCurrentLicense("Books/demo.epub")).toBe(true);
		expect(canOpenBookWithCurrentLicense("Books/novel.txt")).toBe(true);
		expect(canOpenEpubFile(new App(), "Books/novel.txt")).toBe(true);
	});

	it("opens every supported format without a license", () => {
		expect(canOpenBookWithCurrentLicense("Books/demo.mobi")).toBe(true);
		expect(canOpenEpubFile(new App(), "Books/demo.cbz")).toBe(true);
		expect(canOpenEpubFile(new App(), "Books/demo.azw3")).toBe(true);
		expect(canOpenEpubFile(new App(), "Books/demo.fb2")).toBe(true);
	});

	it("opens premium formats when non-epub formats feature is licensed", () => {
		PremiumFeatureGuard.getInstance().isPremiumActive.set(true);
		expect(
			canOpenEpubFile(new App(), "Books/demo.mobi")
		).toBe(true);
		expect(
			PremiumFeatureGuard.getInstance().canUseFeature(PREMIUM_FEATURES.EPUB_NON_EPUB_FORMATS)
		).toBe(true);
	});
});
