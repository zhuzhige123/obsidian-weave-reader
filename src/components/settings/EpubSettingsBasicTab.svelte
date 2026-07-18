<script lang="ts">
  import type { TextComponent } from "obsidian";
  import { onMount, untrack } from "svelte";
  import {
    normalizeContinuousReadingPositionAutoSaveEnabled,
    normalizeContinuousReadingPositionAutoSavePages,
  } from "../../config/reading-position-auto-save";
  import { normalizeSelectionTranslationSettings } from "../../config/selection-translation-settings";
  import { EPUB_ALL_LOCAL_FEATURES_ENABLED } from "../../config/epub-feature-tier";
  import { EPUB_RUNTIME, normalizeEpubBookmarkFolderPath } from "../../services/epub";
  import type { CustomWebTranslationProvider } from "../../config/selection-translation-settings";
  import { normalizeInterfaceLanguagePreference, tr } from "../../utils/i18n";
  import type StandaloneEpubPlugin from "../../main";
  import { createEpubBasicSettingsActions } from "./epub-basic-settings-actions";
  import { mountEpubBasicSettings } from "./mount-epub-basic-settings";

  interface Props {
    plugin: StandaloneEpubPlugin;
  }

  let { plugin }: Props = $props();
  let t = $derived($tr);

  let stateVersion = $state(0);
  let excerptSettingsVersion = $state(0);
  let interfaceSettingsHost = $state<HTMLDivElement | null>(null);
  let premiumPreviewSettingsHost = $state<HTMLDivElement | null>(null);
  let readingSettingsHost = $state<HTMLDivElement | null>(null);
  let selectionTranslationSettingsHost = $state<HTMLDivElement | null>(null);
  let diagnosticsSettingsHost = $state<HTMLDivElement | null>(null);

  let bookmarkFolderInput = $state("");
  let bookNotesExportTemplateFolderInput = $state("");
  let bookNotesExportTemplateFolderValue = $state("");
  let bookNotesExportDefaultTemplatePath = $state("");
  let excerptFolderSettingsLoaded = $state(false);
  let continuousReadingPositionAutoSavePagesInput = $state("");
  let customTranslationProviderDrafts = $state<CustomWebTranslationProvider[]>([]);
  let autoSavePagesTextControl = $state<TextComponent | null>(null);

  async function save(): Promise<void> {
    await plugin.saveSettings();
    stateVersion += 1;
  }

  let bookmarkFolderValue = $derived.by(() => {
    stateVersion;
    return normalizeEpubBookmarkFolderPath(plugin.settings?.bookmarkFolder);
  });

  let debugModeEnabled = $derived.by(() => {
    stateVersion;
    return plugin.settings?.enableDebugMode === true;
  });

  let sourceNavigationOpenInNewTab = $derived.by(() => {
    stateVersion;
    return plugin.settings?.sourceNavigationOpenInNewTab !== false;
  });

  let continuousReadingPositionAutoSaveEnabled = $derived.by(() => {
    stateVersion;
    return normalizeContinuousReadingPositionAutoSaveEnabled(
      plugin.settings?.continuousReadingPositionAutoSaveEnabled
    );
  });

  let continuousReadingPositionAutoSavePages = $derived.by(() => {
    stateVersion;
    return normalizeContinuousReadingPositionAutoSavePages(
      plugin.settings?.continuousReadingPositionAutoSavePages
    );
  });

  let premiumPreviewEnabled = $derived.by(() => {
    stateVersion;
    return plugin.settings?.showPremiumFeaturesPreview === true;
  });

  let interfaceLanguageValue = $derived.by(() => {
    stateVersion;
    return normalizeInterfaceLanguagePreference(plugin.settings?.interfaceLanguage);
  });

  let selectionTranslationSettings = $derived.by(() => {
    stateVersion;
    return normalizeSelectionTranslationSettings(plugin.settings?.selectionTranslation);
  });

  let selectionTranslationCustomProviderCount = $derived.by(() => {
    stateVersion;
    return selectionTranslationSettings.customProviders.length;
  });

  function updateCustomTranslationProviderDraft(
    index: number,
    patch: Partial<CustomWebTranslationProvider>
  ): void {
    customTranslationProviderDrafts = customTranslationProviderDrafts.map((provider, providerIndex) =>
      providerIndex === index ? { ...provider, ...patch } : provider
    );
  }

  const actions = createEpubBasicSettingsActions({
    plugin,
    getTranslate: () => t,
    getBookmarkFolderValue: () => bookmarkFolderValue,
    getInterfaceLanguageValue: () => interfaceLanguageValue,
    getPremiumPreviewEnabled: () => premiumPreviewEnabled,
    getContinuousReadingPositionAutoSaveEnabled: () => continuousReadingPositionAutoSaveEnabled,
    getContinuousReadingPositionAutoSavePages: () => continuousReadingPositionAutoSavePages,
    getSourceNavigationOpenInNewTab: () => sourceNavigationOpenInNewTab,
    getDebugModeEnabled: () => debugModeEnabled,
    getBookNotesExportTemplateFolderValue: () => bookNotesExportTemplateFolderValue,
    getBookNotesExportDefaultTemplatePath: () => bookNotesExportDefaultTemplatePath,
    getCustomTranslationProviderDrafts: () => customTranslationProviderDrafts,
    getAutoSavePagesTextControl: () => autoSavePagesTextControl,
    setBookmarkFolderInput: (value) => {
      bookmarkFolderInput = value;
    },
    setBookNotesExportTemplateFolderInput: (value) => {
      bookNotesExportTemplateFolderInput = value;
    },
    setBookNotesExportTemplateFolderValue: (value) => {
      bookNotesExportTemplateFolderValue = value;
    },
    setBookNotesExportDefaultTemplatePath: (value) => {
      bookNotesExportDefaultTemplatePath = value;
    },
    setContinuousReadingPositionAutoSavePagesInput: (value) => {
      continuousReadingPositionAutoSavePagesInput = value;
    },
    setExcerptSettingsVersion: (updater) => {
      excerptSettingsVersion = updater(excerptSettingsVersion);
    },
    save,
  });

  $effect(() => {
    bookmarkFolderValue;
    bookmarkFolderInput = bookmarkFolderValue;
  });

  $effect(() => {
    continuousReadingPositionAutoSavePages;
    continuousReadingPositionAutoSavePagesInput = String(continuousReadingPositionAutoSavePages);
  });

  $effect(() => {
    selectionTranslationCustomProviderCount;
    customTranslationProviderDrafts = structuredClone(
      normalizeSelectionTranslationSettings(plugin.settings?.selectionTranslation).customProviders
    );
  });

  onMount(() => {
    void (async () => {
      await actions.refreshBookNotesExportTemplateFolder();
      excerptFolderSettingsLoaded = true;
    })();
    const handleExcerptSettingsChanged = () => {
      void actions.refreshBookNotesExportTemplateFolder();
    };
    if (typeof window !== "undefined") {
      window.addEventListener(
        EPUB_RUNTIME.events.excerptSettingsChanged,
        handleExcerptSettingsChanged
      );
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          EPUB_RUNTIME.events.excerptSettingsChanged,
          handleExcerptSettingsChanged
        );
      }
    };
  });

  $effect(() => {
    if (
      !excerptFolderSettingsLoaded
      || !interfaceSettingsHost
      || !premiumPreviewSettingsHost
      || !readingSettingsHost
      || !selectionTranslationSettingsHost
      || !diagnosticsSettingsHost
    ) {
      return;
    }

    excerptSettingsVersion;
    t;
    selectionTranslationCustomProviderCount;

    let dispose: (() => void) | undefined;

    untrack(() => {
      dispose = mountEpubBasicSettings({
        plugin,
        t,
        hosts: {
          interface: interfaceSettingsHost,
          premiumPreview: premiumPreviewSettingsHost,
          reading: readingSettingsHost,
          selectionTranslation: selectionTranslationSettingsHost,
          diagnostics: diagnosticsSettingsHost,
        },
        snapshot: {
          interfaceLanguageValue,
          premiumPreviewEnabled,
          bookmarkFolderValue,
          bookmarkFolderInput,
          bookNotesExportTemplateFolderValue,
          bookNotesExportTemplateFolderInput,
          bookNotesExportDefaultTemplatePath,
          continuousReadingPositionAutoSaveEnabled,
          continuousReadingPositionAutoSavePages,
          continuousReadingPositionAutoSavePagesInput,
          sourceNavigationOpenInNewTab,
          debugModeEnabled,
          selectionTranslationSettings,
          customTranslationProviderDrafts,
        },
        callbacks: {
          save,
          setBookmarkFolderInput: (value) => {
            bookmarkFolderInput = value;
          },
          setBookNotesExportTemplateFolderInput: (value) => {
            bookNotesExportTemplateFolderInput = value;
          },
          setContinuousReadingPositionAutoSavePagesInput: (value) => {
            continuousReadingPositionAutoSavePagesInput = value;
          },
          setAutoSavePagesTextControl: (control) => {
            autoSavePagesTextControl = control;
          },
          updateBookmarkFolder: actions.updateBookmarkFolder,
          updateInterfaceLanguage: actions.updateInterfaceLanguage,
          updatePremiumPreview: actions.updatePremiumPreview,
          updateBookNotesExportTemplatePath: actions.updateBookNotesExportTemplatePath,
          updateBookNotesExportTemplateFolder: actions.updateBookNotesExportTemplateFolder,
          openBookNotesExportTemplateModal: actions.openBookNotesExportTemplateModal,
          updateContinuousReadingPositionAutoSaveEnabled:
            actions.updateContinuousReadingPositionAutoSaveEnabled,
          updateContinuousReadingPositionAutoSavePages:
            actions.updateContinuousReadingPositionAutoSavePages,
          setBuiltinTranslationProviderEnabled: actions.setBuiltinTranslationProviderEnabled,
          updateCustomTranslationProvider: actions.updateCustomTranslationProvider,
          updateCustomTranslationProviderDraft,
          commitCustomTranslationProviderDrafts: actions.commitCustomTranslationProviderDrafts,
          addCustomTranslationProvider: actions.addCustomTranslationProvider,
          removeCustomTranslationProvider: actions.removeCustomTranslationProvider,
          updateSourceNavigationOpenInNewTab: actions.updateSourceNavigationOpenInNewTab,
          updateDebugMode: actions.updateDebugMode,
        },
      });
    });

    return () => dispose?.();
  });
