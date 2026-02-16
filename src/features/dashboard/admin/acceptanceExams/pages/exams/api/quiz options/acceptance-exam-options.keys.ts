/**
 * Level Quiz Options Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 *
 * @example
 * ```ts
 * // Invalidate all level quiz options data
 * queryClient.invalidateQueries({ queryKey: acceptanceExamOptionKeys.all });
 *
 * // Invalidate only lists (keeps detail cache)
 * queryClient.invalidateQueries({ queryKey: acceptanceExamOptionKeys.lists() });
 *
 * // Invalidate specific level quiz option
 * queryClient.invalidateQueries({ queryKey: acceptanceExamOptionKeys.detail(optionId) });
 * ```
 */

import type { AcceptanceExamOptionsListParams } from "../../../../types/acceptance-exam-options.types";

/**
 * Query key factory for level quiz options
 *
 * Hierarchy:
 * - all: ['level-quiz-options']
 * - metadata: ['level-quiz-options', 'metadata']
 * - lists: ['level-quiz-options', 'list']
 * - list(params): ['level-quiz-options', 'list', params]
 * - details: ['level-quiz-options', 'detail']
 * - detail(id): ['level-quiz-options', 'detail', id]
 */
export const acceptanceExamOptionKeys = {
    /**
     * Root key for all level quiz option queries
     */
    all: ["level-quiz-options"] as const,

    /**
     * Key for metadata query
     */
    metadata: () => [...acceptanceExamOptionKeys.all, "metadata"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...acceptanceExamOptionKeys.all, "list"] as const,

    /**
     * Key for all list queries by question ID
     */
    byQuestion: (questionId: string, params?: AcceptanceExamOptionsListParams) =>
        params
            ? ([
                  ...acceptanceExamOptionKeys.all,
                  "by-question",
                  questionId,
                  params,
              ] as const)
            : ([
                  ...acceptanceExamOptionKeys.all,
                  "by-question",
                  questionId,
              ] as const),

    /**
     * Key for specific list with params
     */
    list: (params?: AcceptanceExamOptionsListParams) =>
        params
            ? ([...acceptanceExamOptionKeys.lists(), params] as const)
            : acceptanceExamOptionKeys.lists(),

    /**
     * Key for infinite list queries
     */
    infinite: (params?: Omit<AcceptanceExamOptionsListParams, "page">) =>
        params
            ? ([...acceptanceExamOptionKeys.all, "infinite", params] as const)
            : ([...acceptanceExamOptionKeys.all, "infinite"] as const),

    /**
     * Key for all detail queries
     */
    details: () => [...acceptanceExamOptionKeys.all, "detail"] as const,

    /**
     * Key for specific level quiz option detail
     */
    detail: (id: string) => [...acceptanceExamOptionKeys.details(), id] as const,
};

/**
 * Type for level quiz option query keys
 */
export type AcceptanceExamOptionQueryKey =
    | typeof acceptanceExamOptionKeys.all
    | ReturnType<typeof acceptanceExamOptionKeys.metadata>
    | ReturnType<typeof acceptanceExamOptionKeys.lists>
    | ReturnType<typeof acceptanceExamOptionKeys.byQuestion>
    | ReturnType<typeof acceptanceExamOptionKeys.list>
    | ReturnType<typeof acceptanceExamOptionKeys.infinite>
    | ReturnType<typeof acceptanceExamOptionKeys.details>
    | ReturnType<typeof acceptanceExamOptionKeys.detail>;
