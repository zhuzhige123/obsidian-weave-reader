import { afterEach, describe, expect, it, vi } from 'vitest';
import { PREMIUM_FEATURES } from '../services/premium/PremiumFeatureGuard';

const { mountSpy, unmountSpy } = vi.hoisted(() => ({
	mountSpy: vi.fn(() => ({})),
	unmountSpy: vi.fn(),
}));

function enhanceDiv<T extends HTMLDivElement>(div: T) {
	const el = div as T & {
		empty: () => void;
		addClass: (...classes: string[]) => void;
		createDiv: (options?: string | { cls?: string | string[]; text?: string | DocumentFragment }) => HTMLDivElement;
	};
	el.empty = () => {
		el.innerHTML = '';
	};
	el.addClass = (...classes: string[]) => {
		el.classList.add(...classes);
	};
	el.createDiv = (options) => {
		const child = enhanceDiv(document.createElement('div'));
		if (typeof options === 'string') {
			child.className = options;
		} else if (options) {
			if (options.cls) {
				child.className = Array.isArray(options.cls) ? options.cls.join(' ') : options.cls;
			}
			if (options.text) {
				if (typeof options.text === 'string') {
					child.textContent = options.text;
				} else {
					child.appendChild(options.text);
				}
			}
		}
		el.appendChild(child);
		return child;
	};
	return el;
}

vi.mock('svelte', () => ({
	mount: mountSpy,
	unmount: unmountSpy,
	untrack: <T>(fn: () => T) => fn(),
}));

vi.mock('../components/epub/EpubReaderApp.svelte', () => ({
	default: {},
}));

vi.mock('../services/epub/epub-error', () => ({
	reportEpubError: () => ({ userMessage: 'EPUB 打开失败' }),
}));

vi.mock('../utils/epub-leaf-utils', () => ({
	resolveRecentEpubPath: vi.fn(),
}));

vi.mock('../utils/i18n', () => ({
	i18n: {
		t: (key: string) => key,
	},
}));

vi.mock('../utils/logger', () => ({
	logger: {
		debug: vi.fn(),
		error: vi.fn(),
		warn: vi.fn(),
	},
}));

vi.mock('./EpubSidebarView', () => ({
	VIEW_TYPE_EPUB_SIDEBAR: 'weave-epub-sidebar',
}));

vi.mock('obsidian', () => {
	class Scope {
		private handlers = new Set<object>();

		register(): object {
			const handler = {};
			this.handlers.add(handler);
			return handler;
		}

		unregister(handler: object): void {
			this.handlers.delete(handler);
		}

		getHandlerCount(): number {
			return this.handlers.size;
		}
	}

	class ItemView {
		public leaf: unknown;
		public contentEl = enhanceDiv(document.createElement('div'));
		public scope: InstanceType<typeof Scope> | null = null;

		constructor(leaf: unknown) {
			this.leaf = leaf;
		}

		addAction(): HTMLButtonElement {
			const button = document.createElement('button');
			(button as HTMLButtonElement & { toggleClass: (name: string, force?: boolean) => void }).toggleClass =
				(name: string, force?: boolean) => {
					button.classList.toggle(name, force);
				};
			return button;
		}

		async setState(): Promise<void> {}

		async onClose(): Promise<void> {}
	}

	return {
		Scope,
		ItemView,
		MarkdownView: class {},
		Menu: class {},
		Notice: class {},
		Platform: { isMobile: true },
		TFile: class {},
		WorkspaceLeaf: class {},
		setIcon: vi.fn(),
	};
});

import { EpubView } from './EpubView';

