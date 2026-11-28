# Weave Reader

<p>
<a href="https://github.com/zhuzhige123/obsidian-weave-reader/releases"><img alt="downloads" src="https://img.shields.io/github/downloads/zhuzhige123/obsidian-weave-reader/total"></a>
<a href="https://github.com/zhuzhige123/obsidian-weave-reader/releases"><img alt="release" src="https://img.shields.io/github/v/release/zhuzhige123/obsidian-weave-reader?display_name=tag&label=release"></a>
<a href="./LICENSE"><img alt="license" src="https://img.shields.io/github/license/zhuzhige123/obsidian-weave-reader"></a>
<a href="https://obsidian.md/plugins?search=weave%20reader"><img alt="Obsidian Plugin" src="https://img.shields.io/badge/Obsidian-Plugin-blue?logo=obsidian&logoColor=white"></a>
<a href="https://github.com/zhuzhige123/obsidian-weave-reader/stargazers"><img alt="stars" src="https://img.shields.io/github/stars/zhuzhige123/obsidian-weave-reader"></a>
</p>

**Weave Reader** embeds reading into Obsidian’s knowledge workflow: immerse yourself in multi-format ebooks inside your vault; excerpts and thoughts can go into Markdown, Canvas, or the Weave memory system, with book anchors so notes and source text jump to each other. Typography can follow Obsidian; excerpt and bookshelf data live in your vault files—not locked inside a closed reading app.

