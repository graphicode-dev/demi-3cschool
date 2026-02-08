/**
 * Route Registry
 *
 * Collects and composes feature routes into a single router configuration.
 * Features register their routes, and the registry builds the final route tree.
 *
 * @example
 * ```ts
 * // In feature module
 * import { routeRegistry } from '@/router/routeRegistry';
 * routeRegistry.register(coursesRouteModule);
 *
 * // In router/index.tsx
 * const routes = routeRegistry.getRouteObjects();
 * ```
 */

import type { RouteObject } from "react-router-dom";
import { Outlet } from "react-router-dom";
import type { FeatureRouteModule, RouteConfig } from "./routes.types";
import { RouteErrorBoundary } from "./RouteErrorBoundary";
import { createElement } from "react";
import { ProtectedRoute } from "@/auth/ProtectedRoute";

// ============================================================================
// Registry State
// ============================================================================

const registeredModules: Map<string, FeatureRouteModule> = new Map();

// ============================================================================
// Route Transformation
// ============================================================================

/**
 * Check if route has permission/role requirements
 */
const hasAccessControl = (config: RouteConfig): boolean => {
    return !!(
        (config.permissions && config.permissions.length > 0) ||
        (config.roles && config.roles.length > 0)
    );
};

/**
 * Create a suspense-wrapped lazy loader with optional permission protection
 */
const createLazyLoader = (
    loader: () => Promise<{ default: React.ComponentType }>,
    config: RouteConfig
) => {
    return async () => {
        const module = await loader();
        const Component = module.default;

        // If no access control, return component directly
        if (!hasAccessControl(config)) {
            return { Component };
        }

        // Wrap with ProtectedRoute for permission/role checks
        const ProtectedComponent = () =>
            createElement(ProtectedRoute, {
                permissions: config.permissions,
                requireAllPermissions: config.requireAllPermissions,
                roles: config.roles,
                children: createElement(Component),
            });

        return { Component: ProtectedComponent };
    };
};

/**
 * Transform RouteConfig to React Router RouteObject
 */
const transformRoute = (config: RouteConfig): RouteObject => {
    // Handle index routes separately (they can't have children or path)
    if (config.index) {
        const indexRoute: RouteObject = { index: true };

        if (config.element) {
            indexRoute.element = config.element;
        }

        if (config.lazy) {
            indexRoute.lazy = createLazyLoader(config.lazy, config);
        }

        if (config.handle || config.meta) {
            indexRoute.handle = {
                ...config.handle,
                meta: config.meta,
                roles: config.roles,
            };
        }

        return indexRoute;
    }

    // Non-index routes
    const route: RouteObject = {};

    if (config.path !== undefined) {
        route.path = config.path;
    }

    if (config.element) {
        route.element = config.element;
    }

    if (config.lazy) {
        route.lazy = createLazyLoader(config.lazy, config);
    }

    if (config.errorElement) {
        route.errorElement = config.errorElement;
    } else {
        route.errorElement = createElement(RouteErrorBoundary);
    }

    if (config.children?.length) {
        route.children = config.children.map(transformRoute);
    }

    if (config.handle || config.meta) {
        route.handle = {
            ...config.handle,
            meta: config.meta,
            roles: config.roles,
        };
    }

    return route;
};

// ============================================================================
// Registry API
// ============================================================================

export const routeRegistry = {
    /**
     * Register a feature route module
     */
    register(module: FeatureRouteModule): void {
        if (registeredModules.has(module.id)) {
            console.warn(
                `Route module "${module.id}" is already registered. Skipping.`
            );
            return;
        }
        registeredModules.set(module.id, module);
    },

    /**
     * Unregister a feature route module
     */
    unregister(id: string): boolean {
        return registeredModules.delete(id);
    },

    /**
     * Get all registered modules
     */
    getAll(): FeatureRouteModule[] {
        return Array.from(registeredModules.values());
    },

    /**
     * Get module by ID
     */
    getById(id: string): FeatureRouteModule | undefined {
        return registeredModules.get(id);
    },

    /**
     * Get modules by layout type
     */
    getByLayout(layout: FeatureRouteModule["layout"]): FeatureRouteModule[] {
        return this.getAll().filter(
            (m) => (m.layout ?? "dashboard") === layout
        );
    },

    /**
     * Transform all registered modules to React Router RouteObjects
     */
    getRouteObjects(): RouteObject[] {
        return this.getAll().map((module) => ({
            path: module.basePath,
            ...transformRoute(module.routes),
        }));
    },

    /**
     * Get route objects grouped by layout
     */
    getRoutesByLayout(): Record<string, RouteObject[]> {
        const grouped: Record<string, RouteObject[]> = {
            dashboard: [],
            auth: [],
            site: [],
            none: [],
        };

        // Track routes by basePath to merge children with same basePath
        const routesByBasePath: Map<
            string,
            { layout: string; route: RouteObject }
        > = new Map();

        this.getAll().forEach((module) => {
            const layout = module.layout ?? "dashboard";

            // Skip modules without routes
            if (!module.routes) {
                console.warn(
                    `[Router] Module "${module.id}" has no routes defined. Skipping.`
                );
                return;
            }

            // If basePath is empty and routes have children, add children directly
            if (!module.basePath && module.routes.children?.length) {
                const childRoutes = module.routes.children.map(transformRoute);
                grouped[layout].push(...childRoutes);
            } else if (module.basePath) {
                // Check if we already have a route with this basePath
                const existing = routesByBasePath.get(module.basePath);
                if (existing && existing.layout === layout) {
                    // Merge children into existing route
                    const transformedRoute = transformRoute(module.routes);
                    if (transformedRoute.children && existing.route.children) {
                        existing.route.children.push(
                            ...transformedRoute.children
                        );
                    } else if (transformedRoute.children) {
                        existing.route.children = transformedRoute.children;
                    }
                } else {
                    // Create new route object
                    const routeObject: RouteObject = {
                        path: module.basePath,
                        ...transformRoute(module.routes),
                    };
                    routesByBasePath.set(module.basePath, {
                        layout,
                        route: routeObject,
                    });
                }
            }
        });

        // Add all routes from the basePath map to their respective layout groups
        routesByBasePath.forEach(({ layout, route }) => {
            // If route has children but no element, add Outlet as element
            if (route.children && route.children.length > 0 && !route.element) {
                route.element = createElement(Outlet);
            }
            grouped[layout].push(route);
        });

        return grouped;
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

export type RouteRegistry = typeof routeRegistry;
