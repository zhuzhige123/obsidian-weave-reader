<script lang="ts">
  import TabNavigation from "../ui/TabNavigation.svelte";
  import { tr } from "../../utils/i18n";
  import type StandaloneEpubPlugin from "../../main";
  import type { EpubSettingsTabId } from "./epub-settings-types";
  import EpubSettingsBasicTab from "./EpubSettingsBasicTab.svelte";
  import EpubSettingsAboutTab from "./EpubSettingsAboutTab.svelte";
  import "../../styles/epub/epub-settings-panel.css";

  interface Props {
    plugin: StandaloneEpubPlugin;
  }

  let { plugin }: Props = $props();
  let t = $derived($tr);
  let activeTab = $state<EpubSettingsTabId>("basic");

  let tabs = $derived.by<Array<{ id: EpubSettingsTabId; label: string; icon: string }>>(() => [
    { id: "basic", label: t("epub.settings.tabs.basic"), icon: "" },
    { id: "about", label: t("epub.settings.tabs.about"), icon: "" },
  ]);

  function switchTab(tabId: EpubSettingsTabId): void {
    activeTab = tabId;
  }
</script>

<div class="epub-settings-root">
  <div class="epub-settings-tabs">
    <TabNavigation
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => switchTab(tabId as EpubSettingsTabId)}
      useObsidianIcons={false}
      variant="plain"
    />
  </div>

  <div class="epub-settings-tab-panel" id={`epub-settings-panel-${activeTab}`}>
    {#if activeTab === "basic"}
      <EpubSettingsBasicTab {plugin} />
    {/if}

    {#if activeTab === "about"}
      <EpubSettingsAboutTab {plugin} />
    {/if}
  </div>
</div>