**Languages:** [English](#english-documentation) · [简体中文](#中文文档) · [繁體中文](./README.zh-TW.md) · [Español](./README.es.md) · [Français](./README.fr.md) · [日本語](./README.ja.md) · [한국어](./README.ko.md) · [Русский](./README.ru.md) · [العربية](./README.ar.md)

> **Core reading and excerpting are free. A few advanced features require Premium to support ongoing development; the plugin has gone through 100+ releases and is ready for long-term use. Thanks for your support!**

![855c94b5-37e2-4427-93b5-b8a8ac45b3a5](https://github.com/user-attachments/assets/bf74db5e-6cc3-4a4d-b92d-e6ae24923e5f)


![Obsidian阅读器插件宣传图设计方案 (7)](https://github.com/user-attachments/assets/c525e2b6-3104-4f6a-bbff-8ff9d2fda93c)




![QQ_2026-11-20_08-34-15-HD](https://github.com/user-attachments/assets/5547fe6e-e6dc-4f48-b62e-d12c1c9ed3ba)



![Obsidian阅读器插件宣传图设计方案 (8)](https://github.com/user-attachments/assets/acb01ef7-c7be-4940-ab3d-4bd66dfdbe88)



![image](https://github.com/user-attachments/assets/ee9e6de7-6a70-4d9d-9343-ae9c6bd5e8aa)


![image](https://github.com/user-attachments/assets/23ac14bd-3357-4673-8e81-740cb0114b38)


![image](https://github.com/user-attachments/assets/70624f14-35c1-4447-8387-adc90df0f415)

![image](https://github.com/user-attachments/assets/868f5bbe-b80c-4b8c-b028-5c6142dd3497)

---

## English Documentation

### Overview

| Concept | Meaning |
|---------|---------|
| **Bookshelf** | Import, covers, progress, search/filter, reading status; main-area homepage |
| **Excerpt** | Highlights, thoughts, and notes saved into Markdown / Canvas / decks with book anchors |
| **Trace** | Jump between the book passage and the note that holds the excerpt |

It is a reader in the **Obsidian Weave plugin series** (exactly three plugins: Weave Review, Weave Reader, and Weave Incremental Reading). It works **standalone**—Weave Review is optional.

Minimum Obsidian version: **1.8.7**. Desktop and mobile are supported.

---

### Essential experience and Premium support

Daily reading, bookshelf, the **main-area homepage (Shelf / Notes)**, excerpts, **book data page templates**, callout-block in-body echo, and **two-way tracing** are **free**. Premium unlocks playlists, banner / covers-only views, homepage Stats, excerpt timelines, activity heatmap, focus timer, paragraph reading, and other advanced tools. The **current-book excerpt timeline** and **activity heatmap** include a **7-day trial** from first use. **Homepage Stats** and the **reading progress scale** are Premium features currently in a **limited-time open** promo (usable without activation until the promo ends).

| Category | Capability | Essential | Premium |
| --- | --- | :---: | :---: |
| **Platform** | All platforms (desktop / mobile) | ✅ | ✅ |
| | Multilingual UI (Simplified Chinese, Traditional Chinese, English, Japanese, Korean, Russian, German, Spanish, Arabic; more languages planned) and in-app tutorial | ✅ | ✅ |
| **Formats & reading** | Read **EPUB / TXT / FB2 / FBZ / MOBI / AZW3 / CBZ / PDF** | ✅ | ✅ |
| | TOC jump, dual-page reading, single-page continuous scroll, and other modes | ✅ | ✅ |
| | Reading typography: follow Obsidian, custom body font and size, publisher styles | ✅ | ✅ |
| | Reading progress persistence, bookshelf progress | ✅ | ✅ |
| **Bookshelf** | My bookshelf: import, covers, progress, search/filter, reading status | ✅ | ✅ |
| | Main-area bookshelf homepage (Shelf / Notes) | ✅ | ✅ |
| | Homepage Stats tab (favorite book, profile, finished timeline, reading footprint; **limited-time open**) | 🔒 | ✅ |
| | Bookshelf multiple views (follow location / reading calendar / card grid), excerpt stats | ✅ | ✅ |
| | Bookshelf playlists (including set as home) | 🔒 | ✅ |
| | Banner-card view (horizontal covers with status and progress) | 🔒 | ✅ |
| | Covers-only view (cover wall) | 🔒 | ✅ |
| | Bookshelf activity heatmap (year calendar: reading / excerpts / focus tomatoes; **7-day trial**) | 🔒 | ✅ |
| **Annotations & excerpts** | Five highlight colors, thoughts (`---div---`), excerpts, and callout-block in-body echo | ✅ | ✅ |
| | Underline / strikethrough / wavy underline styling | ✅ | ✅ |
| | Illustration marker stroke (watercolor fill + intensity; classic rectangles stay free) | 🔒 | ✅ |
| | Auto excerpt (insert into notes / copy to clipboard) | ✅ | ✅ |
| | Screenshot excerpts (can continue across pages) | ✅ | ✅ |
| | Excerpt card list (filter, sort, jump to source) | ✅ | ✅ |
| | Excerpt timeline (**current book**, browse by day; **7-day trial** from first use) | 🔒 | ✅ |
| | Excerpt batch select, export, delete | ✅ | ✅ |
| | Two-way tracing (anchor jumps, notes ↔ book location display) | ✅ | ✅ |
| | Footnote hover preview | ✅ | ✅ |
| | Inline excerpt echo (color emoji + source link paints highlights in the body) | 🔒 | ✅ |
| | Library-wide excerpt timeline (cross-book daily review, jump to source) | 🔒 | ✅ |
| **Navigation** | Current-page bookmarks, bookmark folder, and bookmark list navigation | ✅ | ✅ |
| | Reading reference points (record / update / jump) | ✅ | ✅ |
| | Reading progress scale (dock / hairline, chapter nodes, resume pin; **limited-time open**) | 🔒 | ✅ |
| | TOC sidebar book map density bar | 🔒 | ✅ |
| | TOC chapter marks (important / question / mastered, etc.) | 🔒 | ✅ |
| | Reading plan (dated tasks for Weave Important Schedule) | 🔒 | ✅ |
| **Advanced reading** | Reading background glow | 🔒 | ✅ |
| | Paragraph reading mode, immersive fullscreen | 🔒 | ✅ |
| | Remaining reading time estimate (chapter / book) | 🔒 | ✅ |
| | Vocabulary marking (in-text marks, double-click lookup, add to Weave vocabulary) | 🔒 | ✅ |
| | Pomodoro focus timer (accumulate real reading time; tomato stats in the reader) | 🔒 | ✅ |
| **Export & API** | Book data page templates (customize each book’s `data_*.md` layout) | ✅ | ✅ |
| | Excerpt export templates and built-in presets | ✅ | ✅ |
| | Export current chapter body to Markdown | ✅ | ✅ |
| | Canvas binding and automatic node creation | ✅ | ✅ |
| | Public API (current chapter / TOC section body, chapter or whole-book excerpt notes, etc.) | ✅ | ✅ |
| | Advanced Markdown export (whole-book / chapter excerpt notes, chapters with excerpt marks) | 🔒 | ✅ |
| **Not planned** (optimal trade-off of product philosophy, practical value, and collaborative design) | Built-in AI in the plugin | Note: the public API lets other AI plugins fetch the current chapter, excerpt notes, and more | ❌ |
| | Listen / read aloud | Note: conflicts with the read → excerpt → note philosophy; use system selection TTS (e.g. Doubao), export the chapter as Markdown, or have another plugin read via the public API | ❌ |
| | Auto-save reading progress | Note: jumping via source links often mis-updates progress; prefer manual bookmark-style progress | ❌ |
| | Heavier analytics dashboards | Note: Premium homepage Stats already cover common reviews; no dashboard pile-on—build richer metrics with Dataview when needed | ❌ |
| | PDF reading & excerpting | Note: the bookshelf can import PDFs; leave reading/excerpting to Obsidian or a dedicated plugin such as [Pdf++](https://github.com/RyotaUshio/obsidian-pdf-plus) | ❌ |

> Legend: ✅ included · 🔒 requires Premium support · ❌ not planned

- **Enable Premium support**: EPUB-only activation code in reader settings; if an activated **Weave Review** is installed, authorization can be inherited. Reader Premium is also included in the [Weave series activation code](https://obsidian-weave.xyz/#pricing). Terms: [PREMIUM_TERMS.md](./PREMIUM_TERMS.md).
- **Card making / incremental reading / AI**: do not consume a separate reader Premium license, but require Weave Review where applicable; AI needs your own API key.

### Weave family

Exactly three Weave plugins, composing **read → capture → schedule → review**:

| Plugin | Responsibility |
|--------|----------------|
| **Weave Reader** (this plugin) | In-vault multi-format reading, excerpts, book anchors |
| **Weave Review** | Memory decks, card-making, FSRS review, exams |
| **Weave Incremental Reading** | Reading points, topics, calendar scheduling, resume |

| Need… | Install |
|-------|---------|
| Library reading & excerpts only | This plugin |
| Cards and spaced review | This plugin + Weave Review |
| Reading queue / calendar | Weave Incremental Reading (+ this plugin for EPUB chapter resume) |
| Full loop | All three |

See: [Weave integration](https://obsidian-weave.xyz/tutorials.html#reader-weave-integration).

---

### Installation

#### Option 1: Community plugins (recommended)

1. Open **Settings → Community plugins → Browse**
2. Search for **Weave Reader**, install, and enable

#### Option 2: Manual installation

1. Download a [GitHub release](https://github.com/zhuzhige123/obsidian-weave-reader/releases) matching `manifest.json`:
   - `main.js`
   - `manifest.json`
   - `styles.css`
2. Copy into `.obsidian/plugins/weave-epub-reader/`
3. Restart Obsidian and enable **Weave Reader**

| Item | Requirement |
|------|-------------|
| Obsidian | **≥ 1.8.7** |
| Platforms | Desktop and mobile |

---

### Quick start

1. Enable the plugin, open the **bookshelf**, then import or open a book from your vault.
2. Create or open a Markdown file and place the cursor where excerpts should go; turn on **Auto excerpt**. Select text to create highlights, excerpts, or bookmarks.
3. Click a highlight in the book to jump to its source note; in the Markdown / Canvas that holds the excerpt, click the book icon to return to the passage.
4. Reader menu → **Help** → **Tutorial** for the in-app guide.

More detail: [Intro tutorials](https://obsidian-weave.xyz/tutorials.html#reader-welcome).

---

### Data and privacy

**Good to sync (in the vault)**: book files, Markdown excerpts, Canvas, Weave deck data, and per-book progress/bookmark notes (default `Weave EPUB Reader/data_*.md`).

**Usually local (plugin folder)**: reader cache, indexes, Canvas bindings, reference reading points. Prefer syncing vault content across devices.

- Reading, rendering, excerpting, and backlinks are **local by default**; vault content is not uploaded proactively.
- **Premium activation** may contact the license service. See [PRIVACY.md](./PRIVACY.md).
- AI via **Weave Review** uses third-party services you configure; **the reader itself does not provide AI**.

See: [Settings & sync](https://obsidian-weave.xyz/tutorials.html#reader-settings-sync).

---

### FAQ

#### 1. How do I capture reading excerpts correctly?

Excerpts must be stored in Markdown, Canvas, or Weave deck files you choose. The reader aggregates those source links and renders highlights in the book. Selections that are not saved this way only flash briefly.

#### 2. Do I need Weave Review?

**No.** You can read, manage the bookshelf, and capture excerpts with in-body rendering alone. Deck adds spaced-repetition cards, incremental-reading calendar hooks, AI actions, and license inheritance.

#### 3. Does the reader integrate AI?

No built-in AI. See the feature table “Not planned”; copy/export chapters or use the public API with other AI plugins.

#### 4. Can excerpts sync across platforms?

**Yes**—they live in vault files and follow Obsidian Sync / iCloud / cloud-synced vaults. Prefer syncing vault content, not plugin-folder cache.

#### 5. Can I export my notes?

**Yes.** Data stays in your vault; chapter export and related tools are available.

#### 6. Why is Premium paid? Subscription or buy-once?

Premium **funds ongoing development**. Essential reading/excerpt flow is free. Premium is **buy-once** (see [PREMIUM_TERMS.md](./PREMIUM_TERMS.md)), also available via the [series code](https://obsidian-weave.xyz/#pricing).

#### 7. How do I change font, size, or background?

Typography defaults to Obsidian; enable custom body font/size in the reader menu. Background follows the active Obsidian theme.

More: [FAQ](https://obsidian-weave.xyz/tutorials.html#reader-faq). Email: tutaoyuan8@outlook.com.

---

### License and author

Source code is released under [GPL-3.0-or-later](LICENSE).

- Author: **Rabbit (zhuzhige)**
- GitHub: https://github.com/zhuzhige123
- Email: tutaoyuan8@outlook.com

---

## 中文文档

> **核心阅读与摘录免费可用。少数进阶能力需付费解锁以支持持续开发；插件已迭代百余版，可放心长期使用！谢谢支持！**

**Weave Reader** 把阅读嵌进 Obsidian 的知识工作流：在库内沉浸阅读多格式电子书，摘录与想法可写入 Markdown、Canvas 或 Weave 记忆体系，并保留书籍锚点以便笔记与原文互相跳转。排版可跟随 Obsidian；摘录与书目数据落在库文件中，而不是锁进封闭阅读 App。

### 插件概述

| 概念 | 说明 |
|------|------|
| **书架** | 导入、封面、进度、搜索筛选、阅读状态；内容区主页 |
| **摘录** | 高亮、想法与笔记写入 Markdown / Canvas / 牌组，并带书籍锚点 |
| **溯源** | 在书中段落与摘录笔记之间互相跳转 |

它是 **Obsidian Weave 插件系列**中的阅读器（系列有且仅有三款：Weave Review、Weave Reader、Weave Incremental Reading），**可独立使用**，不强制安装 Weave Review。

最低 Obsidian 版本：**1.8.7**。桌面端与移动端均可用。

---

### 基础体验与高级支持

日常阅读、书架、**内容区主页（书架 / 笔记）**、摘录、**书籍数据页模板**、标注块正文回显与**双向溯源**均**免费可用**。高级支持解锁书架书单、横幅卡片 / 仅看封面、主页统计、摘录时间线、活动热力、番茄计时、段落阅读等进阶能力。其中**当前书摘录时间线**与**书架活动热力**自首次使用起有 **7 天限时试用**，到期后需解锁；**主页「统计」**与**阅读进度刻度条**虽属高级能力，当前为**限时开放**（促销结束前可不激活使用）。

| 类别 | 能力 | 基础体验 | 高级支持 |
| --- | --- | :---: | :---: |
| **平台** | 全平台（桌面 / 移动端） | ✅ | ✅ |
| | 多语言界面（简中、繁中、English、日本語、한국어、Русский、Deutsch、Español、العربية；其它语言后续支持）与应用内使用教程 | ✅ | ✅ |
| **格式与阅读** | **EPUB / TXT / FB2 / FBZ / MOBI / AZW3 / CBZ / PDF** 阅读 | ✅ | ✅ |
| | 目录跳转、双页阅读、单页连续滚动等多种模式 | ✅ | ✅ |
| | 阅读排版：跟随 Obsidian、自定义正文字体与字号、出版商样式 | ✅ | ✅ |
| | 阅读进度持久化、书架进度 | ✅ | ✅ |
| **书架** | 我的书架：导入、封面、进度、搜索筛选、阅读状态 | ✅ | ✅ |
| | 内容区书架主页（书架 / 笔记） | ✅ | ✅ |
| | 主页「统计」页（最爱书、画像、完成足迹与阅读足迹等；**当前限时开放**） | 🔒 | ✅ |
| | 书架多视图（跟随位置 / 阅读月历 / 卡片网格）、摘录统计 | ✅ | ✅ |
| | 书架书单（含设为主页） | 🔒 | ✅ |
| | 横幅卡片视图（横向封面、阅读状态与进度） | 🔒 | ✅ |
| | 仅看封面视图（纯封面书墙） | 🔒 | ✅ |
| | 书架活动热力（近一年贡献日历：阅读 / 摘录 / 番茄；**限时 7 天试用**） | 🔒 | ✅ |
| **标注与摘录** | 五种高亮色、想法（`---div---`）、摘录与标注块正文回显 | ✅ | ✅ |
| | 下划线 / 删除线 / 波浪线等样式标注 | ✅ | ✅ |
| | 插画级荧光笔笔触（水彩填色与浓淡；经典矩形始终免费） | 🔒 | ✅ |
| | 自动摘录（插入笔记 / 复制剪贴板） | ✅ | ✅ |
| | 截图摘录（可翻页续截） | ✅ | ✅ |
| | 摘录笔记汇总卡片列表（筛选、排序、定位原文） | ✅ | ✅ |
| | 摘录笔记时间线（**当前书**，按日浏览；**首次使用起限时 7 天试用**） | 🔒 | ✅ |
| | 摘录批量选择、导出、删除 | ✅ | ✅ |
| | 双向溯源（锚点跳转、笔记 ↔ 原书定位显示） | ✅ | ✅ |
| | 脚注浮窗预览 | ✅ | ✅ |
| | 行内摘录回显（颜色 emoji + 溯源链接在正文回显高亮） | 🔒 | ✅ |
| | 全书架摘录时间线（跨书按日回顾、跳转原文） | 🔒 | ✅ |
| **导航** | 当前页书签、书签目录与书签列表跳转 | ✅ | ✅ |
| | 参考阅读点（手动记录 / 更新 / 跳转） | ✅ | ✅ |
| | 阅读进度刻度条（刻度条 / 隐式线、章节节点、接着读标记；**当前限时开放**） | 🔒 | ✅ |
| | 目录侧栏全书地图密度条 | 🔒 | ✅ |
| | 目录章节标记（重要 / 疑问 / 已掌握等） | 🔒 | ✅ |
| | 阅读计划（生成 Weave 重要日程任务） | 🔒 | ✅ |
| **进阶阅读** | 常规阅读透光渐变 | 🔒 | ✅ |
| | 段落阅读模式、沉浸式全屏 | 🔒 | ✅ |
| | 剩余阅读时长估算（本章 / 全书） | 🔒 | ✅ |
| | 生词标注（正文标注、双击查词、加入 Weave 生词本） | 🔒 | ✅ |
| | 番茄专注计时（按真实阅读时长累计，阅读器内显示番茄统计） | 🔒 | ✅ |
| **导出与 API** | 书籍数据页模板（自定义每本书 `data_*.md` 布局） | ✅ | ✅ |
| | 导出笔记模板与内置预设 | ✅ | ✅ |
| | 导出当前章正文为 Markdown | ✅ | ✅ |
| | Canvas 绑定与自动写入节点 | ✅ | ✅ |
| | 公开 API（当前章 / 指定 TOC 小节正文、本章或全书摘录笔记等） | ✅ | ✅ |
| | 高级 Markdown 导出（全书 / 本章摘录笔记、带摘录标记章节） | 🔒 | ✅ |
| **暂不考虑**（基于产品哲学，实用价值与协作思维的最优解） | 插件内置 AI | 解释：公开 API 可供其它 AI 插件获取当前章节、摘录笔记等 | ❌ |
| | 听书 / 朗读 | 解释：与「阅读—摘录—笔记」理念冲突；可用系统选区朗读如豆包、导出当前章 MD，或其它插件经公开 API 朗读 | ❌ |
| | 自动记录阅读进度 | 解释：溯源翻页易误更新；请用手动书签式记录进度 | ❌ |
| | 更重的分析仪表盘 | 解释：高级支持下的主页统计已覆盖常用回顾；不做仪表盘式堆砌，复杂指标可用 Dataview 等自建 | ❌ |
| | PDF 阅读与摘录 | 解释：书架可导入 PDF；阅读摘录交给 Obsidian 自带或更专业插件，推荐 [Pdf++](https://github.com/RyotaUshio/obsidian-pdf-plus) | ❌ |

> 图例：✅ 已包含 · 🔒 需启用高级支持 · ❌ 暂不考虑

- **启用高级支持**：在阅读器设置中使用 EPUB 独立激活码；若已安装并激活 **Weave Review**，可继承授权。亦可使用 [Weave 系列激活码](https://obsidian-weave.xyz/#pricing)。条款见 [PREMIUM_TERMS.md](./PREMIUM_TERMS.md)。
- **制卡 / 增量阅读 / AI**：不单独占用阅读器高级支持许可，但需安装 Weave Review（如适用）；AI 另需自行配置 API Key。

### 与 Weave 系列

系列共三款插件，围绕 **读 → 记 → 排 → 复习**：

| 插件 | 职责 |
|------|------|
| **Weave Reader**（本插件） | 库内多格式阅读、摘录、书籍锚点 |
| **Weave Review** | 记忆牌组、制卡、FSRS 复习、考试 |
| **Weave Incremental Reading** | 阅读点、专题、日历调度、续读 |

| 需要… | 安装 |
|-------|------|
| 仅库内阅读与摘录 | 本插件 |
| 制卡与间隔复习 | 本插件 + Weave Review |
| 阅读队列 / 日历 | Weave Incremental Reading（EPUB 章节续读再加本插件） |
| 完整闭环 | 三款都装 |

详见：[与 Weave 协同](https://obsidian-weave.xyz/tutorials.html#reader-weave-integration)。

---

### 安装指南

#### 方式一：社区插件（推荐）

1. 打开 **设置 → 社区插件 → 浏览**
2. 搜索 **Weave Reader**，安装并启用

#### 方式二：手动安装

1. 从 [GitHub Releases](https://github.com/zhuzhige123/obsidian-weave-reader/releases) 下载与 `manifest.json` 版本一致的：
   - `main.js`
   - `manifest.json`
   - `styles.css`
2. 复制到 `.obsidian/plugins/weave-epub-reader/`
3. 重启 Obsidian 并启用 **Weave Reader**

| 项目 | 要求 |
|------|------|
| Obsidian | **≥ 1.8.7** |
| 平台 | 桌面端与移动端 |

---

### 快速上手

1. 启用插件后打开**书架**，从 Vault 导入或打开图书。
2. 新建或打开 Markdown，把光标放在插入位置；启用**自动摘录**，选中文本创建高亮 / 摘录 / 书签。
3. 点击正文高亮跳转到来源笔记；在摘录旁点书籍图标回到书中对应位置。
4. 阅读器菜单 → **帮助** → **使用教程** 查看插件内精简教程。

更细步骤：[教程入口](https://obsidian-weave.xyz/tutorials.html#reader-welcome)。

---

### 数据与隐私

**建议同步（Vault）**：图书、Markdown 摘录、Canvas、Weave 牌组数据，以及每本书的进度 / 书签笔记（默认 `Weave EPUB Reader/data_*.md`）。

**通常本地（插件目录）**：阅读缓存、索引、Canvas 绑定、参考阅读点等。多端优先同步 Vault。

- 阅读、渲染、摘录与回链**默认本地**，不主动上传 Vault 内容。
- **高级支持激活**可能访问许可证服务，见 [PRIVACY.md](./PRIVACY.md)。
- 经 **Weave Review** 使用 AI 时调用你配置的第三方服务；**阅读器本身不提供 AI**。

详见：[设置与同步](https://obsidian-weave.xyz/tutorials.html#reader-settings-sync)。

---

### 常见问题

#### 1. 如何正确做阅读摘录？

摘录须保存在你选择的 Markdown、Canvas 或牌组文件中；阅读器据此回显正文高亮。未按此保存的选区只会短暂闪一下。

#### 2. 必须安装 Weave Review 吗？

**不必。** 单独即可阅读、管理书架并完成摘录与正文回显。Deck 用于制卡复习、增量阅读衔接、AI 菜单与授权继承。

#### 3. 是否集成 AI？

暂不内置 AI。详见功能对照表「暂不考虑」；可复制 / 导出章节，或用公开 API 配合其它 AI 插件。

#### 4. 摘录能否全平台同步？

**支持。** 数据在 Vault 内，随 Obsidian Sync / iCloud / 网盘库同步。优先同步 Vault，而非插件缓存。

#### 5. 是否支持导出笔记？

**支持。** 数据在库内可直接编辑；阅读器亦提供章节导出等能力。

#### 6. 为何付费？订阅还是买断？

高级支持用于**持续开发**；基础阅读与摘录免费。采用**买断制**（见 [PREMIUM_TERMS.md](./PREMIUM_TERMS.md)），亦可购买 [系列激活码](https://obsidian-weave.xyz/#pricing)。

#### 7. 如何改字体、字号或背景？

默认跟随 Obsidian；可在排版设置中自定义正文字体与字号。背景随当前主题变化。

更多见官网：[常见问题](https://obsidian-weave.xyz/tutorials.html#reader-faq)。邮箱：tutaoyuan8@outlook.com。

---

### 许可证与作者

源码基于 [GPL-3.0-or-later](LICENSE) 发布。

- 作者：**Rabbit (zhuzhige)**
- GitHub：https://github.com/zhuzhige123
- 邮箱：tutaoyuan8@outlook.com
