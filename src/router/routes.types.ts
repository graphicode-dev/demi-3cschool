/**
 * Feature-Based Routing - Type Definitions
 *
 * Type-safe route configuration for React Router v6.
 * Each feature exports routes using these types.
 */

import type { ComponentType, ReactNode } from "react";

// ============================================================================
// Route Configuration Types
// ============================================================================

/**
 * Role type
 */
export type Roles = "admin" | "super_admin" | "student" | "teacher";

/**
 * Lazy component loader function
 */
export type LazyLoader = () => Promise<{ default: ComponentType<unknown> }>;

/**
 * Route guard function
 */
export type RouteGuard = () => boolean | Promise<boolean>;

/**
 * Single route definition
 */
export interface RouteConfig {
    /**
     * Route path (relative to parent)
     */
    path?: string;

    /**
     * Index route flag
     */
    index?: boolean;

    /**
     * Lazy-loaded component
     */
    lazy?: LazyLoader;

    /**
     * Static component (not lazy)
     */
    element?: ReactNode;

    /**
     * Error boundary element
     */
    errorElement?: ReactNode;

    /**
     * Nested routes
     */
    children?: RouteConfig[];

    /**
     * Required roles for access
     */
    roles?: Roles[];

    /**
     * Required permissions for access (user must have at least one)
     */
    permissions?: string[];

    /**
     * Require all permissions instead of any (default: false)
     */
    requireAllPermissions?: boolean;

    /**
     * Route guard function
     */
    guard?: RouteGuard;

    /**
     * Route metadata
     */
    meta?: {
        /** Static title or i18n key */
        title?: string;
        /** i18n key for title (resolved at runtime) */
        titleKey?: string;
        description?: string;
        requiresAuth?: boolean;
    };

    /**
     * Route handle data (accessible via useMatches)
     */
    handle?: Record<string, unknown>;
}

/**
 * Feature route configuration (legacy - use FeatureRouteModule for new features)
 */
export interface FeatureRouteConfig extends RouteConfig {
    /**
     * Feature identifier
     */
    id: string;

    /**
     * Feature display name
     */
    name: string;
}

/**
 * Layout type for route modules
 */
export type LayoutType = "dashboard" | "auth" | "site" | "none";

/**
 * Feature Route Module
 *
 * The standard export format for feature routes.
 * Each feature exports a single module that the router composes.
 */
export interface FeatureRouteModule {
    /**
     * Unique feature identifier
     */
    id: string;

    /**
     * Feature display name
     */
    name: string;

    /**
     * Base path for this feature (e.g., "/dashboard/courses")
     */
    basePath: string;

    /**
     * Route configuration tree
     */
    routes: RouteConfig;

    /**
     * Layout to wrap routes
     * @default "dashboard"
     */
    layout?: LayoutType;
}

// ============================================================================
// Route Registry Types
// ============================================================================

/**
 * Route registry for collecting feature routes
 */
export interface RouteRegistry {
    /**
     * Register feature routes
     */
    register: (routes: FeatureRouteConfig) => void;

    /**
     * Get all registered routes
     */
    getRoutes: () => FeatureRouteConfig[];

    /**
     * Get route by ID
     */
    getById: (id: string) => FeatureRouteConfig | undefined;
}

// ============================================================================
// Layout Types
// ============================================================================

/**
 * Layout wrapper component props
 */
export interface LayoutProps {
    children: ReactNode;
}

/**
 * Layout configuration
 */
export interface LayoutConfig {
    /**
     * Layout component
     */
    component: ComponentType<LayoutProps>;

    /**
     * Routes using this layout
     */
    routes: RouteConfig[];
}

// ============================================================================
// Navigation Types
// ============================================================================

/**
 * Navigation item for menus
 */
export interface NavItem {
    path: string;
    label: string;
    icon?: ComponentType;
    roles?: Roles[];
    children?: NavItem[];
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
    path: string;
    label: string;
}
