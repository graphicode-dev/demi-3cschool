/**
 * useBreadcrumbs Hook
 *
 * Derives breadcrumb trail from current pathname segments.
 * Fully dynamic - builds from pathname and matches nav items for labels.
 *
 * @example
 * ```tsx
 * const breadcrumbs = useBreadcrumbs();
 *
 * // Render breadcrumbs
 * breadcrumbs.map((crumb, index) => (
 *     <BreadcrumbItem key={crumb.path} {...crumb} isLast={index === breadcrumbs.length - 1} />
 * ));
 * ```
 */

import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { navRegistry } from "../navRegistry";
import type { NavItem } from "../nav.types";
import { paths } from "@/router";

export interface BreadcrumbItem {
    path: string;
    label: string;
    labelKey?: string;
    isActive: boolean;
}

interface UseBreadcrumbsOptions {
    /**
     * Include dashboard as first crumb
     */
    includeDashboard?: boolean;

    /**
     * Dashboard crumb configuration
     */
    dashboardConfig?: {
        path: string;
        label: string;
        labelKey?: string;
    };
}

const DEFAULT_DASHBOARD = {
    path: paths.dashboard.root.list(),
    label: "Dashboard",
    labelKey: "overview:overview.breadcrumb",
};

/**
 * Convert kebab-case to Title Case
 */
const toTitleCase = (str: string): string => {
    return str
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

/**
 * Check if segment is a dynamic ID (UUID or numeric)
 */
const isDynamicSegment = (segment: string): boolean => {
    return (
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            segment
        ) || /^\d+$/.test(segment)
    );
};

/**
 * Collect all nav items including children into flat list
 */
const collectAllNavItems = (items: NavItem[]): NavItem[] => {
    const result: NavItem[] = [];
    for (const item of items) {
        result.push(item);
        if (item.children) {
            result.push(...collectAllNavItems(item.children));
        }
    }
    return result;
};

/**
 * Find nav item by exact href match
 * Returns the item with exact href match, prioritizing leaf nodes
 */
const findNavItemByHref = (
    href: string,
    items: NavItem[]
): NavItem | undefined => {
    // Find all items with matching href
    const matches = items.filter((item) => item.href === href);

    if (matches.length === 0) return undefined;

    // Prefer leaf nodes (no children)
    const leafMatch = matches.find((item) => !item.children);
    return leafMatch || matches[0];
};

/**
 * Find nav item by key (segment name) - checks exact match or suffix match
 * e.g., segment "courses" matches key "standard-courses" or "professional-courses"
 */
const findNavItemByKey = (
    key: string,
    items: NavItem[],
    parentSegment?: string
): NavItem | undefined => {
    // Try exact match first
    const exactMatch = items.find((item) => item.key === key);
    if (exactMatch) return exactMatch;

    // Try suffix match with parent context (e.g., "standard-courses" for segment "courses" under "standard-learning")
    if (parentSegment) {
        const prefixedKey = `${parentSegment.replace("-learning", "")}-${key}`;
        const prefixMatch = items.find((item) => item.key === prefixedKey);
        if (prefixMatch) return prefixMatch;
    }

    // Don't use suffix match as fallback - it can match wrong items
    // (e.g., "standard-courses" when we're in professional-learning)
    return undefined;
};

export const useBreadcrumbs = (
    options: UseBreadcrumbsOptions = {}
): BreadcrumbItem[] => {
    const { includeDashboard = true, dashboardConfig = DEFAULT_DASHBOARD } =
        options;
    const { pathname } = useLocation();
    const { t } = useTranslation();

    const breadcrumbs = useMemo(() => {
        const crumbs: BreadcrumbItem[] = [];

        // Skip if on dashboard root
        if (pathname === dashboardConfig.path) {
            return [
                {
                    path: dashboardConfig.path,
                    label: dashboardConfig.labelKey
                        ? t(dashboardConfig.labelKey, dashboardConfig.label)
                        : dashboardConfig.label,
                    labelKey: dashboardConfig.labelKey,
                    isActive: true,
                },
            ];
        }

        // Get all nav items for matching
        const allItems = navRegistry.getFlatList({ includeHidden: true });
        const flatItems = collectAllNavItems(allItems);

        // Build breadcrumbs from pathname segments
        const segments = pathname.split("/").filter(Boolean);
        let currentPath = "";
        let parentSegment: string | undefined;
        const seenLabels = new Set<string>();

        for (const segment of segments) {
            currentPath += "/" + segment;

            // Skip dashboard segment (added separately)
            if (segment === "dashboard") {
                continue;
            }

            // Skip dynamic segments (IDs)
            if (isDynamicSegment(segment)) {
                continue;
            }

            // Try to find nav item by exact href match first
            let navItem = findNavItemByHref(currentPath, flatItems);

            // If no exact match, try to find by key (segment name)
            if (!navItem) {
                navItem = findNavItemByKey(segment, flatItems, parentSegment);
            }

            // Update parent segment for next iteration
            parentSegment = segment;

            // Determine label and path
            let label: string;
            let labelKey: string | undefined;
            let breadcrumbPath = currentPath;

            if (navItem) {
                label = t(navItem.labelKey, navItem.label);
                labelKey = navItem.labelKey;
                // For parent items with children, use their href (which points to default child)
                if (navItem.children && navItem.href) {
                    breadcrumbPath = navItem.href;
                }
            } else {
                label = toTitleCase(segment);
            }

            // Skip if we already have this label (avoid duplicates)
            if (seenLabels.has(label)) {
                continue;
            }

            seenLabels.add(label);

            crumbs.push({
                path: breadcrumbPath,
                label,
                labelKey,
                isActive: false,
            });
        }

        // Add dashboard at the beginning if enabled
        if (includeDashboard) {
            const dashboardLabel = dashboardConfig.labelKey
                ? t(dashboardConfig.labelKey, dashboardConfig.label)
                : dashboardConfig.label;

            crumbs.unshift({
                path: dashboardConfig.path,
                label: dashboardLabel,
                labelKey: dashboardConfig.labelKey,
                isActive: false,
            });
        }

        // Mark only the last item as active
        if (crumbs.length > 0) {
            crumbs[crumbs.length - 1].isActive = true;
        }

        return crumbs;
    }, [pathname, includeDashboard, dashboardConfig, t]);

    return breadcrumbs;
};

export default useBreadcrumbs;
