/**
 * Navigation Registry
 *
 * Collects and composes feature navigation into sidebar configuration.
 * Features register their nav metadata, and the registry builds the nav tree.
 *
 * @example
 * ```ts
 * // In feature module
 * import { navRegistry } from '@/navigation/navRegistry';
 * navRegistry.register(coursesNavModule);
 *
 * // In Sidebar component
 * const navItems = navRegistry.getFiltered({ role: 'admin' });
 * ```
 */

import type {
    FeatureNavModule,
    NavItem,
    NavSection,
    GroupedNavItems,
    NavFilterOptions,
    NavSectionConfig,
} from "./nav.types";
import { NAV_SECTIONS } from "./nav.types";

// ============================================================================
// Registry State
// ============================================================================

const registeredModules: Map<string, FeatureNavModule> = new Map();

// ============================================================================
// Filtering Helpers
// ============================================================================

/**
 * Check if user has access to nav item based on role and permissions
 */
const hasAccess = (
    item: NavItem,
    role?: string,
    permissions?: string[]
): boolean => {
    // Check role restriction
    if (item.roles?.length && role) {
        if (!item.roles.includes(role as any)) {
            return false;
        }
    }

    // Check permission restriction
    if (item.permissions?.length && permissions) {
        const hasPermission = item.permissions.some((p) =>
            permissions.includes(p)
        );
        if (!hasPermission) {
            return false;
        }
    }

    return true;
};

/**
 * Filter nav items recursively
 */
const filterItems = (
    items: NavItem[],
    options: NavFilterOptions
): NavItem[] => {
    return items
        .filter((item) => {
            // Skip hidden unless explicitly included
            if (item.hidden && !options.includeHidden) {
                return false;
            }

            return hasAccess(item, options.role, options.permissions);
        })
        .map((item) => ({
            ...item,
            children: item.children
                ? filterItems(item.children, options)
                : undefined,
        }))
        .filter((item) => {
            // Remove items with no accessible children (if they had children)
            if (item.children && item.children.length === 0) {
                return false;
            }
            return true;
        });
};

/**
 * Sort items by order property
 */
const sortItems = (items: NavItem[]): NavItem[] => {
    return [...items]
        .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
        .map((item) => ({
            ...item,
            children: item.children ? sortItems(item.children) : undefined,
        }));
};

// ============================================================================
// Registry API
// ============================================================================

export const navRegistry = {
    /**
     * Register a feature navigation module
     */
    register(module: FeatureNavModule): void {
        if (registeredModules.has(module.featureId)) {
            console.warn(
                `Nav module "${module.featureId}" is already registered. Skipping.`
            );
            return;
        }
        registeredModules.set(module.featureId, module);
    },

    /**
     * Unregister a feature navigation module
     */
    unregister(featureId: string): boolean {
        return registeredModules.delete(featureId);
    },

    /**
     * Get all registered modules
     */
    getAll(): FeatureNavModule[] {
        return Array.from(registeredModules.values());
    },

    /**
     * Get module by feature ID
     */
    getById(featureId: string): FeatureNavModule | undefined {
        return registeredModules.get(featureId);
    },

    /**
     * Get all items for a specific section
     */
    getBySection(section: NavSection): NavItem[] {
        const items: NavItem[] = [];

        this.getAll()
            .filter((m) => m.section === section)
            .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
            .forEach((module) => {
                items.push(...module.items);
            });

        return sortItems(items);
    },

    /**
     * Get all items grouped by section
     */
    getGrouped(): GroupedNavItems {
        const grouped: GroupedNavItems = {
            "Curriculum Management": [],
            "Groups Management": [],
            Account: [],
            "Tickets Management": [],
            Classroom: [],
            Admin: [],
        };

        this.getAll().forEach((module) => {
            // Ensure the section exists in grouped object
            if (!grouped[module.section]) {
                console.warn(
                    `[Nav] Unknown section "${module.section}" for module "${module.featureId}". Skipping.`
                );
                return;
            }
            grouped[module.section].push(...module.items);
        });

        // Sort each section
        Object.keys(grouped).forEach((section) => {
            grouped[section as NavSection] = sortItems(
                grouped[section as NavSection]
            );
        });

        return grouped;
    },

    /**
     * Get filtered navigation items based on role and permissions
     */
    getFiltered(options: NavFilterOptions = {}): GroupedNavItems {
        const grouped = this.getGrouped();

        Object.keys(grouped).forEach((section) => {
            grouped[section as NavSection] = filterItems(
                grouped[section as NavSection],
                options
            );
        });

        return grouped;
    },

    /**
     * Get flat list of all nav items (filtered)
     */
    getFlatList(options: NavFilterOptions = {}): NavItem[] {
        const grouped = this.getFiltered(options);
        const sections = NAV_SECTIONS.sort((a, b) => a.order - b.order);

        const items: NavItem[] = [];
        sections.forEach((section) => {
            items.push(...grouped[section.id]);
        });

        return items;
    },

    /**
     * Get section configurations with items
     */
    getSectionsWithItems(
        options: NavFilterOptions = {}
    ): Array<NavSectionConfig & { items: NavItem[] }> {
        const grouped = this.getFiltered(options);

        return NAV_SECTIONS.sort((a, b) => a.order - b.order)
            .map((section) => ({
                ...section,
                items: grouped[section.id],
            }))
            .filter((section) => section.items.length > 0);
    },

    /**
     * Find nav item by href
     */
    findByHref(href: string): NavItem | undefined {
        const search = (items: NavItem[]): NavItem | undefined => {
            for (const item of items) {
                if (item.href === href) {
                    return item;
                }
                if (item.children) {
                    const found = search(item.children);
                    if (found) return found;
                }
            }
            return undefined;
        };

        for (const module of this.getAll()) {
            const found = search(module.items);
            if (found) return found;
        }

        return undefined;
    },

    /**
     * Clear all registered modules (useful for testing)
     */
    clear(): void {
        registeredModules.clear();
    },

    /**
     * Get count of registered modules
     */
    get size(): number {
        return registeredModules.size;
    },
};

export type NavRegistry = typeof navRegistry;
