import "./utils/group-by-compat";
import "./utils/blob-url-registry";
import { Menu, Notice, Plugin, TAbstractFile, TFile, normalizePath } from "obsidian";
import { domInstanceOf } from "./utils/dom-instance-of";

import { EpubDataManagementModalObsidian } from "./components/epub/EpubDataManagementModalObsidian";
import { DEFAULT_EPUB_BOOKMARK_FOLDER } from "./config/epub-user-vault-folders";
import { isSupportedBookFile, isSupportedBookPath } from "./services/epub/book-format";
import {
	dispatchEpubBookshelfDataChanged,
	dispatchEpubBookshelfFullRefresh,
} from "./services/epub/bookshelf-data-events";
import {
	EPUB_RUNTIME,
	EpubStorageService,
	exportBookNotesToMarkdown,
	exportBookSectionToMarkdown,
	loadPublicationTocItems,
	navigateToPublicationChapter,
	buildPublicationChapterMarkdownLink,
	normalizeEpubBookmarkFolderPath,
	resetEpubStorageServiceCache,
	type TocItem,
} from "./services/epub";
import {
	DEFAULT_CONTINUOUS_READING_POSITION_AUTO_SAVE_ENABLED,
	DEFAULT_CONTINUOUS_READING_POSITION_AUTO_SAVE_PAGES,
	normalizeContinuousReadingPositionAutoSaveEnabled,
	normalizeContinuousReadingPositionAutoSavePages,
} from "./config/reading-position-auto-save";
import { PremiumFeatureGuard } from "./services/premium/PremiumFeatureGuard";
import { configureNavigationHub } from "./services/navigation/navigation-hub-access";
import { getBookSessionManager } from "./services/epub/session/book-session-manager-access";
import {
	registerEpubHost,
	resolveEpubHost,
	unregisterEpubHost,
	type EpubHostAISplitConfigModalInput,
	type EpubHostCapabilities,
	type EpubHostExportBookNotesInput,
	type EpubHostExportChapterInput,
	type EpubWeaveOfficialAPI,
} from "./services/epub";
import { EpubExcerptOfficialApiService } from "./services/epub/EpubExcerptOfficialApiService";
import {
	openEpubBookshelf,
	openEpubReader,
	registerEpubMarkdownPostProcessor,
	registerEpubProtocolHandler,
	registerEpubWorkspaceViews,
} from "./services/epub/epub-plugin-support";
import { getVisibleSplitActionsFromHost } from "./services/ai/ai-action-config";
import { aiConfigStore } from "./stores/ai-config.store";
import type {
	EffectiveLicenseState,
	LicenseInfo,
	LicenseStore,
	LicensedProduct,
} from "./types/license";
import { DEFAULT_LICENSE_INFO, DEFAULT_LICENSE_STORE } from "./types/license";
import {
	getWeaveMainPlugin,
	isWeaveMainPluginEnabled,
	requireWeaveMainPlugin,
} from "./utils/weave-reader-access";
import { safeOpenSettings } from "./utils/obsidian-api-safe";
import {
	getCompatibleAISelectedTextPanelHost,
	getInheritedLicensesFromLegacyWeave,
} from "./utils/plugin-access";
import {
	getLegacyPrimaryLicense,
	LICENSED_PRODUCTS,
	normalizeLicenseStore,
	resolveEffectiveLicenseState,
} from "./utils/license-state";
import { registerCanvasExcerptAnchorCacheWarmup } from "./services/epub/canvas-excerpt-anchor";
import { registerCanvasDirectionMenu } from "./services/epub/register-canvas-direction-menu";
import { registerCanvasExcerptAnchorMenu } from "./services/epub/register-canvas-excerpt-anchor-menu";
import { registerLicenseSyncBridge } from "./utils/license-sync-bridge";
import { licenseManager } from "./utils/licenseManager";
import { logger } from "./utils/logger";
import {
	initI18n,
	i18n,
	normalizeInterfaceLanguagePreference,
	setInterfaceLanguagePreference,
	syncI18nLanguage,
	type InterfaceLanguagePreference,
} from "./utils/i18n";
import { vaultStorage } from "./utils/vault-local-storage";
import type { AIConfig } from "./types/plugin-settings";
import {
	DEFAULT_BOOKSHELF_DISPLAY_MODE,
	normalizeBookshelfDisplayMode,
	type BookshelfDisplayMode,
} from "./services/epub/bookshelf-display-mode";
import {
	DEFAULT_SELECTION_TRANSLATION_SETTINGS,
	normalizeSelectionTranslationSettings,
	type SelectionTranslationSettings,
} from "./config/selection-translation-settings";

