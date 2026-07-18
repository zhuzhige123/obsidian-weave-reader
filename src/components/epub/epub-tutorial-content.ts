export type TutorialTabId = "basics" | "highlight" | "workflow" | "tools" | "family" | "credits";

export interface TutorialTab {
	id: TutorialTabId;
	label: string;
}

export interface TutorialListGroup {
	heading?: string;
	items: string[];
}

export interface TutorialColorItem {
	tone: "yellow" | "green" | "blue" | "red" | "purple";
	label: string;
	description: string;
}

export interface TutorialShortcutItem {
	keys: string[];
	description: string;
}

export interface TutorialButtonItem {
	icon: string;
	label: string;
	description: string;
}

export interface TutorialLinkItem {
	label: string;
	url: string;
}

export interface TutorialSection {
	title: string;
	paragraphs?: string[];
	listGroups?: TutorialListGroup[];
	colors?: TutorialColorItem[];
	code?: string;
	shortcuts?: TutorialShortcutItem[];
	buttons?: TutorialButtonItem[];
	links?: TutorialLinkItem[];
}

import type { SupportedLanguage } from "../../utils/i18n";
import zhCNTutorial from "./tutorial-locales/zh-CN.json";
import zhTWTutorial from "./tutorial-locales/zh-TW.json";
import enUSTutorial from "./tutorial-locales/en-US.json";
import ruRUTutorial from "./tutorial-locales/ru-RU.json";

export type TutorialLanguage = "zh-CN" | "zh-TW" | "en-US" | "ja-JP" | "ko-KR" | "ru-RU";

export type TutorialContentByTab = Record<TutorialTabId, TutorialSection[]>;

export function resolveTutorialLanguage(language: SupportedLanguage): TutorialLanguage {
	switch (language) {
		case "zh-CN":
			return "zh-CN";
		case "zh-TW":
			return "zh-TW";
		case "ja-JP":
			return "ja-JP";
		case "ko-KR":
			return "ko-KR";
		case "ru-RU":
			return "ru-RU";
		default:
			return "en-US";
	}
}

export const EPUB_TUTORIAL_TABS_BY_LANG: Record<TutorialLanguage, TutorialTab[]> = {
	"zh-CN": [
		{ id: "basics", label: "基础阅读" },
		{ id: "highlight", label: "高亮与想法" },
		{ id: "workflow", label: "摘录工作流" },
		{ id: "tools", label: "工具联动" },
		{ id: "family", label: "Weave 系列" },
		{ id: "credits", label: "致谢" },
	],
	"zh-TW": [
		{ id: "basics", label: "基礎閱讀" },
		{ id: "highlight", label: "高亮與想法" },
		{ id: "workflow", label: "摘錄工作流" },
		{ id: "tools", label: "工具聯動" },
		{ id: "family", label: "Weave 系列" },
		{ id: "credits", label: "致謝" },
	],
	"en-US": [
		{ id: "basics", label: "Basics" },
		{ id: "highlight", label: "Highlights" },
		{ id: "workflow", label: "Workflow" },
		{ id: "tools", label: "Tools" },
		{ id: "family", label: "Weave family" },
		{ id: "credits", label: "Credits" },
	],
	"ja-JP": [
		{ id: "basics", label: "基本操作" },
		{ id: "highlight", label: "ハイライトと思考" },
		{ id: "workflow", label: "抜粋ワークフロー" },
		{ id: "tools", label: "ツール連携" },
		{ id: "family", label: "Weave シリーズ" },
		{ id: "credits", label: "謝辞" },
	],
	"ko-KR": [
		{ id: "basics", label: "기본 읽기" },
		{ id: "highlight", label: "하이라이트와 생각" },
		{ id: "workflow", label: "발췌 워크플로" },
		{ id: "tools", label: "도구 연동" },
		{ id: "family", label: "Weave 시리즈" },
		{ id: "credits", label: "감사의 말" },
	],
	"ru-RU": [
		{ id: "basics", label: "Основы" },
		{ id: "highlight", label: "Выделения и мысли" },
		{ id: "workflow", label: "Рабочий процесс" },
		{ id: "tools", label: "Инструменты" },
		{ id: "family", label: "Серия Weave" },
		{ id: "credits", label: "Благодарности" },
	],
};

export const EPUB_TUTORIAL_CONTENT_BY_LANG: Record<TutorialLanguage, TutorialContentByTab> = {
	"zh-CN": zhCNTutorial as TutorialContentByTab,
	"zh-TW": zhTWTutorial as TutorialContentByTab,
	"en-US": enUSTutorial as TutorialContentByTab,
	// The public repository does not contain dedicated ja-JP or ko-KR tutorial bodies.
	// Keep those interfaces usable with the complete English tutorial until translations ship.
	"ja-JP": enUSTutorial as TutorialContentByTab,
	"ko-KR": enUSTutorial as TutorialContentByTab,
	"ru-RU": ruRUTutorial as TutorialContentByTab,
};
