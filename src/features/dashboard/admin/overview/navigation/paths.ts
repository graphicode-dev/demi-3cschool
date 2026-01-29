/**
 * Overview Management - Path Builders
 *
 * Centralized, type-safe path builders for overview management.
 * Includes Terms, Courses, and Lessons paths.
 *
 * @example
 * ```ts
 * import { programsPaths } from '@/features/overview/paths';
 *
 * navigate(programsPaths.overview.list());
 * navigate(programsPaths.overview.view(courseId));
 * navigate(programsPaths.lessons.edit(lessonId));
 * ```
 */

import { registerFeaturePaths } from "@/router/paths.registry";

// ============================================================================
// Overview Paths
// ============================================================================

export const overviewPaths = {
    list: () => "/dashboard",
} as const;

// ============================================================================
// Combined Overview Management Paths
// ============================================================================

export const OverviewManagementPaths = registerFeaturePaths(
    "overviewManagement",
    {
        // Overview
        programsList: overviewPaths.list,
    }
);

// ============================================================================
// Type Exports
// ============================================================================

export type OverviewPaths = typeof overviewPaths;
export type OverviewManagementPaths = typeof OverviewManagementPaths;