interface StandaloneEpubPluginSettings {
	license: LicenseInfo;
	licenseState: LicenseStore;
	aiConfig?: AIConfig;
	allowInheritedLicenses: boolean;
	enableDebugMode: boolean;
	showPremiumFeaturesPreview: boolean;
	bookshelfAutoViewByLocationEnabled: boolean;
	bookshelfDisplayMode: BookshelfDisplayMode;
	bookmarkFolder: string;
	continuousReadingPositionAutoSaveEnabled: boolean;
	continuousReadingPositionAutoSavePages: number;
	lastSelectedIRDeckId: string;
	selectionQuickCreateLastFolder: string;
	epubMarkdownExportLastFolder: string;
	sourceNavigationOpenInNewTab: boolean;
	interfaceLanguage: InterfaceLanguagePreference;
	selectionTranslation: SelectionTranslationSettings;
}

const DEFAULT_STANDALONE_EPUB_SETTINGS: StandaloneEpubPluginSettings = {
	license: DEFAULT_LICENSE_INFO,
	licenseState: DEFAULT_LICENSE_STORE,
	allowInheritedLicenses: true,
	enableDebugMode: false,
	showPremiumFeaturesPreview: false,
	bookshelfAutoViewByLocationEnabled: false,
	bookshelfDisplayMode: DEFAULT_BOOKSHELF_DISPLAY_MODE,
	bookmarkFolder: DEFAULT_EPUB_BOOKMARK_FOLDER,
	continuousReadingPositionAutoSaveEnabled:
		DEFAULT_CONTINUOUS_READING_POSITION_AUTO_SAVE_ENABLED,
	continuousReadingPositionAutoSavePages: DEFAULT_CONTINUOUS_READING_POSITION_AUTO_SAVE_PAGES,
	lastSelectedIRDeckId: "",
	selectionQuickCreateLastFolder: "",
	epubMarkdownExportLastFolder: "",
	sourceNavigationOpenInNewTab: true,
	interfaceLanguage: "auto",
	selectionTranslation: DEFAULT_SELECTION_TRANSLATION_SETTINGS,
};

type PersistedStandaloneEpubPluginSettings = Omit<
	StandaloneEpubPluginSettings,
	"lastSelectedIRDeckId" | "selectionQuickCreateLastFolder" | "epubMarkdownExportLastFolder"
>;

export type WeavePlugin = StandaloneEpubPlugin & Record<string, unknown>;

export default class StandaloneEpubPlugin extends Plugin implements EpubHostCapabilities {
	private workspaceViewsRegistered = false;
	private pendingBookshelfRefreshTimer: number | null = null;
	private epubStorageService: EpubStorageService | null = null;
	private epubOfficialApiService: EpubExcerptOfficialApiService | null = null;
	settings: StandaloneEpubPluginSettings = DEFAULT_STANDALONE_EPUB_SETTINGS;

	getLicensedProductId(): LicensedProduct {
		return LICENSED_PRODUCTS.EPUB;
	}

	getLocalLicenses(): LicenseInfo[] {
		return this.settings.licenseState?.localLicenses ?? [];
	}

	getInheritedLicenses(): LicenseInfo[] {
		if (this.settings.allowInheritedLicenses === false) {
			return [];
		}

		return getInheritedLicensesFromLegacyWeave(this.app);
	}

	getEffectiveLicenseState(): EffectiveLicenseState {
		return resolveEffectiveLicenseState({
			product: this.getLicensedProductId(),
			localLicenses: this.getLocalLicenses(),
			inheritedLicenses: this.getInheritedLicenses(),
		});
	}

	hasEpubPremiumAccess(): boolean {
		return PremiumFeatureGuard.getInstance().getEffectiveState().isPremiumActive;
	}

	openEpubPremiumSettings(): void {
		safeOpenSettings(this.app, this.manifest.id);
	}

