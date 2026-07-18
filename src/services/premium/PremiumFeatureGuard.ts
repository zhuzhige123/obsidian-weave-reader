/**
 * 高级功能守卫服务
 * 单例模式，管理高级功能的访问控制
 */

import { writable, get, type Writable } from "svelte/store";
import {
	EPUB_ALL_LOCAL_FEATURES_ENABLED,
	EPUB_CORE_FEATURE_ID_SET,
	EPUB_PREMIUM_FEATURE_IDS,
} from "../../config/epub-feature-tier";
import { EPUB_RUNTIME } from "../epub/epub-runtime";
import { licenseManager } from "../../utils/licenseManager";
import { i18n } from "../../utils/i18n";
import type { EffectiveLicenseState, LicenseInfo, LicensedProduct } from "../../types/license";
import { LICENSED_PRODUCTS, resolveEffectiveLicenseState } from "../../utils/license-state";

/**
 * 高级功能ID定义
 */
export const PREMIUM_FEATURES = {
	EPUB_NON_EPUB_FORMATS: "epub-non-epub-formats",
	EPUB_READING_REFERENCE: "epub-reading-reference",
	EPUB_PARAGRAPH_MODE: "epub-paragraph-mode",
	EPUB_EXCERPT_NOTES: "epub-excerpt-notes",
	EPUB_STYLED_EXCERPTS: "epub-styled-excerpts",
	EPUB_SOURCE_LOCATION: "epub-source-location",
	EPUB_CANVAS_EXCERPTS: "epub-canvas-excerpts",
	EPUB_FOOTNOTE_PREVIEW: "epub-footnote-preview",
	EPUB_CHAPTER_EXPORT: "epub-chapter-export",
} as const;

/** 未激活时在功能入口标题后追加的锁定标记（语言无关，适用于菜单/工具栏/设置项） */
export const PREMIUM_LOCKED_ENTRY_SUFFIX = " 🔒";

export function appendPremiumLockedEntrySuffix(baseTitle: string): string {
	return `${baseTitle}${PREMIUM_LOCKED_ENTRY_SUFFIX}`;
}

/** Premium feature icons only — labels come from i18n (`epub.premium.premiumFeatures.*`). */
export const FEATURE_METADATA: Record<string, { icon?: string }> = {
	[PREMIUM_FEATURES.EPUB_NON_EPUB_FORMATS]: { icon: "library" },
	[PREMIUM_FEATURES.EPUB_READING_REFERENCE]: { icon: "flag" },
	[PREMIUM_FEATURES.EPUB_PARAGRAPH_MODE]: { icon: "pilcrow" },
	[PREMIUM_FEATURES.EPUB_EXCERPT_NOTES]: { icon: "highlighter" },
	[PREMIUM_FEATURES.EPUB_STYLED_EXCERPTS]: { icon: "underline" },
	[PREMIUM_FEATURES.EPUB_SOURCE_LOCATION]: { icon: "map-pinned" },
	[PREMIUM_FEATURES.EPUB_CANVAS_EXCERPTS]: { icon: "layout-dashboard" },
	[PREMIUM_FEATURES.EPUB_FOOTNOTE_PREVIEW]: { icon: "message-square" },
	[PREMIUM_FEATURES.EPUB_CHAPTER_EXPORT]: { icon: "file-output" },
};

export const PREMIUM_BENEFIT_FEATURE_ORDER = [
	PREMIUM_FEATURES.EPUB_NON_EPUB_FORMATS,
	PREMIUM_FEATURES.EPUB_SOURCE_LOCATION,
	PREMIUM_FEATURES.EPUB_PARAGRAPH_MODE,
] as const;

const FREE_FEATURE_IDS = new Set<string>([
	...EPUB_CORE_FEATURE_ID_SET,
	...(EPUB_ALL_LOCAL_FEATURES_ENABLED ? EPUB_PREMIUM_FEATURE_IDS : []),
]);

/**
 * 高级功能守卫类
 * 单例模式，管理许可证验证和功能访问控制
 */
export class PremiumFeatureGuard {
	private static instance: PremiumFeatureGuard;
	private currentProduct: LicensedProduct = LICENSED_PRODUCTS.WEAVE;
	private localLicenses: LicenseInfo[] = [];
	private inheritedLicenses: LicenseInfo[] = [];
	private effectiveState: EffectiveLicenseState = resolveEffectiveLicenseState({
		product: LICENSED_PRODUCTS.WEAVE,
	});

	/**
	 * 高级版状态 Store
	 * 用于响应式更新UI
	 */
	public isPremiumActive: Writable<boolean>;

	/**
	 * 是否显示高级功能预览入口
	 * 兼容新版 UI 的公开分支降级实现
	 */
	public premiumFeaturesPreviewEnabled: Writable<boolean>;

	/**
	 * 验证缓存
	 * 避免频繁验证许可证
	 */
	private validationCache: {
		isValid: boolean;
		timestamp: number;
	} | null = null;

