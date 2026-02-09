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

// ============================================================================
// Programs Paths
// ============================================================================

export const programsPaths = {
    main: () => "/admin/programs",
    summerList: () => "summer",
    standardList: () => "standard",
} as const;

// ============================================================================
// Type Exports
// ============================================================================

export type ProgramsPaths = typeof programsPaths;
