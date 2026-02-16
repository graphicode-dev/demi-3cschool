/**
 * Level Quizzes Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 *
 * @example
 * ```ts
 * // Invalidate all level quizzes data
 * queryClient.invalidateQueries({ queryKey: acceptanceExamKeys.all });
 *
 * // Invalidate only lists (keeps detail cache)
 * queryClient.invalidateQueries({ queryKey: acceptanceExamKeys.lists() });
 *
 * // Invalidate specific level quiz
 * queryClient.invalidateQueries({ queryKey: acceptanceExamKeys.detail(acceptanceExamId) });
 * ```
 */

import { AcceptanceExamsListParams } from "../../../../types/acceptance-exams.types";

/**
 * Query key factory for level quizzes
 *
 * Hierarchy:
 * - all: ['level-quizzes']
 * - metadata: ['level-quizzes', 'metadata']
 * - lists: ['level-quizzes', 'list']
 * - list(params): ['level-quizzes', 'list', params]
 * - details: ['level-quizzes', 'detail']
 * - detail(id): ['level-quizzes', 'detail', id]
 */
export const acceptanceExamKeys = {
    /**
     * Root key for all level quiz queries
     */
    all: ["level-quizzes"] as const,

    /**
     * Key for metadata query
     */
    metadata: () => [...acceptanceExamKeys.all, "metadata"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...acceptanceExamKeys.all, "list"] as const,

    /**
     * Key for quizzes by level ID
     */
    byLevel: (levelId: string, params?: AcceptanceExamsListParams) =>
        params
            ? ([...acceptanceExamKeys.all, "byLevel", levelId, params] as const)
            : ([...acceptanceExamKeys.all, "byLevel", levelId] as const),

    /**
     * Key for all detail queries
     */
    details: () => [...acceptanceExamKeys.all, "detail"] as const,

    /**
     * Key for specific level quiz detail
     */
    detail: (id: string) => [...acceptanceExamKeys.details(), id] as const,
};

/**
 * Type for level quiz query keys
 */
export type AcceptanceExamQueryKey =
    | typeof acceptanceExamKeys.all
    | ReturnType<typeof acceptanceExamKeys.metadata>
    | ReturnType<typeof acceptanceExamKeys.lists>
    | ReturnType<typeof acceptanceExamKeys.byLevel>
    | ReturnType<typeof acceptanceExamKeys.details>
    | ReturnType<typeof acceptanceExamKeys.detail>;
