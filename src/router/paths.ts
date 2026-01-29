/**
 * Centralized Typed Path Builders
 *
 * Single source of truth for all route paths.
 * Eliminates hardcoded strings throughout the app.
 *
 * @example
 * ```ts
 * import { paths } from '@/router/paths';
 *
 * // Static paths
 * navigate(paths.auth.login());
 *
 * // Dynamic paths
 * navigate(paths.courses.detail(courseId));
 * ```
 */

import { To } from "react-router-dom";
import {
    featurePaths,
    registerFeaturePaths,
    type FeaturePaths,
} from "./paths.registry";

// Re-export registry for convenience
export { featurePaths, registerFeaturePaths, type FeaturePaths };

// ============================================================================
// Feature Path Imports (lazy to avoid circular deps)
// ============================================================================

// Import feature paths - they self-register via registerFeaturePaths
import { authPaths } from "@/features/auth/navigation/paths";
import { sitePaths } from "@/features/landing/navigation/paths";
import { classroomPaths } from "@/features/dashboard/classroom/navigation/paths";
import { adminPaths } from "@/features/dashboard/admin/navigation/paths";
import { sharedPaths } from "@/features/dashboard/shared/navigation/paths";
import { overviewPaths } from "@/features/dashboard/admin/overview/navigation";

// ============================================================================
// Path Builder Factory
// ============================================================================

type PathParams = Record<string, string | number>;

/**
 * Creates a type-safe path builder function
 */
const createPath = <T extends PathParams = Record<string, never>>(
    template: string
) => {
    return (params?: T): To => {
        if (!params) return template;
        return Object.entries(params).reduce(
            (path, [key, value]) => path.replace(`:${key}`, String(value)),
            template
        );
    };
};

// ============================================================================
// Global Paths (non-feature specific)
// ============================================================================

export const paths = {
    // ========================================================================
    // Site (Public) - from feature
    // ========================================================================
    site: sitePaths,

    // ========================================================================
    // Auth - from feature
    // ========================================================================
    auth: authPaths,

    // ========================================================================
    // Dashboard (Root)
    // ========================================================================
    dashboard: {
        root: overviewPaths,
        // learning: learningManagementPaths,
        // groupsManagement: groupsManagementPaths,
        // groupsAnalyticsManagement: groupsAnalyticsManagementPaths,
        classroom: classroomPaths,
        admin: adminPaths,
        // salesSubscription: salesSubscriptionPaths,
        ticketsManagement: sharedPaths.ticketsManagement,
    },

    // ========================================================================
    // Shared Pages
    // ========================================================================
    shared: {
        notFound: createPath("/404"),
        unauthorized: createPath("/unauthorized"),
        serverError: createPath("/500"),
    },
} as const;

// ============================================================================
// Type Exports
// ============================================================================

export type Paths = typeof paths;

/**
 * Helper type to extract all possible path strings
 */
type ExtractPaths<T> = T extends (...args: any[]) => infer R
    ? R
    : T extends object
      ? { [K in keyof T]: ExtractPaths<T[K]> }[keyof T]
      : never;

export type AppPath = ExtractPaths<Paths>;
