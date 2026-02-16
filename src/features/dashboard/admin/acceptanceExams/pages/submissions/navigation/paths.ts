/**
 * Submissions - Path Builders
 *
 * Centralized, type-safe path builders for Submissions navigation.
 * Flow: Submissions
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

const SUBMISSIONS_BASE_PATH = "/admin/acceptance-exams";

// ============================================================================
// Submissions Paths
// ============================================================================

export const submissionsPaths = {
    list: () => `${SUBMISSIONS_BASE_PATH}/submissions`,
} as const;

// ============================================================================
// Register Feature Paths
// ============================================================================

export const submissionsManagementPaths = registerFeaturePaths("submissions", {
    submissionsList: submissionsPaths.list,
});

// ============================================================================
// Type Exports
// ============================================================================

export type SubmissionsManagementPaths = typeof submissionsManagementPaths;
