/**
 * Navigation Module
 *
 * Public exports for navigation infrastructure.
 *
 * @example
 * ```ts
 * import { navRegistry, useNavItems, useBreadcrumbs } from '@/navigation';
 * ```
 */

// Types
export type {
    NavItem,
    NavSection,
    FeatureNavModule,
    GroupedNavItems,
    NavFilterOptions,
    NavSectionConfig,
} from "./nav.types";

export { NAV_SECTIONS } from "./nav.types";

// Registry
export { navRegistry } from "./navRegistry";
export type { NavRegistry } from "./navRegistry";

// Hooks
export { useNavItems } from "./hooks/useNavItems";
export { useBreadcrumbs } from "./hooks/useBreadcrumbs";
export type { BreadcrumbItem } from "./hooks/useBreadcrumbs";
