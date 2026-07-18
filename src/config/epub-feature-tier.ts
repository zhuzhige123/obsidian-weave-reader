/**
 * EPUB 阅读器功能分层（单一真相源）。
 * - core：未激活也可用，且关闭「高级预览」时仍显示相关设置
 * - premium：需许可证；未开预览时不展示入口（EPUB、TXT 阅读本身免费，见 book-format.isFreeBookFormat）
 *
 * 使用字符串常量，避免与 PremiumFeatureGuard 循环依赖。
 */
export const EPUB_FEATURE_IDS = {
	EXCERPT_NOTES: "epub-excerpt-notes",
	READING_PROGRESS: "epub-reading-progress",
	READING_REFERENCE: "epub-reading-reference",
	NON_EPUB_FORMATS: "epub-non-epub-formats",
	PARAGRAPH_MODE: "epub-paragraph-mode",
	STYLED_EXCERPTS: "epub-styled-excerpts",
	SOURCE_LOCATION: "epub-source-location",
	CANVAS_EXCERPTS: "epub-canvas-excerpts",
	FOOTNOTE_PREVIEW: "epub-footnote-preview",
	CHAPTER_EXPORT: "epub-chapter-export",
} as const;

/**
 * Fork policy: every reader capability implemented in this repository is
 * available locally without activation on desktop and mobile.
 */
export const EPUB_ALL_LOCAL_FEATURES_ENABLED = true;

export const EPUB_CORE_FEATURE_IDS = [
	EPUB_FEATURE_IDS.EXCERPT_NOTES,
	EPUB_FEATURE_IDS.READING_PROGRESS,
] as const;

export const EPUB_PREMIUM_FEATURE_IDS = [
	EPUB_FEATURE_IDS.NON_EPUB_FORMATS,
	EPUB_FEATURE_IDS.READING_REFERENCE,
	EPUB_FEATURE_IDS.PARAGRAPH_MODE,
	EPUB_FEATURE_IDS.STYLED_EXCERPTS,
	EPUB_FEATURE_IDS.SOURCE_LOCATION,
	EPUB_FEATURE_IDS.CANVAS_EXCERPTS,
	EPUB_FEATURE_IDS.FOOTNOTE_PREVIEW,
	EPUB_FEATURE_IDS.CHAPTER_EXPORT,
] as const;

export const EPUB_CORE_FEATURE_ID_SET = new Set<string>(EPUB_CORE_FEATURE_IDS);

export const EPUB_PREMIUM_FEATURE_ID_SET = new Set<string>(EPUB_PREMIUM_FEATURE_IDS);

export function isEpubCoreFeature(featureId: string): boolean {
	return EPUB_CORE_FEATURE_ID_SET.has(featureId);
}

export function isEpubPremiumFeature(featureId: string): boolean {
	return EPUB_PREMIUM_FEATURE_ID_SET.has(featureId);
}
