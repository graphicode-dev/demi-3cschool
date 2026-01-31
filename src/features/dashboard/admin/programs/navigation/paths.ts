/**
 * Programs Management - Path Builders
 *
 * Centralized, type-safe path builders for programs management.
 * Includes Terms, Courses, and Lessons paths.
 *
 * @example
 * ```ts
 * import { programsPaths } from '@/features/programs/paths';
 *
 * navigate(programsPaths.programs.list());
 * navigate(programsPaths.programs.view(courseId));
 * navigate(programsPaths.lessons.edit(lessonId));
 * ```
 */

import { registerFeaturePaths } from "@/router/paths.registry";

// ============================================================================
// Programs Paths
// ============================================================================

export const programsPaths = {
    list: () => "/admin/programs",
} as const;

// ============================================================================
// Combined Programs Management Paths
// ============================================================================

export const programsManagementPaths = registerFeaturePaths(
    "programsManagement",
    {
        // Programs
        programsList: programsPaths.list,
    }
);

// ============================================================================
// Type Exports
// ============================================================================

export type ProgramsPaths = typeof programsPaths;
export type ProgramsManagementPaths = typeof programsManagementPaths;