	/** Weave 宿主可通过 `app.plugins.getPlugin("weave-epub-reader")` 调用 */
	openDataManagementModal(): void {
		new EpubDataManagementModalObsidian(this.app, {
			plugin: this,
		}).open();
	}

	async refreshPremiumState(): Promise<void> {
		await PremiumFeatureGuard.getInstance().updateLicenseState({
			product: this.getLicensedProductId(),
			localLicenses: this.getLocalLicenses(),
			inheritedLicenses: this.getInheritedLicenses(),
		});
	}

	private syncLicenseSettings(): boolean {
		const previousSnapshot = JSON.stringify({
			license: this.settings.license,
			licenseState: this.settings.licenseState,
		});
		const normalizedStore = normalizeLicenseStore(
			this.settings.license,
			this.settings.licenseState
		);
		this.settings.licenseState = normalizedStore;
		this.settings.license = getLegacyPrimaryLicense(normalizedStore.localLicenses);
		return (
			JSON.stringify({
				license: this.settings.license,
				licenseState: this.settings.licenseState,
			}) !== previousSnapshot
		);
	}

	private syncDebugSettings(): void {
		this.settings.enableDebugMode = this.settings.enableDebugMode === true;
		logger.setDebugMode(this.settings.enableDebugMode);
	}

	private syncPremiumPreviewSettings(): void {
		this.settings.showPremiumFeaturesPreview = this.settings.showPremiumFeaturesPreview === true;
		PremiumFeatureGuard.getInstance().setPremiumFeaturesPreview(
			this.settings.showPremiumFeaturesPreview
		);
	}

	private syncBookshelfDisplaySettings(): void {
		const normalizedMode = normalizeBookshelfDisplayMode(this.settings.bookshelfDisplayMode);
		this.settings.bookshelfDisplayMode =
			this.settings.bookshelfDisplayMode == null
				? this.settings.bookshelfAutoViewByLocationEnabled !== false
					? DEFAULT_BOOKSHELF_DISPLAY_MODE
					: "list"
				: normalizedMode;
		this.settings.bookshelfAutoViewByLocationEnabled =
			this.settings.bookshelfDisplayMode === DEFAULT_BOOKSHELF_DISPLAY_MODE;
	}

	private syncReadingPositionAutoSaveSettings(): void {
		this.settings.continuousReadingPositionAutoSaveEnabled =
			normalizeContinuousReadingPositionAutoSaveEnabled(
				this.settings.continuousReadingPositionAutoSaveEnabled
			);
		this.settings.continuousReadingPositionAutoSavePages =
			normalizeContinuousReadingPositionAutoSavePages(
				this.settings.continuousReadingPositionAutoSavePages
			);
	}

	getEpubStorageService(): EpubStorageService {
		if (!this.epubStorageService) {
			this.epubStorageService = new EpubStorageService(this.app);
		}
		return this.epubStorageService;
	}

	/** standalone IR 导入 EPUB/书籍时读取目录；宿主通过 `plugins.getPlugin("weave-epub-reader")` 调用 */
	async loadPublicationTocItems(filePath: string): Promise<TocItem[]> {
		return loadPublicationTocItems(this.app, filePath);
	}

	/** standalone IR 打开章节阅读点；优先于 IR 侧直接写 leaf state */
	async navigateToPublicationChapter(
		filePath: string,
		tocHref: string,
		options?: { sourceId?: string; sourceMarkdownPath?: string }
	): Promise<void> {
		return navigateToPublicationChapter(this.app, filePath, tocHref, options);
	}

	buildPublicationChapterMarkdownLink(
		filePath: string,
		tocHref: string,
		chapterTitle?: string,
		sourceId?: string,
		chapterIndex?: number
	): string {
		return buildPublicationChapterMarkdownLink(
			this.app,
			filePath,
			tocHref,
			chapterTitle,
			sourceId,
			chapterIndex
		);
	}

	getOfficialAPI(): EpubWeaveOfficialAPI {
		if (!this.epubOfficialApiService) {
			this.epubOfficialApiService = new EpubExcerptOfficialApiService(this.app);
		}
		return this.epubOfficialApiService;
	}

