import { describe, expect, it } from "vitest";
import { EPUB_TUTORIAL_CONTENT_BY_LANG, EPUB_TUTORIAL_TABS_BY_LANG } from "../epub-tutorial-content";
import enUSTutorial from "../tutorial-locales/en-US.json";
import ruRUTutorial from "../tutorial-locales/ru-RU.json";

const TAB_IDS = ["basics", "highlight", "workflow", "tools", "family", "credits"] as const;
const LOCALIZED_LANGS = ["ja-JP", "ko-KR", "ru-RU"] as const;

function sectionCount(lang: (typeof LOCALIZED_LANGS)[number] | "en-US"): number {
	return TAB_IDS.reduce(
		(total, tabId) => total + EPUB_TUTORIAL_CONTENT_BY_LANG[lang][tabId].length,
		0
	);
}

describe("EPUB tutorial locales", () => {
	it("keeps the same tab structure across languages", () => {
		for (const lang of ["zh-CN", "zh-TW", "en-US", "ja-JP", "ko-KR", "ru-RU"] as const) {
			expect(Object.keys(EPUB_TUTORIAL_CONTENT_BY_LANG[lang]).sort()).toEqual([...TAB_IDS].sort());
			expect(EPUB_TUTORIAL_TABS_BY_LANG[lang]).toHaveLength(TAB_IDS.length);
		}
	});

	it("aligns localized tutorial sections with English", () => {
		const englishCount = sectionCount("en-US");
		for (const lang of LOCALIZED_LANGS) {
			expect(sectionCount(lang)).toBe(englishCount);
		}
	});

	it("uses the complete English tutorial when public ja and ko bodies are unavailable", () => {
		expect(EPUB_TUTORIAL_CONTENT_BY_LANG["ja-JP"]).toBe(
			EPUB_TUTORIAL_CONTENT_BY_LANG["en-US"]
		);
		expect(EPUB_TUTORIAL_CONTENT_BY_LANG["ko-KR"]).toBe(
			EPUB_TUTORIAL_CONTENT_BY_LANG["en-US"]
		);
		expect(EPUB_TUTORIAL_CONTENT_BY_LANG["ru-RU"]).not.toBe(
			EPUB_TUTORIAL_CONTENT_BY_LANG["en-US"]
		);
		expect(ruRUTutorial.basics[0]?.title).not.toBe(enUSTutorial.basics[0]?.title);
	});

	it("keeps localized tutorial tab labels for ja, ko, and ru", () => {
		expect(EPUB_TUTORIAL_TABS_BY_LANG["ja-JP"][0]?.label).not.toBe(
			EPUB_TUTORIAL_TABS_BY_LANG["en-US"][0]?.label
		);
		expect(EPUB_TUTORIAL_TABS_BY_LANG["ko-KR"][0]?.label).toMatch(/[\uac00-\ud7af]/);
		expect(EPUB_TUTORIAL_TABS_BY_LANG["ru-RU"][0]?.label).toMatch(/[\u0400-\u04FF]/);
	});

	it("ships dedicated Traditional Chinese tutorial body", () => {
		expect(EPUB_TUTORIAL_CONTENT_BY_LANG["zh-TW"]).not.toBe(
			EPUB_TUTORIAL_CONTENT_BY_LANG["zh-CN"]
		);
		expect(EPUB_TUTORIAL_TABS_BY_LANG["zh-TW"][0]?.label).toBe("基礎閱讀");
	});

	it("preserves technical tutorial fields across localized bodies", () => {
		const englishWorkflow = enUSTutorial.workflow[2];
		for (const lang of LOCALIZED_LANGS) {
			const localizedWorkflow = EPUB_TUTORIAL_CONTENT_BY_LANG[lang].workflow[2];
			expect(localizedWorkflow?.code).toBe(englishWorkflow?.code);
		}
	});
});
