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

const ACCEPTANCE_EXAMS_BASE_PATH = "/admin/acceptance-exams";

// ============================================================================
// Submissions Paths
// ============================================================================

export const acceptanceExamsPaths = {
    list: () => `${ACCEPTANCE_EXAMS_BASE_PATH}/exams`,
} as const;

export const acceptanceSubmissionsPaths = {
    list: () => `${ACCEPTANCE_EXAMS_BASE_PATH}/submissions`,
} as const;

// ============================================================================
// Register Feature Paths
// ============================================================================

export const acceptanceExamsManagementPaths = registerFeaturePaths(
    "acceptanceExams",
    {
        examsList: acceptanceExamsPaths.list,
        submissionsList: acceptanceSubmissionsPaths.list,
    }
);

// ============================================================================
// Type Exports
// ============================================================================

export type AcceptanceExamsManagementPaths =
    typeof acceptanceExamsManagementPaths;
