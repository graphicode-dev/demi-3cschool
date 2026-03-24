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
    about: () => "/#about-us",
    why3C: () => "/#why-3c",
    accreditation: () => "/#accreditation",
    plans: () => "/#plans",
} as const;

export const siteManagementPaths = registerFeaturePaths("site", {
    home: sitePaths.home,
    about: sitePaths.about,
    why3C: sitePaths.why3C,
    accreditation: sitePaths.accreditation,
    plans: sitePaths.plans,
});

export type SitePaths = typeof sitePaths;
