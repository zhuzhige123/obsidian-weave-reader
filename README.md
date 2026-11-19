# Weave Reader

<p>
<a href="https://github.com/zhuzhige123/obsidian-weave-reader/releases"><img alt="downloads" src="https://img.shields.io/github/downloads/zhuzhige123/obsidian-weave-reader/total"></a>
<a href="https://github.com/zhuzhige123/obsidian-weave-reader/releases"><img alt="release" src="https://img.shields.io/github/v/release/zhuzhige123/obsidian-weave-reader?display_name=tag&label=release"></a>
<a href="./LICENSE"><img alt="license" src="https://img.shields.io/github/license/zhuzhige123/obsidian-weave-reader"></a>
<a href="https://obsidian.md/plugins?search=weave%20reader"><img alt="Obsidian Plugin" src="https://img.shields.io/badge/Obsidian-Plugin-blue?logo=obsidian&logoColor=white"></a>
<a href="https://github.com/zhuzhige123/obsidian-weave-reader/stargazers"><img alt="stars" src="https://img.shields.io/github/stars/zhuzhige123/obsidian-weave-reader"></a>
</p>

**Weave Reader** 把阅读嵌进 Obsidian 的知识工作流：在库内沉浸阅读多格式电子书，摘录与想法可写入 Markdown、Canvas 或 Weave 记忆体系，并保留书籍锚点以便笔记与原文互相跳转。排版可跟随 Obsidian；摘录与书目数据落在库文件中，而不是锁进封闭阅读 App。

