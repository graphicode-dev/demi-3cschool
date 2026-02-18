/**
 * Acceptance Exams Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 *
 * @example
 * ```ts
 * // Invalidate all acceptance exams data
 * queryClient.invalidateQueries({ queryKey: acceptanceExamKeys.all });
 *
 * // Invalidate only lists (keeps detail cache)
 * queryClient.invalidateQueries({ queryKey: acceptanceExamKeys.lists() });
 *
 * // Invalidate specific acceptance exam
 * queryClient.invalidateQueries({ queryKey: acceptanceExamKeys.detail(acceptanceExamId) });
 * ```
 */

import { AcceptanceExamsListParams } from "../../../../types/acceptance-exams.types";

/**
 * Query key factory for acceptance exams
 *
 * Hierarchy:
 * - all: ['acceptance-exams']
 * - metadata: ['acceptance-exams', 'metadata']
 * - lists: ['acceptance-exams', 'list']
 * - list(params): ['acceptance-exams', 'list', params]
 * - details: ['acceptance-exams', 'detail']
 * - detail(id): ['acceptance-exams', 'detail', id]
 */
export const acceptanceExamKeys = {
    /**
     * Root key for all acceptance exam queries
     */
    all: ["acceptance-exams"] as const,

    /**
     * Key for metadata query
     */
    metadata: () => [...acceptanceExamKeys.all, "metadata"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...acceptanceExamKeys.all, "list"] as const,

    /**
     * Key for specific list with params
     */
    list: (params?: AcceptanceExamsListParams) =>
        params
            ? ([...acceptanceExamKeys.lists(), params] as const)
            : acceptanceExamKeys.lists(),

    /**
     * Key for all detail queries
     */
    details: () => [...acceptanceExamKeys.all, "detail"] as const,

    /**
     * Key for specific acceptance exam detail
     */
    detail: (id: string) => [...acceptanceExamKeys.details(), id] as const,
};

/**
 * Type for acceptance exam query keys
 */
export type AcceptanceExamQueryKey =
    | typeof acceptanceExamKeys.all
    | ReturnType<typeof acceptanceExamKeys.metadata>
    | ReturnType<typeof acceptanceExamKeys.lists>
    | ReturnType<typeof acceptanceExamKeys.list>
    | ReturnType<typeof acceptanceExamKeys.details>
    | ReturnType<typeof acceptanceExamKeys.detail>;