	/**
	 * 缓存有效期：5分钟
	 */
	private readonly CACHE_DURATION = 5 * 60 * 1000;

	/**
	 * 私有构造函数，确保单例
	 */
	private constructor() {
		this.isPremiumActive = writable(EPUB_ALL_LOCAL_FEATURES_ENABLED);
		this.premiumFeaturesPreviewEnabled = writable(false);
	}

	/**
	 * 获取单例实例
	 */
	static getInstance(): PremiumFeatureGuard {
		if (!PremiumFeatureGuard.instance) {
			PremiumFeatureGuard.instance = new PremiumFeatureGuard();
		}
		return PremiumFeatureGuard.instance;
	}

	/**
	 * 初始化守卫
	 */
	async initializeForProduct(input: {
		product: LicensedProduct;
		localLicenses?: LicenseInfo[];
		inheritedLicenses?: LicenseInfo[];
	}): Promise<void> {
		this.currentProduct = input.product;
		this.localLicenses = input.localLicenses ?? [];
		this.inheritedLicenses = input.inheritedLicenses ?? [];
		const effectiveState = await this.validateLicenseState();
		this.effectiveState = effectiveState;
		this.isPremiumActive.set(
			EPUB_ALL_LOCAL_FEATURES_ENABLED || effectiveState.isPremiumActive
		);
		this.dispatchPremiumUiStateChanged();
	}

	/**
	 * 更新许可证状态
	 */
	async updateLicenseState(input: {
		product?: LicensedProduct;
		localLicenses?: LicenseInfo[];
		inheritedLicenses?: LicenseInfo[];
	}): Promise<void> {
		this.clearCache();
		this.currentProduct = input.product ?? this.currentProduct;
		this.localLicenses = input.localLicenses ?? this.localLicenses;
		this.inheritedLicenses = input.inheritedLicenses ?? this.inheritedLicenses;
		const effectiveState = await this.validateLicenseState();
		this.effectiveState = effectiveState;
		this.isPremiumActive.set(
			EPUB_ALL_LOCAL_FEATURES_ENABLED || effectiveState.isPremiumActive
		);
		this.dispatchPremiumUiStateChanged();
	}

	getEffectiveState(): EffectiveLicenseState {
		return this.effectiveState;
	}

	/**
	 * 设置是否显示高级功能预览入口
	 */
	setPremiumFeaturesPreview(enabled: boolean): void {
		this.premiumFeaturesPreviewEnabled.set(enabled);
		this.dispatchPremiumUiStateChanged();
	}

	private dispatchPremiumUiStateChanged(): void {
		if (typeof window === "undefined") {
			return;
		}
		window.dispatchEvent(
			new CustomEvent(EPUB_RUNTIME.events.premiumUiStateChanged)
		);
	}

	/**
	 * 判断一个功能是否属于高级功能
	 */
	isPremiumFeature(featureId: string): boolean {
		if (FREE_FEATURE_IDS.has(featureId)) {
			return false;
		}

		const premiumFeatureIds = Object.values(PREMIUM_FEATURES) as string[];
		return premiumFeatureIds.includes(featureId);
	}

	/**
	 * 判断当前 UI 是否应该展示某个功能入口
	 * 已激活用户始终展示；未激活用户仅在开启预览时展示高级功能入口。
	 */
	shouldShowFeatureEntry(
		featureId: string,
		options?: {
			isPremium?: boolean;
			showPremiumPreview?: boolean;
		},
		context?: PremiumFeatureAccessContext
	): boolean {
		if (!this.isPremiumFeature(featureId)) {
			return true;
		}

		if (this.isLimitedTimeFeatureOpen(featureId, context)) {
			return true;
		}

		const isPremium = options?.isPremium ?? get(this.isPremiumActive);
		if (isPremium) {
			return true;
		}

		const showPremiumPreview =
			options?.showPremiumPreview ?? get(this.premiumFeaturesPreviewEnabled);
		return showPremiumPreview;
	}

	/**
	 * 检查是否可以使用某个功能
	 * @param featureId 功能ID
	 * @returns true表示可以使用
	 */
	canUseFeature(featureId: string, context?: PremiumFeatureAccessContext): boolean {
		// 使用 get() 同步获取当前高级版状态
		const isPremium = get(this.isPremiumActive);

		// 基础功能完全免费，不受许可证限制
		if (FREE_FEATURE_IDS.has(featureId)) {
			return true;
		}

		if (this.isLimitedTimeFeatureOpen(featureId, context)) {
			return true;
		}

		// 检查是否为高级功能
		if (this.isPremiumFeature(featureId)) {
			return isPremium;
		}

		// 非高级功能，所有人都可以使用
		return true;
	}

	/**
	 * 检查功能是否受限（canUseFeature的反向）
	 * @param featureId 功能ID
	 * @returns true表示功能受限，不可使用
	 */
	isFeatureRestricted(featureId: string, context?: PremiumFeatureAccessContext): boolean {
		return !this.canUseFeature(featureId, context);
	}

