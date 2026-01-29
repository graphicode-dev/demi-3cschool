/**
 * useNavItems Hook
 *
 * Returns filtered navigation items based on current user's role and permissions.
 * Uses the existing usePermissions hook for permission checking.
 *
 * @example
 * ```tsx
 * const { sections, flatItems, findByHref } = useNavItems();
 *
 * // Render sections in sidebar
 * sections.map(section => (
 *     <NavSection key={section.id} {...section} />
 * ));
 * ```
 */

import { useMemo, useCallback } from "react";
import { navRegistry } from "../navRegistry";
import { usePermissions } from "@/auth/usePermissions";
import { authStore } from "@/auth/auth.store";
import type { Permission } from "@/auth/auth.types";
import type { NavItem, NavSectionConfig, NavFilterOptions } from "../nav.types";

interface UseNavItemsReturn {
    /**
     * Sections with their filtered items
     */
    sections: Array<NavSectionConfig & { items: NavItem[] }>;

    /**
     * Flat list of all accessible items
     */
    flatItems: NavItem[];

    /**
     * Find nav item by href
     */
    findByHref: (href: string) => NavItem | undefined;

    /**
     * Check if a path is active
     */
    isActive: (href: string, currentPath: string) => boolean;

    /**
     * Permission utilities from usePermissions hook
     */
    hasPermission: (permission: Permission) => boolean;
    hasAnyPermission: (permissions: Permission[]) => boolean;
    hasAllPermissions: (permissions: Permission[]) => boolean;
    hasRole: (role: string) => boolean;
    hasAnyRole: (roles: string[]) => boolean;

    /**
     * Current user's permissions
     */
    permissions: Permission[];
}

export const useNavItems = (
    overrideOptions?: Partial<NavFilterOptions>
): UseNavItemsReturn => {
    const {
        permissions,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        hasAnyRole,
    } = usePermissions();

    const filterOptions: NavFilterOptions = useMemo(
        () => ({
            permissions,
            includeHidden: false,
            ...overrideOptions,
        }),
        [permissions, overrideOptions]
    );

    // Determine which dashboard section to show based on user role
    const userDashboardSection = useMemo(() => {
        const user = authStore.getState().user;
        // Admin users see Admin section, others see Classroom section
        if (
            user?.role?.name === "admin" ||
            user?.role?.name === "super_admin"
        ) {
            return "Admin";
        }
        return "Classroom";
    }, []);

    const sections = useMemo(() => {
        const allSections = navRegistry.getSectionsWithItems(filterOptions);
        // Filter out the opposite dashboard section
        // Admin users don't see Classroom, Classroom users don't see Admin
        return allSections.filter((section) => {
            if (
                section.id === "Classroom" &&
                userDashboardSection === "Admin"
            ) {
                return false;
            }
            if (
                section.id === "Admin" &&
                userDashboardSection === "Classroom"
            ) {
                return false;
            }
            return true;
        });
    }, [filterOptions, userDashboardSection]);

    const flatItems = useMemo(
        () => navRegistry.getFlatList(filterOptions),
        [filterOptions]
    );

    const findByHref = useCallback((href: string): NavItem | undefined => {
        return navRegistry.findByHref(href);
    }, []);

    const isActive = useCallback(
        (href: string, currentPath: string): boolean => {
            if (href === currentPath) return true;
            // Check if current path starts with href (for nested routes)
            if (href !== "/" && currentPath.startsWith(href)) return true;
            return false;
        },
        []
    );

    return {
        sections,
        flatItems,
        findByHref,
        isActive,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        hasAnyRole,
        permissions,
    };
};

export default useNavItems;
