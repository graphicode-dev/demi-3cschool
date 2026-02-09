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

// ============================================================================
// Overview Paths
// ============================================================================

export const overviewPaths = {
    list: () => "/admin/overview",
} as const;

// ============================================================================
// Type Exports
// ============================================================================

export type OverviewPaths = typeof overviewPaths;
