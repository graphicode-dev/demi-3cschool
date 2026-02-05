/**
 * Feature Loader
 *
 * Auto-discovers and registers feature routes and navigation.
 * Uses Vite's glob import to find all feature modules.
 *
 * @example
 * ```ts
 * // In router/index.tsx
 * import { loadFeatures } from './featureLoader';
 *
 * loadFeatures();
 * const routes = routeRegistry.getRouteObjects();
 * ```
 */

import { routeRegistry } from "./routeRegistry";
import { navRegistry } from "@/navigation/navRegistry";
import type { FeatureRouteModule } from "./routes.types";
import type { FeatureNavModule } from "@/navigation/nav.types";

// Manual imports for consolidated admin routes (excluded from glob to prevent circular deps)
import { adminRouteModule } from "@/features/dashboard/admin/navigation/routes";
import { adminNav } from "@/features/dashboard/admin/navigation/nav";

// ============================================================================
// Manual Feature Registration (Phase 1 - Incremental Migration)
// ============================================================================

/**
 * Manually register features during migration.
 * Replace with auto-discovery once all features are migrated.
 */
export const registerFeature = (
    routeModule?: FeatureRouteModule,
    navModule?: FeatureNavModule
): void => {
    if (routeModule) {
        routeRegistry.register(routeModule);
    }
    if (navModule) {
        navRegistry.register(navModule);
    }
};

// ============================================================================
// Auto-Discovery (Phase 2 - After Migration)
// ============================================================================

/**
 * Feature module exports shape
 */
interface FeatureExports {
    default?: FeatureRouteModule;
    [key: string]: unknown;
}

interface NavExports {
    default?: FeatureNavModule;
    [key: string]: unknown;
}

/**
 * Auto-load all feature routes using Vite glob import
 *
 * This will find all routes.ts files in features/* directories
 * and register them automatically.
 */
export const loadFeatureRoutes = (): void => {
    // Vite glob import - eager loads all matching modules
    // Matches both top-level features and nested dashboard features
    // Excludes admin feature routes (consolidated in admin/navigation/routes.tsx)
    const routeModules = import.meta.glob<FeatureExports>(
        [
            "../features/*/navigation/routes.{ts,tsx}",
            "../features/dashboard/*/navigation/routes.{ts,tsx}",
            "../features/dashboard/*/*/navigation/routes.{ts,tsx}",
            "../features/dashboard/*/*/*/navigation/routes.{ts,tsx}",
            // Exclude admin feature routes (they are consolidated in admin/navigation/routes.tsx)
            // The main admin routes file must be excluded to prevent circular dependency
            "!../features/dashboard/admin/navigation/**",
            "!../features/dashboard/admin/learning/**",
            "!../features/dashboard/admin/groupsManagement/**",
            "!../features/dashboard/admin/groupsAnalytics/**",
            "!../features/dashboard/admin/programs/**",
            "!../features/dashboard/admin/overview/**",
            "!../features/dashboard/admin/settings/**",
            "!../features/dashboard/admin/ticketsManagement/**",
        ],
        { eager: true }
    );

    Object.entries(routeModules).forEach(([path, module]) => {
        // Validation function for FeatureRouteModule
        const isFeatureRouteModule = (
            exp: unknown
        ): exp is FeatureRouteModule =>
            typeof exp === "object" &&
            exp !== null &&
            !Array.isArray(exp) &&
            "id" in exp &&
            "basePath" in exp &&
            "routes" in exp;

        // Find the route module export (default or named)
        const routeModule = isFeatureRouteModule(module.default)
            ? module.default
            : Object.values(module).find(isFeatureRouteModule);

        if (routeModule) {
            routeRegistry.register(routeModule);
            console.debug(`[Router] Registered routes: ${routeModule.id}`);
        }
    });
};

/**
 * Auto-load all feature navigation using Vite glob import
 */
export const loadFeatureNavigation = (): void => {
    // Excludes admin feature nav (consolidated in admin/navigation/nav.ts)
    const navModules = import.meta.glob<NavExports>(
        [
            "../features/*/navigation/nav.{ts,tsx}",
            "../features/dashboard/*/navigation/nav.{ts,tsx}",
            "../features/dashboard/*/*/navigation/nav.{ts,tsx}",
            "../features/dashboard/*/*/*/navigation/nav.{ts,tsx}",
            // Exclude admin feature nav (they are consolidated in admin/navigation/nav.ts)
            // The main admin nav file must be excluded to prevent circular dependency
            "!../features/dashboard/admin/navigation/**",
            "!../features/dashboard/admin/learning/**",
            "!../features/dashboard/admin/groupsManagement/**",
            "!../features/dashboard/admin/groupsAnalytics/**",
            "!../features/dashboard/admin/programs/**",
            "!../features/dashboard/admin/overview/**",
            "!../features/dashboard/admin/sales_subscription/**",
            "!../features/dashboard/admin/settings/**",
            "!../features/dashboard/admin/ticketsManagement/**",
            // Exclude classroom ticketsManagement nav (it's admin-only, students use supportHelp)
            "!../features/dashboard/classroom/ticketsManagement/navigation/nav.{ts,tsx}",
        ],
        { eager: true }
    );

    Object.entries(navModules).forEach(([path, module]) => {
        const navModule =
            module.default ||
            Object.values(module).find(
                (exp): exp is FeatureNavModule =>
                    typeof exp === "object" &&
                    exp !== null &&
                    "featureId" in exp &&
                    "section" in exp &&
                    "items" in exp
            );

        if (navModule) {
            navRegistry.register(navModule);
            console.debug(
                `[Nav] Registered navigation: ${navModule.featureId}`
            );
        } else {
            console.warn(`[Nav] No valid nav module found in: ${path}`);
        }
    });
};

/**
 * Load all features (routes + navigation)
 */
export const loadFeatures = (): void => {
    // Register consolidated admin routes manually (excluded from glob to prevent circular deps)
    routeRegistry.register(adminRouteModule);
    navRegistry.register(adminNav);

    // Auto-discover and register other feature routes
    loadFeatureRoutes();
    loadFeatureNavigation();
};

// ============================================================================
// Development Helpers
// ============================================================================

/**
 * Get registration status for debugging
 */
export const getRegistrationStatus = (): {
    routes: string[];
    navigation: string[];
} => {
    return {
        routes: routeRegistry.getAll().map((m) => m.id),
        navigation: navRegistry.getAll().map((m) => m.featureId),
    };
};
