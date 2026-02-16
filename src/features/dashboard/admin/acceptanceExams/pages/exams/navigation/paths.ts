/**
 * Learning Feature - Path Builders
 *
 * Centralized, type-safe path builders for Grades navigation.
 * Flow: Grades -> Grade 4/5/6 -> Terms -> Lessons
 *
 * @example
 * ```ts
 * import { learningPaths, gradesPaths } from '@/features/learning/navigation/paths';
 *
 * navigate(gradesPaths.list());
 * navigate(gradesPaths.terms(4));
 * navigate(gradesPaths.lessons(4, 'first_term'));
 * ```
 */

import { registerFeaturePaths } from "@/router/paths.registry";

const EXAMS_BASE_PATH = "/admin/acceptance-exams";

// ============================================================================
// Exams Paths
// ============================================================================

export const acceptanceExamsPaths = {
    list: () => `${EXAMS_BASE_PATH}/exams`,
} as const;

// ============================================================================
// Register Feature Paths
// ============================================================================

export const examsManagementPaths = registerFeaturePaths("exams", {
    examsList: acceptanceExamsPaths.list,
});

// ============================================================================
// Type Exports
// ============================================================================

export type ExamsManagementPaths = typeof examsManagementPaths;