describe('EpubView', () => {
	afterEach(() => {
		mountSpy.mockClear();
		unmountSpy.mockClear();
	});

	it('passes initial pending CFI to EpubReaderApp props without replaying navigateToCfi in onActionsReady', () => {
		const view = new EpubView({} as any, { app: {} } as any);
		(view as any).isOpen = true;
		(view as any).filePath = 'Books/demo.epub';
		(view as any).pendingCfi = 'epubcfi(/6/2!/4/2,/1:0,/1:9)';
		(view as any).pendingText = 'demo excerpt';

		const pendingNavigation = (view as any).consumePendingNavigation();
		const props = (view as any).buildReaderAppProps(
			pendingNavigation.pendingLocate,
			pendingNavigation.pendingCfi,
			pendingNavigation.pendingText
		) as {
			pendingLocate?: { cfi?: string; text?: string };
			pendingCfi?: string;
			pendingText?: string;
			onActionsReady?: (actions: { navigateToCfi?: (cfi: string, linkTextHint?: string) => void }) => void;
		};

		expect(props.pendingLocate?.cfi).toBe('epubcfi(/6/2!/4/2,/1:0,/1:9)');
		expect(props.pendingCfi).toBe('epubcfi(/6/2!/4/2,/1:0,/1:9)');
		expect(props.pendingText).toBe('demo excerpt');
		expect((view as any).pendingCfi).toBe('');
		expect((view as any).pendingText).toBe('');

		const navigateToCfi = vi.fn();
		props.onActionsReady?.({ navigateToCfi });
		expect(navigateToCfi).not.toHaveBeenCalled();
	});

	it('shows canvas direction button via class toggle instead of inline display:none', () => {
		const view = new EpubView({} as any, { app: {} } as any);
		(view as any).actionHandlers = {
			canUseCanvasExcerpts: () => true,
		};
		(view as any).toolbarHandlersReady = true;
		(view as any).canvasModeActive = true;
		const button = document.createElement('button') as HTMLButtonElement & {
			toggleClass: (name: string, force?: boolean) => void;
		};
		button.toggleClass = (name: string, force?: boolean) => {
			button.classList.toggle(name, force);
		};
		(view as any).canvasDirBtn = button;
		(view as any).updateDirectionBtn();
		expect(button.style.display).toBe('');
		expect(button.classList.contains('epub-view-action-hidden')).toBe(false);
	});

	it('shows canvas actions under the fork policy even when the host reports no license', () => {
		const view = new EpubView({} as any, { app: {} } as any);
		const applyActionButtonState = vi.spyOn(view as any, 'applyActionButtonState');

		(view as any).actionHandlers = {
			canUseCanvasExcerpts: () => false,
		};
		(view as any).canvasModeActive = true;
		(view as any).updateCanvasBtn();

		expect(applyActionButtonState).toHaveBeenCalledWith((view as any).canvasBtn, expect.objectContaining({
			visible: true,
		}));
		expect(applyActionButtonState).toHaveBeenCalledWith((view as any).inlineCanvasBtn, expect.objectContaining({
			visible: true,
		}));
	});

	it('shows paragraph mode as an unlocked action under the fork policy', () => {
		const view = new EpubView({} as any, { app: {} } as any);
		const applyActionButtonState = vi.spyOn(view as any, 'applyActionButtonState');

		(view as any).actionHandlers = {
			canUseParagraphMode: () => false,
			isPremiumFeaturePreviewEnabled: () => true,
		};
		(view as any).paragraphModeEnabled = true;
		(view as any).updateParagraphModeBtn();

		expect(applyActionButtonState).toHaveBeenCalledWith(
			(view as any).paragraphModeBtn,
			expect.objectContaining({
				active: false,
				visible: true,
				label: 'views.epubView.label.paragraphModeOn',
			})
		);
		expect(applyActionButtonState).toHaveBeenCalledWith(
			(view as any).inlineParagraphModeBtn,
			expect.objectContaining({
				active: false,
				visible: true,
				label: 'views.epubView.label.paragraphModeOn',
			})
		);
	});

	it('registers reader page shortcuts on a view scope and unregisters them on dispose', () => {
		const parentScope = {};
		const app = { scope: parentScope };
		const view = new EpubView({ app } as any, { app } as any);
		(view as any).app = app;

		(view as any).registerReaderKeyboardShortcuts();

		expect((view as any).scope).toBeTruthy();
		expect((view as any).readerKeymapHandlers).toHaveLength(2);
		expect((view as any).scope.getHandlerCount()).toBe(2);

		(view as any).disposeReaderKeymapScope();

		expect((view as any).scope).toBeNull();
		expect((view as any).readerKeymapHandlers).toHaveLength(0);
	});

	it('re-registers reader shortcuts without leaking handlers from the previous scope', () => {
		const parentScope = {};
		const app = { scope: parentScope };
		const view = new EpubView({ app } as any, { app } as any);
		(view as any).app = app;

		(view as any).registerReaderKeyboardShortcuts();
		const firstScope = (view as any).scope;

		(view as any).registerReaderKeyboardShortcuts();

		expect(firstScope.getHandlerCount()).toBe(0);
		expect((view as any).readerKeymapHandlers).toHaveLength(2);
		expect((view as any).scope.getHandlerCount()).toBe(2);
	});

	it('opens the paragraph mode premium preview instead of toggling when the capability is unavailable', () => {
		const view = new EpubView({} as any, { app: {} } as any);
		const toggleParagraphMode = vi.fn();
		const showPremiumFeaturePreview = vi.fn();

		(view as any).actionHandlers = {
			canUseParagraphMode: () => false,
			isPremiumFeaturePreviewEnabled: () => true,
			toggleParagraphMode,
			showPremiumFeaturePreview,
		};

		(view as any).toggleParagraphMode();

		expect(showPremiumFeaturePreview).toHaveBeenCalledWith(PREMIUM_FEATURES.EPUB_PARAGRAPH_MODE);
		expect(toggleParagraphMode).not.toHaveBeenCalled();
		expect((view as any).paragraphModeEnabled).toBe(false);
	});
});