	private getPersistedSettings(): PersistedStandaloneEpubPluginSettings {
		const {
			lastSelectedIRDeckId,
			selectionQuickCreateLastFolder,
			epubMarkdownExportLastFolder,
			...persistedSettings
		} = this.settings;
		void lastSelectedIRDeckId;
		void selectionQuickCreateLastFolder;
		void epubMarkdownExportLastFolder;
		return persistedSettings;
	}

	private getRememberedUiMemory() {
		return {
			lastSelectedIRDeckId: String(this.settings.lastSelectedIRDeckId || "").trim(),
			selectionQuickCreateLastFolder: this.normalizeRememberedFolder(
				this.settings.selectionQuickCreateLastFolder
			),
			epubMarkdownExportLastFolder: this.normalizeRememberedFolder(
				this.settings.epubMarkdownExportLastFolder
			),
		};
	}

	private hasLegacyRememberedUiKeys(value: unknown): boolean {
		if (!value || typeof value !== "object") {
			return false;
		}
		return [
			"lastSelectedIRDeckId",
			"selectionQuickCreateLastFolder",
			"epubMarkdownExportLastFolder",
		].some((key) => key in value);
	}

	private normalizeLoadedSettings(raw: unknown): Partial<PersistedStandaloneEpubPluginSettings> {
		if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
			return {};
		}
		return raw;
	}

	private async persistSettingsData(): Promise<void> {
		await this.saveData(this.getPersistedSettings());
	}

	async loadSettings(): Promise<void> {
		const loadedData = this.normalizeLoadedSettings(await this.loadData());
		this.settings = {
			...DEFAULT_STANDALONE_EPUB_SETTINGS,
			...loadedData,
		};
		this.settings.bookmarkFolder =
			normalizeEpubBookmarkFolderPath(this.settings.bookmarkFolder) || DEFAULT_EPUB_BOOKMARK_FOLDER;
		this.settings.selectionQuickCreateLastFolder = this.normalizeRememberedFolder(
			this.settings.selectionQuickCreateLastFolder
		);
		this.settings.epubMarkdownExportLastFolder = this.normalizeRememberedFolder(
			this.settings.epubMarkdownExportLastFolder
		);
		this.settings.lastSelectedIRDeckId = String(this.settings.lastSelectedIRDeckId || "").trim();
		const hasLocalUiMemory = await this.getEpubStorageService().hasPluginUiMemory();
		const localUiMemory = await this.getEpubStorageService().loadPluginUiMemory();
		this.settings.selectionQuickCreateLastFolder = this.normalizeRememberedFolder(
			hasLocalUiMemory
				? localUiMemory.selectionQuickCreateLastFolder
				: localUiMemory.selectionQuickCreateLastFolder || this.settings.selectionQuickCreateLastFolder
		);
		this.settings.epubMarkdownExportLastFolder = this.normalizeRememberedFolder(
			hasLocalUiMemory
				? localUiMemory.epubMarkdownExportLastFolder
				: localUiMemory.epubMarkdownExportLastFolder || this.settings.epubMarkdownExportLastFolder
		);
		this.settings.lastSelectedIRDeckId =
			String(
				hasLocalUiMemory
					? localUiMemory.lastSelectedIRDeckId
					: localUiMemory.lastSelectedIRDeckId || this.settings.lastSelectedIRDeckId || ""
			).trim();
		const licenseSettingsChanged = this.syncLicenseSettings();
		this.syncDebugSettings();
		this.syncPremiumPreviewSettings();
		this.syncBookshelfDisplaySettings();
		this.syncReadingPositionAutoSaveSettings();
		this.syncSelectionTranslationSettings();
		this.settings.sourceNavigationOpenInNewTab = this.settings.sourceNavigationOpenInNewTab !== false;
		this.settings.interfaceLanguage = normalizeInterfaceLanguagePreference(
			this.settings.interfaceLanguage
		);
		setInterfaceLanguagePreference(this.settings.interfaceLanguage);
		if (licenseSettingsChanged || this.hasLegacyRememberedUiKeys(loadedData)) {
			if (this.hasLegacyRememberedUiKeys(loadedData)) {
				await this.getEpubStorageService().savePluginUiMemory(this.getRememberedUiMemory());
			}
			await this.persistSettingsData();
		}
	}

	async saveSettings(): Promise<void> {
		this.syncLicenseSettings();
		this.settings.interfaceLanguage = normalizeInterfaceLanguagePreference(
			this.settings.interfaceLanguage
		);
		setInterfaceLanguagePreference(this.settings.interfaceLanguage);
		syncI18nLanguage();

		this.syncDebugSettings();
		this.syncPremiumPreviewSettings();
		this.syncBookshelfDisplaySettings();
		this.syncReadingPositionAutoSaveSettings();
		this.syncSelectionTranslationSettings();
		this.settings.bookmarkFolder =
			normalizeEpubBookmarkFolderPath(this.settings.bookmarkFolder) || DEFAULT_EPUB_BOOKMARK_FOLDER;
		this.settings.selectionQuickCreateLastFolder = this.normalizeRememberedFolder(
			this.settings.selectionQuickCreateLastFolder
		);
		this.settings.epubMarkdownExportLastFolder = this.normalizeRememberedFolder(
			this.settings.epubMarkdownExportLastFolder
		);
		this.settings.lastSelectedIRDeckId = String(this.settings.lastSelectedIRDeckId || "").trim();
		await this.getEpubStorageService().savePluginUiMemory(this.getRememberedUiMemory());
		await this.persistSettingsData();
		await this.refreshPremiumState();
	}

	private syncSelectionTranslationSettings(): void {
		this.settings.selectionTranslation = normalizeSelectionTranslationSettings(
			this.settings.selectionTranslation
		);
	}

	private normalizeRememberedFolder(folderPath?: string | null): string {
		const raw = String(folderPath || "").trim();
		if (!raw) {
			return "";
		}
		if (raw === "/" || raw === ".") {
			return "/";
		}
		return normalizePath(raw);
	}

	private extractParentFolder(filePath: string): string {
		const normalized = normalizePath(String(filePath || "").trim());
		const slashIndex = normalized.lastIndexOf("/");
		if (slashIndex <= 0) {
			return "/";
		}
		return normalizePath(normalized.slice(0, slashIndex));
	}

	private async persistPreferenceSettings(): Promise<void> {
		this.settings.selectionQuickCreateLastFolder = this.normalizeRememberedFolder(
			this.settings.selectionQuickCreateLastFolder
		);
		this.settings.epubMarkdownExportLastFolder = this.normalizeRememberedFolder(
			this.settings.epubMarkdownExportLastFolder
		);
		this.settings.lastSelectedIRDeckId = String(this.settings.lastSelectedIRDeckId || "").trim();
		await this.getEpubStorageService().savePluginUiMemory(this.getRememberedUiMemory());
		await this.persistSettingsData();
	}

	private queueBookshelfRefreshEvent(fullRefresh = true): void {
		if (typeof window === "undefined") {
			return;
		}
		if (this.pendingBookshelfRefreshTimer !== null) {
			window.clearTimeout(this.pendingBookshelfRefreshTimer);
		}
		this.pendingBookshelfRefreshTimer = window.setTimeout(() => {
			this.pendingBookshelfRefreshTimer = null;
			if (fullRefresh) {
				dispatchEpubBookshelfFullRefresh();
				return;
			}
			dispatchEpubBookshelfDataChanged();
		}, 120);
	}

	private registerBookshelfVaultRefreshBridge(): void {
		this.registerEvent(
			this.app.vault.on("create", (file: TAbstractFile) => {
				if (isSupportedBookFile(file)) {
					this.queueBookshelfRefreshEvent(true);
				}
			})
		);
		this.registerEvent(
			this.app.vault.on("modify", (file: TAbstractFile) => {
				if (isSupportedBookFile(file)) {
					this.queueBookshelfRefreshEvent(false);
				}
			})
		);
		this.registerEvent(
			this.app.vault.on("delete", (file: TAbstractFile) => {
				if (isSupportedBookPath(file.path)) {
					this.queueBookshelfRefreshEvent(true);
				}
			})
		);
		this.registerEvent(
			this.app.vault.on("rename", (file: TAbstractFile, oldPath: string) => {
				if (isSupportedBookPath(oldPath) || isSupportedBookFile(file)) {
					this.queueBookshelfRefreshEvent(true);
				}
			})
		);
	}

	private registerWorkspaceViews(): void {
		if (this.workspaceViewsRegistered) {
			return;
		}

		registerEpubWorkspaceViews(
			this,
			"[Standalone EPUB]",
			i18n.t("epub.commands.standalonePluginLabel")
		);
		this.workspaceViewsRegistered = true;
	}

	private notifyWeaveRequired(): void {
		new Notice(i18n.t("epub.reader.weaveRequired"));
	}

	openSelectedTextAISplitMenu(options: {
		event: MouseEvent | KeyboardEvent;
		selectedText: string;
		onSelectAction: (actionId: string) => void;
	}): void {
		if (!isWeaveMainPluginEnabled(this.app)) {
			this.notifyWeaveRequired();
			return;
		}

		const actions = getVisibleSplitActionsFromHost(
			getCompatibleAISelectedTextPanelHost(this.app) ?? this
		);
		const menu = new Menu();
		if (actions.length > 0) {
			for (const action of actions) {
				menu.addItem((item) => {
					item.setTitle(action.name);
					item.setIcon(action.icon || "sparkles");
					item.onClick(() => {
						options.onSelectAction(action.id);
					});
				});
			}
		} else {
			menu.addItem((item) => {
				item.setTitle(i18n.t("epub.commands.aiSplitUnavailable"));
				item.setIcon("info");
				item.setDisabled(true);
			});
		}

		menu.addSeparator();
		menu.addItem((item) => {
			item.setTitle(i18n.t("epub.commands.aiSplitConfig"));
			item.setIcon("settings");
			item.onClick(() => {
				if (!this.tryOpenAISplitConfigModalFromMainPlugin()) {
					safeOpenSettings(this.app, this.manifest.id);
				}
			});
		});

		if (domInstanceOf(options.event, MouseEvent)) {
			menu.showAtMouseEvent(options.event);
			return;
		}

		const eventTarget = options.event.target;
		const target = domInstanceOf(eventTarget, HTMLElement) ? eventTarget : null;
		if (target) {
			const rect = target.getBoundingClientRect();
			menu.showAtPosition({ x: rect.left, y: rect.bottom + 4 });
			return;
		}

		menu.showAtPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
	}

	private tryOpenAISplitConfigModalFromMainPlugin(): boolean {
		const input: EpubHostAISplitConfigModalInput = { mode: "split" };
		const host = resolveEpubHost(this.app);
		const openAISplitConfigModal = host?.openAISplitConfigModal;
		if (typeof openAISplitConfigModal !== "function") {
			return false;
		}

		try {
			openAISplitConfigModal(input);
			return true;
		} catch (error) {
			void error;
			return false;
		}
	}

	async openSelectedTextAIPanelFromEpub(input: {
		filePath: string;
		selectedText: string;
		actionId: string;
		sourceLink?: string;
	}): Promise<void> {
		const weave = requireWeaveMainPlugin(this.app);
		if (!weave?.openSelectedTextAIPanelFromEpub) {
			this.notifyWeaveRequired();
			return;
		}
		await weave.openSelectedTextAIPanelFromEpub(input);
	}

	async closeSelectedTextAIPanelFromEpub(filePath: string): Promise<void> {
		const weave = getWeaveMainPlugin(this.app);
		await weave?.closeSelectedTextAIPanelFromEpub?.(filePath);
	}

	async onload(): Promise<void> {
		await this.loadSettings();
		await vaultStorage.initialize(this.app);
		initI18n(this.settings.interfaceLanguage);
		licenseManager.initializeCloud(this.app);
		registerEpubHost(this.app, this);
		configureNavigationHub(this.app, {
			getSourceNavigationOpenInNewTab: () => this.settings.sourceNavigationOpenInNewTab !== false,
			getEnableDebugMode: () => this.settings.enableDebugMode === true,
		});
		getBookSessionManager(this.app, {
			cardSyncDedupeMs: 600,
			getEnableDebugMode: () => this.settings.enableDebugMode === true,
		});
		aiConfigStore.initialize(this);
		const { EpubSettingsTab } = await import("./components/settings/EpubSettingsTab");
		this.addSettingTab(new EpubSettingsTab(this.app, this));
		await PremiumFeatureGuard.getInstance().initializeForProduct({
			product: this.getLicensedProductId(),
			localLicenses: this.getLocalLicenses(),
			inheritedLicenses: this.getInheritedLicenses(),
		});
		registerLicenseSyncBridge(this, this);
		registerCanvasExcerptAnchorMenu(this);
		registerCanvasDirectionMenu(this);
		registerCanvasExcerptAnchorCacheWarmup(this);
		this.registerWorkspaceViews();
		registerEpubMarkdownPostProcessor(this, this.app);
		registerEpubProtocolHandler(this, this.app, "[Standalone EPUB Protocol]");
		this.registerBookshelfVaultRefreshBridge();
		const {
			bootstrapEpubAnnotationIndex,
			scheduleEpubAnnotationIndexWarmup,
		} = await import("./services/epub/epub-annotation-index");
		this.registerEvent(
			this.app.workspace.on("layout-ready", () => {
				bootstrapEpubAnnotationIndex(this.app);
				void import("./services/epub/epub-bookmark-migration").then(({ maybePromptEpubBookmarkV3Migration }) =>
					maybePromptEpubBookmarkV3Migration(this.app)
				);
			})
		);
		scheduleEpubAnnotationIndexWarmup(this.app);
		this.registerDomEvent(
			window,
			EPUB_RUNTIME.events.bookshelfDataChanged as keyof WindowEventMap,
			() => {
				scheduleEpubAnnotationIndexWarmup(this.app, 8_000);
			}
		);
		this.registerEvent(this.app.workspace.on("layout-change", () => {
			syncI18nLanguage();
		}));
		this.registerDomEvent(window, "focus", () => {
			syncI18nLanguage();
		});
		this.registerDomEvent(activeDocument, "visibilitychange", () => {
			if (!activeDocument.hidden) {
				syncI18nLanguage();
			}
		});
		this.addRibbonIcon("library", i18n.t("views.epubBookshelfSidebar.title"), () => {
			void this.openEpubBookshelf();
		});

		this.addCommand({
			id: "open-epub-bookshelf",
			name: i18n.t("views.epubBookshelfSidebar.title"),
			callback: () => {
				void this.openEpubBookshelf();
			},
		});
		this.addCommand({
			id: "open-active-epub-reader",
			name: i18n.t("commands.openEpubReader.name"),
			checkCallback: (checking) => {
				const activeFile = this.app.workspace.getActiveFile();
				const canOpen = activeFile instanceof TFile && isSupportedBookFile(activeFile);
				if (!checking && canOpen) {
					void this.openEpubReader(activeFile.path);
				}
				return canOpen;
			},
		});
	}

	onunload(): void {
		if (this.pendingBookshelfRefreshTimer !== null && typeof window !== "undefined") {
			window.clearTimeout(this.pendingBookshelfRefreshTimer);
			this.pendingBookshelfRefreshTimer = null;
		}
		this.epubStorageService = null;
		resetEpubStorageServiceCache(this.app);
		logger.setDebugMode(false);
		unregisterEpubHost(this.app);
	}

	private async openEpubBookshelf(): Promise<void> {
		await openEpubBookshelf(
			this.app,
			"[Standalone EPUB]",
			`${i18n.t("views.epubBookshelfSidebar.title")}${i18n.t("notifications.error.openFailed")}`
		);
	}

	async openEpubReader(filePath: string): Promise<void> {
		await openEpubReader(
			this.app,
			filePath,
			"[Standalone EPUB]",
			i18n.t("views.epubView.notice.bookFileMissing"),
			i18n.t("views.epubView.notice.bookOpenFailed")
		);
	}

	async exportEpubChapterToMarkdown(input: EpubHostExportChapterInput): Promise<void> {
		const exportedFile = await exportBookSectionToMarkdown(this.app, {
			...input,
			lastSelectedFolder: this.settings.epubMarkdownExportLastFolder,
		});
		this.settings.epubMarkdownExportLastFolder = this.extractParentFolder(exportedFile.path);
		await this.persistPreferenceSettings();
	}

	async exportEpubBookNotesToMarkdown(input: EpubHostExportBookNotesInput): Promise<void> {
		const exportedFile = await exportBookNotesToMarkdown(this.app, {
			...input,
			lastSelectedFolder: this.settings.epubMarkdownExportLastFolder,
		});
		this.settings.epubMarkdownExportLastFolder = this.extractParentFolder(exportedFile.path);
		await this.persistPreferenceSettings();
	}
}
