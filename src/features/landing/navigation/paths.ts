/**
 * Site - Path Builders
 *
 * Centralized, type-safe path builders for the public site pages.
 *
 * @example
 * ```ts
 * import { sitePaths } from '@/features/landing/navigation/paths';
 * navigate(sitePaths.home());
 * navigate(sitePaths.about());
 * ```
 */

import { registerFeaturePaths } from "@/router/paths.registry";

export const sitePaths = {
    home: () => "/",
    about: () => "/#about",
    howItWorks: () => "/#how-it-works",
    faq: () => "/#faq",
    contact: () => "/#contact",
} as const;

export const siteManagementPaths = registerFeaturePaths("site", {
    home: sitePaths.home,
    about: sitePaths.about,
    howItWorks: sitePaths.howItWorks,
    faq: sitePaths.faq,
    contact: sitePaths.contact,
});

export type SitePaths = typeof sitePaths;
