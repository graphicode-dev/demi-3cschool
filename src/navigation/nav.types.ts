/**
 * Navigation Types
 *
 * Types for sidebar navigation, separate from routing.
 * Navigation is derived from feature metadata, not route config.
 */

import type { ComponentType } from "react";
import type { Roles } from "@/router/routes.types";

// ============================================================================
// Navigation Sections
// ============================================================================

/**
 * Navigation sections for grouping items in sidebar
 */
export type NavSection =
    | "Curriculum Management"
    | "Groups Management"
    | "Account"
    | "Tickets Management"
    | "Classroom"
    | "Admin";

// ============================================================================
// Navigation Item
// ============================================================================

/**
 * Single navigation item
 */
export interface NavItem {
    /**
     * Unique key for React rendering
     */
    key: string;

    /**
     * i18n translation key for label
     */
    labelKey: string;

    /**
     * Fallback label (English)
     */
    label: string;

    /**
     * Navigation path (href)
     */
    href: string;

    /**
     * Icon component
     */
    icon?: ComponentType<{ className?: string }>;

    /**
     * Roles that can see this item
     */
    roles?: Roles[];

    /**
     * Required permissions (any of these)
     */
    permissions?: string[];

    /**
     * Nested navigation items
     */
    children?: NavItem[];

    /**
     * Badge count (e.g., unread notifications)
     */
    badge?: number | (() => number);

    /**
     * Hide from navigation but keep route accessible
     */
    hidden?: boolean;

    /**
     * Sort order within parent (lower = higher)
     */
    order?: number;

    /**
     * Whether this item is disabled
     */
    disabled?: boolean;

    /**
     * External link (opens in new tab)
     */
    external?: boolean;
}

// ============================================================================
// Feature Navigation Module
// ============================================================================

/**
 * Feature Navigation Module
 *
 * Each feature exports its navigation metadata using this interface.
 * The navigation registry collects and composes these into the sidebar.
 */
export interface FeatureNavModule {
    /**
     * Feature identifier (should match route module id)
     */
    featureId: string;

    /**
     * Navigation section for grouping
     */
    section: NavSection;

    /**
     * Navigation items for this feature
     */
    items: NavItem[];

    /**
     * Sort order within section (lower = higher)
     */
    order?: number;
}

// ============================================================================
// Navigation Registry Types
// ============================================================================

/**
 * Grouped navigation items by section
 */
export type GroupedNavItems = Record<NavSection, NavItem[]>;

/**
 * Filter options for navigation
 */
export interface NavFilterOptions {
    role?: Roles;
    permissions?: string[];
    includeHidden?: boolean;
}

// ============================================================================
// Section Metadata
// ============================================================================

/**
 * Section display configuration
 */
export interface NavSectionConfig {
    /**
     * Section identifier
     */
    id: NavSection;

    /**
     * i18n translation key
     */
    labelKey: string;

    /**
     * Fallback label
     */
    label: string;

    /**
     * Sort order (lower = higher)
     */
    order: number;

    /**
     * Whether to show section header
     */
    showHeader?: boolean;

    /**
     * Divider before this section
     */
    dividerBefore?: boolean;
}

/**
 * Default section configuration
 */
export const NAV_SECTIONS: NavSectionConfig[] = [
    {
        id: "Curriculum Management",
        labelKey: "sidebar.sections.curriculumManagement",
        label: "Curriculum Management",
        order: 1,
        showHeader: true,
    },
    {
        id: "Groups Management",
        labelKey: "sidebar.sections.groupsManagement",
        label: "Groups Management",
        order: 2,
        showHeader: true,
    },
    {
        id: "Tickets Management",
        labelKey: "sidebar.sections.ticketsManagement",
        label: "Tickets Management",
        order: 4,
        showHeader: true,
    },
    {
        id: "Account",
        labelKey: "",
        label: "Account",
        order: 5,
        showHeader: true,
    },
    {
        id: "Classroom",
        labelKey: "sidebar.sections.classroom",
        label: "Classroom",
        order: 10,
        showHeader: true,
    },
    {
        id: "Admin",
        labelKey: "sidebar.sections.admin",
        label: "Admin",
        order: 100,
        showHeader: true,
        dividerBefore: true,
    },
];
