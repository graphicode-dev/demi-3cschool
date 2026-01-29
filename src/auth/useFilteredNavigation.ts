/**
 * useFilteredNavigation Hook
 *
 * Filters navigation items based on user permissions.
 * Reusable across all features - follows Open/Closed principle.
 *
 * @example
 * ```tsx
 * import { useFilteredNavigation } from '@/auth';
 * import { learningNav } from '@/features/learning/navigation/nav';
 *
 * function Sidebar() {
 *     const filteredItems = useFilteredNavigation(learningNav.items);
 *     return <NavMenu items={filteredItems} />;
 * }
 * ```
 */

import { useMemo } from "react";
import { usePermissions } from "./usePermissions";
import type { NavItem } from "@/navigation/nav.types";

/**
 * Filters navigation items based on user permissions and roles
 */
export function useFilteredNavigation(items: NavItem[]): NavItem[] {
    const { hasAnyPermission, hasAnyRole } = usePermissions();

    return useMemo(() => {
        return filterNavItems(items, hasAnyPermission, hasAnyRole);
    }, [items, hasAnyPermission, hasAnyRole]);
}

/**
 * Recursively filters navigation items
 */
function filterNavItems(
    items: NavItem[],
    hasAnyPermission: (permissions: string[]) => boolean,
    hasAnyRole: (roles: string[]) => boolean
): NavItem[] {
    return items
        .filter((item) => {
            // Skip hidden items
            if (item.hidden) return false;

            // Check role access
            if (item.roles && item.roles.length > 0) {
                if (!hasAnyRole(item.roles)) return false;
            }

            // Check permission access
            if (item.permissions && item.permissions.length > 0) {
                if (!hasAnyPermission(item.permissions)) return false;
            }

            return true;
        })
        .map((item) => {
            // Recursively filter children
            if (item.children && item.children.length > 0) {
                const filteredChildren = filterNavItems(
                    item.children,
                    hasAnyPermission,
                    hasAnyRole
                );

                // If all children are filtered out, hide parent too
                if (filteredChildren.length === 0) {
                    return null;
                }

                return {
                    ...item,
                    children: filteredChildren,
                };
            }

            return item;
        })
        .filter((item): item is NavItem => item !== null);
}

/**
 * Hook to check if a specific nav item should be visible
 */
export function useNavItemVisible(item: NavItem): boolean {
    const { hasAnyPermission, hasAnyRole } = usePermissions();

    return useMemo(() => {
        if (item.hidden) return false;

        if (item.roles && item.roles.length > 0) {
            if (!hasAnyRole(item.roles)) return false;
        }

        if (item.permissions && item.permissions.length > 0) {
            if (!hasAnyPermission(item.permissions)) return false;
        }

        return true;
    }, [item, hasAnyPermission, hasAnyRole]);
}

export default useFilteredNavigation;