	isFeatureLimitedTimeOpen(featureId: string, context?: PremiumFeatureAccessContext): boolean {
		return this.isLimitedTimeFeatureOpen(featureId, context);
	}

	canUseAnyFeature(featureIds: string[], context?: PremiumFeatureAccessContext): boolean {
		return featureIds.some((featureId) => this.canUseFeature(featureId, context));
	}

	shouldShowAnyFeatureEntry(
		featureIds: string[],
		options?: {
			isPremium?: boolean;
			showPremiumPreview?: boolean;
		},
		context?: PremiumFeatureAccessContext
	): boolean {
		return featureIds.some((featureId) => this.shouldShowFeatureEntry(featureId, options, context));
	}

	getAnyFeatureEntryTitle(
		baseTitle: string,
		featureIds: string[],
		context?: PremiumFeatureAccessContext
	): string {
		if (get(this.isPremiumActive)) {
			return baseTitle;
		}

		if (featureIds.some((featureId) => this.isLimitedTimeFeatureOpen(featureId, context))) {
			return `${baseTitle}${i18n.t("epub.premium.limitedTimeOpenSuffix")}`;
		}

		return this.canUseAnyFeature(featureIds, context)
			? baseTitle
			: appendPremiumLockedEntrySuffix(baseTitle);
	}

	getFeatureEntryTitle(
		baseTitle: string,
		featureId: string,
		context?: PremiumFeatureAccessContext
	): string {
		if (get(this.isPremiumActive)) {
			return baseTitle;
		}

		if (this.isLimitedTimeFeatureOpen(featureId, context)) {
			return `${baseTitle}${i18n.t("epub.premium.limitedTimeOpenSuffix")}`;
		}

		return this.canUseFeature(featureId, context)
			? baseTitle
			: appendPremiumLockedEntrySuffix(baseTitle);
	}

	/**
	 * 验证许可证
	 * 使用缓存优化性能
	 */
	private async validateLicenseState(): Promise<EffectiveLicenseState> {
		if (this.validationCache) {
			const now = Date.now();
			if (now - this.validationCache.timestamp < this.CACHE_DURATION) {
				return this.effectiveState;
			}
		}

		const validatedLocalLicenses: LicenseInfo[] = [];
		for (const license of this.localLicenses) {
			const validation = await licenseManager.validateCurrentLicense(license, {
				targetProduct: this.currentProduct,
			});
			if (validation.isValid) {
				validatedLocalLicenses.push(license);
			}
		}

		const validatedInheritedLicenses: LicenseInfo[] = [];
		for (const license of this.inheritedLicenses) {
			const validation = await licenseManager.validateCurrentLicense(license, {
				targetProduct: this.currentProduct,
			});
			if (validation.isValid) {
				validatedInheritedLicenses.push(license);
			}
		}

		const effectiveState = resolveEffectiveLicenseState({
			product: this.currentProduct,
			localLicenses: validatedLocalLicenses,
			inheritedLicenses: validatedInheritedLicenses,
		});

		this.validationCache = {
			isValid: effectiveState.isPremiumActive,
			timestamp: Date.now(),
		};

		return effectiveState;
	}

	/**
	 * 清除验证缓存
	 */
	private clearCache(): void {
		this.validationCache = null;
	}

	private isContextMatched(
		context: PremiumFeatureAccessContext | undefined,
		matcher: PremiumFeatureAccessContext
	): boolean {
		if (!context) {
			return false;
		}

		if (matcher.page && matcher.page !== context.page) {
			return false;
		}

		return true;
	}

	private isLimitedTimeRuleActive(rule: LimitedTimeFeatureRule | undefined): boolean {
		if (!rule?.enabled) {
			return false;
		}

		if (!rule.expiresAt) {
			return true;
		}

		const expiresAt = new Date(rule.expiresAt);
		if (Number.isNaN(expiresAt.getTime())) {
			return false;
		}

		return Date.now() <= expiresAt.getTime();
	}

	private isLimitedTimeFeatureOpen(
		featureId: string,
		context?: PremiumFeatureAccessContext
	): boolean {
		const rule = LIMITED_TIME_FEATURE_ACCESS[featureId];
		if (!this.isLimitedTimeRuleActive(rule) || !rule) {
			return false;
		}

		return rule.contexts.some((matcher) => this.isContextMatched(context, matcher));
	}
}

export interface PremiumFeatureAccessContext {
	page?: string;
}

interface LimitedTimeFeatureRule {
	enabled: boolean;
	expiresAt?: string | null;
	contexts: PremiumFeatureAccessContext[];
}

const LIMITED_TIME_FEATURE_ACCESS: Partial<Record<string, LimitedTimeFeatureRule>> = {};

/**
 * 默认导出单例实例获取方法
 */
export default PremiumFeatureGuard;