**文档语言：** [简体中文](#中文文档) · [English](#english-documentation) · [繁體中文](./README.zh-TW.md) · [Español](./README.es.md) · [Français](./README.fr.md) · [日本語](./README.ja.md) · [한국어](./README.ko.md) · [Русский](./README.ru.md) · [العربية](./README.ar.md)

| 渠道 | 链接 |
|------|------|
| QQ 公开群 | [点击链接加入群聊【Obsidan-Weave系列 反馈群】](https://qm.qq.com/q/TNnSmywgeW) |
| Discord | [Obsidian-Weave 反馈频道](https://discord.com/channels/1553861810665554023/1553867320311677039) |
| 官方正式教程视频 | [Bilibili · Weave Reader 教程](https://www.bilibili.com/video/BV1Zcs56NE9C/) |
| 官网与图文教程 | [官网 · 价格](https://obsidian-weave.xyz/#pricing) · [使用教程](https://obsidian-weave.xyz/tutorials.html#reader-welcome) |

> **核心阅读与摘录免费可用。少数进阶能力需付费解锁以支持持续开发；插件已迭代百余版，可放心长期使用！谢谢支持！**

![weave-series-banner-trinity](https://github.com/user-attachments/assets/d3bb327f-83f4-4b1d-878b-0c63c7631648)

![weave-series-banner-trinity](https://github.com/user-attachments/assets/8f748341-bb83-4cf9-b020-d8cd18a2aa92)

![QQ_1784327250240](https://github.com/user-attachments/assets/dc88b393-76ec-413c-b226-31ab01a7e82a)

![QQ20260718-070731-HD](https://github.com/user-attachments/assets/c1850008-aa57-48e1-b63f-d34a01326a53)

![QQ20260718-064929-HD](https://github.com/user-attachments/assets/5fc7ff83-b8e3-498f-8233-90fbcc94198b)

![QQ_1784328028569](https://github.com/user-attachments/assets/1185b662-3f91-4dee-b552-e53e3ebcb25d)

![QQ_1785812351950](https://github.com/user-attachments/assets/5c33039e-7ca4-461b-b258-972561f9789d)

---

## 中文文档

### 插件概述

| 概念 | 说明 |
|------|------|
| **书架** | 导入、封面、进度、搜索筛选与阅读状态 |
| **摘录** | 高亮、想法与笔记写入 Markdown / Canvas / 牌组，并带书籍锚点 |
| **溯源** | 在书中段落与摘录笔记之间互相跳转 |

它是 **Obsidian Weave 插件系列**中的阅读器（系列有且仅有三款：Weave Deck、Weave Reader、Weave Incremental Reading），**可独立使用**，不强制安装 Weave Deck。

最低 Obsidian 版本：**1.8.7**。桌面端与移动端均可用。

社区、官方视频与官网图文教程见文首渠道表。

---

### 基础体验与高级支持

日常阅读、书架、摘录、**书籍数据页模板**、标注块正文回显与**双向溯源**均**免费可用**。高级支持解锁活动热力、番茄计时、跨书时间线、段落阅读等进阶能力。

| 类别 | 能力 | 基础体验 | 高级支持 |
| --- | --- | :---: | :---: |
| **平台** | 全平台（桌面 / 移动端） | ✅ | ✅ |
| | 多语言界面（简中、繁中、English、日本語、한국어、Русский、Deutsch、Español、العربية；其它语言后续支持）与应用内使用教程 | ✅ | ✅ |
| **格式与阅读** | **EPUB / TXT / FB2 / FBZ / MOBI / AZW3 / CBZ / PDF** 阅读 | ✅ | ✅ |
| | 目录跳转、双页阅读、单页连续滚动等多种模式 | ✅ | ✅ |
| | 阅读排版：跟随 Obsidian、自定义正文字体与字号、出版商样式 | ✅ | ✅ |
| | 阅读进度持久化、书架进度 | ✅ | ✅ |
| **书架** | 我的书架：导入、封面、进度、搜索筛选、阅读状态 | ✅ | ✅ |
| | 书架多视图、摘录统计（摘录 / 想法 / 制卡数量） | ✅ | ✅ |
| | 书架书单（含设为主页） | 🔒 | ✅ |
| | 书架活动热力（近一年贡献日历：阅读 / 摘录 / 番茄） | 🔒 | ✅ |
| **标注与摘录** | 五种高亮色、想法（`---div---`）、摘录与标注块正文回显 | ✅ | ✅ |
| | 下划线 / 删除线 / 波浪线等样式标注 | ✅ | ✅ |
| | 自动摘录（插入笔记 / 复制剪贴板） | ✅ | ✅ |
| | 截图摘录（可翻页续截） | ✅ | ✅ |
| | 摘录笔记汇总卡片列表（筛选、排序、定位原文） | ✅ | ✅ |
| | 摘录笔记时间线（**当前书**，按日浏览） | ✅ | ✅ |
| | 摘录批量选择、导出、删除 | ✅ | ✅ |
| | 双向溯源（锚点跳转、笔记 ↔ 原书定位显示） | ✅ | ✅ |
| | 脚注浮窗预览 | ✅ | ✅ |
| | 行内摘录回显（颜色 emoji + 溯源链接在正文回显高亮） | 🔒 | ✅ |
| | 全书架摘录时间线（跨书按日回顾、跳转原文） | 🔒 | ✅ |
| **导航** | 当前页书签、书签目录与书签列表跳转 | ✅ | ✅ |
| | 参考阅读点（手动记录 / 更新 / 跳转） | ✅ | ✅ |
| | 目录侧栏全书地图密度条 | 🔒 | ✅ |
| | 目录章节标记（重要 / 疑问 / 已掌握等） | 🔒 | ✅ |
| **进阶阅读** | 常规阅读透光渐变 | 🔒 | ✅ |
| | 段落阅读模式、沉浸式全屏 | 🔒 | ✅ |
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
| | 更多统计图表 | 解释：对本插件「专注阅读摘录」定位意义有限 | ❌ |
| | PDF 阅读与摘录 | 解释：书架可导入 PDF；阅读摘录交给 Obsidian 自带或更专业插件，推荐 [Pdf++](https://github.com/RyotaUshio/obsidian-pdf-plus) | ❌ |

> 图例：✅ 已包含 · 🔒 需启用高级支持 · ❌ 暂不考虑

- **启用高级支持**：在阅读器设置中使用 EPUB 独立激活码；若已安装并激活 **Weave Deck**，可继承授权。亦可使用 [Weave 系列激活码](https://obsidian-weave.xyz/#pricing)。条款见 [PREMIUM_TERMS.md](./PREMIUM_TERMS.md)。
- **制卡 / 增量阅读 / AI**：不单独占用阅读器高级支持许可，但需安装 Weave Deck（如适用）；AI 另需自行配置 API Key。

### 与 Weave 系列

系列共三款插件，围绕 **读 → 记 → 排 → 复习**：

| 插件 | 职责 |
|------|------|
| **Weave Reader**（本插件） | 库内多格式阅读、摘录、书籍锚点 |
| **Weave Deck** | 记忆牌组、制卡、FSRS 复习、考试 |
| **Weave Incremental Reading** | 阅读点、专题、日历调度、续读 |

| 需要… | 安装 |
|-------|------|
| 仅库内阅读与摘录 | 本插件 |
| 制卡与间隔复习 | 本插件 + Weave Deck |
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
- 经 **Weave Deck** 使用 AI 时调用你配置的第三方服务；**阅读器本身不提供 AI**。

详见：[设置与同步](https://obsidian-weave.xyz/tutorials.html#reader-settings-sync)。

---

### 常见问题

#### 1. 如何正确做阅读摘录？

摘录须保存在你选择的 Markdown、Canvas 或牌组文件中；阅读器据此回显正文高亮。未按此保存的选区只会短暂闪一下。

#### 2. 必须安装 Weave Deck 吗？

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

---

## English Documentation

> **Core reading and excerpting are free. A few advanced features require Premium to support ongoing development; the plugin has gone through 100+ releases and is ready for long-term use. Thanks for your support!**

### Overview

**Weave Reader** embeds reading into Obsidian’s knowledge workflow: immerse yourself in multi-format ebooks inside your vault; excerpts and thoughts can go into Markdown, Canvas, or the Weave memory system, with book anchors so notes and source text jump to each other. Typography can follow Obsidian; excerpt and bookshelf data live in your vault files—not locked inside a closed reading app.

| Concept | Meaning |
|---------|---------|
| **Bookshelf** | Import, covers, progress, search/filter, and reading status for vault books |
| **Excerpt** | Highlights, thoughts, and notes saved into Markdown / Canvas / decks with book anchors |
| **Trace** | Jump between the book passage and the note that holds the excerpt |

It is a reader in the **Obsidian Weave plugin series** (exactly three plugins: Weave Deck, Weave Reader, and Weave Incremental Reading). It works **standalone**—Weave Deck is optional.

Minimum Obsidian version: **1.8.7**. Desktop and mobile are supported.

See the channel table and website links at the top of this README for tutorials, pricing, QQ, Discord, and the official video.

---

### Essential experience and Premium support

Daily reading, bookshelf, excerpts, **book data page templates**, callout-block in-body echo, and **two-way tracing** are **free**. Premium unlocks the activity heatmap, focus timer, library timeline, paragraph reading, and other advanced tools.

| Category | Capability | Essential | Premium |
| --- | --- | :---: | :---: |
| **Platform** | All platforms (desktop / mobile) | ✅ | ✅ |
| | Multilingual UI (Simplified Chinese, Traditional Chinese, English, Japanese, Korean, Russian, German, Spanish, Arabic; more languages planned) and in-app tutorial | ✅ | ✅ |
| **Formats & reading** | Read **EPUB / TXT / FB2 / FBZ / MOBI / AZW3 / CBZ / PDF** | ✅ | ✅ |
| | TOC jump, dual-page reading, single-page continuous scroll, and other modes | ✅ | ✅ |
| | Reading typography: follow Obsidian, custom body font and size, publisher styles | ✅ | ✅ |
| | Reading progress persistence, bookshelf progress | ✅ | ✅ |
| **Bookshelf** | My bookshelf: import, covers, progress, search/filter, reading status | ✅ | ✅ |
| | Bookshelf multiple views, excerpt stats (excerpts / thoughts / cards) | ✅ | ✅ |
| | Bookshelf playlists (including set as home) | 🔒 | ✅ |
| | Bookshelf activity heatmap (year calendar: reading / excerpts / focus tomatoes) | 🔒 | ✅ |
| **Annotations & excerpts** | Five highlight colors, thoughts (`---div---`), excerpts, and callout-block in-body echo | ✅ | ✅ |
| | Underline / strikethrough / wavy underline styling | ✅ | ✅ |
| | Auto excerpt (insert into notes / copy to clipboard) | ✅ | ✅ |
| | Screenshot excerpts (can continue across pages) | ✅ | ✅ |
| | Excerpt card list (filter, sort, jump to source) | ✅ | ✅ |
| | Excerpt timeline (**current book**, browse by day) | ✅ | ✅ |
| | Excerpt batch select, export, delete | ✅ | ✅ |
| | Two-way tracing (anchor jumps, notes ↔ book location display) | ✅ | ✅ |
| | Footnote hover preview | ✅ | ✅ |
| | Inline excerpt echo (color emoji + source link paints highlights in the body) | 🔒 | ✅ |
| | Library-wide excerpt timeline (cross-book daily review, jump to source) | 🔒 | ✅ |
| **Navigation** | Current-page bookmarks, bookmark folder, and bookmark list navigation | ✅ | ✅ |
| | Reading reference points (record / update / jump) | ✅ | ✅ |
| | TOC sidebar book map density bar | 🔒 | ✅ |
| | TOC chapter marks (important / question / mastered, etc.) | 🔒 | ✅ |
| **Advanced reading** | Reading background glow | 🔒 | ✅ |
| | Paragraph reading mode, immersive fullscreen | 🔒 | ✅ |
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
| | More analytics charts | Note: limited value for a plugin focused on reading and excerpting | ❌ |
| | PDF reading & excerpting | Note: the bookshelf can import PDFs; leave reading/excerpting to Obsidian or a dedicated plugin such as [Pdf++](https://github.com/RyotaUshio/obsidian-pdf-plus) | ❌ |

> Legend: ✅ included · 🔒 requires Premium support · ❌ not planned

- **Enable Premium support**: EPUB-only activation code in reader settings; if an activated **Weave Deck** is installed, authorization can be inherited. Reader Premium is also included in the [Weave series activation code](https://obsidian-weave.xyz/#pricing). Terms: [PREMIUM_TERMS.md](./PREMIUM_TERMS.md).
- **Card making / incremental reading / AI**: do not consume a separate reader Premium license, but require Weave Deck where applicable; AI needs your own API key.

### Weave family

Exactly three Weave plugins, composing **read → capture → schedule → review**:

| Plugin | Responsibility |
|--------|----------------|
| **Weave Reader** (this plugin) | In-vault multi-format reading, excerpts, book anchors |
| **Weave Deck** | Memory decks, card-making, FSRS review, exams |
| **Weave Incremental Reading** | Reading points, topics, calendar scheduling, resume |

| Need… | Install |
|-------|---------|
| Library reading & excerpts only | This plugin |
| Cards and spaced review | This plugin + Weave Deck |
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
- AI via **Weave Deck** uses third-party services you configure; **the reader itself does not provide AI**.

See: [Settings & sync](https://obsidian-weave.xyz/tutorials.html#reader-settings-sync).

---

### FAQ

#### 1. How do I capture reading excerpts correctly?

Excerpts must be stored in Markdown, Canvas, or Weave deck files you choose. The reader aggregates those source links and renders highlights in the book. Selections that are not saved this way only flash briefly.

#### 2. Do I need Weave Deck?

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