</script>

<section class="epub-settings-section epub-settings-section--compact">
  <div class="epub-settings-group epub-settings-group--panel epub-settings-group--preview-first">
    <div class="epub-settings-group-header">
      <h3 class="epub-settings-group-title with-accent-bar accent-cyan">{t("epub.settings.groups.interface")}</h3>
    </div>
    <div bind:this={interfaceSettingsHost} class="epub-native-settings-host"></div>
  </div>

  {#if EPUB_ALL_LOCAL_FEATURES_ENABLED}
    <div bind:this={premiumPreviewSettingsHost} hidden></div>
  {:else}
    <div class="epub-settings-group epub-settings-group--panel">
      <div class="epub-settings-group-header">
        <h3 class="epub-settings-group-title with-accent-bar accent-purple">{t("epub.settings.groups.premiumPreview")}</h3>
      </div>
      <div bind:this={premiumPreviewSettingsHost} class="epub-native-settings-host"></div>
    </div>
  {/if}

  <div class="epub-settings-group epub-settings-group--panel">
    <div class="epub-settings-group-header">
      <h3 class="epub-settings-group-title with-accent-bar accent-purple">{t("epub.settings.groups.reading")}</h3>
    </div>
    <div bind:this={readingSettingsHost} class="epub-native-settings-host"></div>
  </div>

  <div class="epub-settings-group epub-settings-group--panel">
    <div class="epub-settings-group-header">
      <h3 class="epub-settings-group-title with-accent-bar accent-cyan">{t("epub.settings.groups.selectionTranslation")}</h3>
      <p class="epub-settings-group-description">{t("epub.settings.basic.selectionTranslationDesc")}</p>
    </div>
    <div bind:this={selectionTranslationSettingsHost} class="epub-native-settings-host"></div>
  </div>

  <div class="epub-settings-group epub-settings-group--panel">
    <div class="epub-settings-group-header">
      <h3 class="epub-settings-group-title with-accent-bar accent-cyan">{t("epub.settings.groups.diagnostics")}</h3>
    </div>
    <div bind:this={diagnosticsSettingsHost} class="epub-native-settings-host"></div>
  </div>
</section>
