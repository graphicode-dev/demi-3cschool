/**
 * Level Quiz Options Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 *
 * @example
 * ```ts
 * // Invalidate all level quiz options data
 * queryClient.invalidateQueries({ queryKey: levelQuizOptionKeys.all });
 *
 * // Invalidate only lists (keeps detail cache)
 * queryClient.invalidateQueries({ queryKey: levelQuizOptionKeys.lists() });
 *
 * // Invalidate specific level quiz option
 * queryClient.invalidateQueries({ queryKey: levelQuizOptionKeys.detail(optionId) });
 * ```
 */

import type { LevelQuizOptionsListParams } from "../../types/level-quiz-options.types";

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
export const levelQuizOptionKeys = {
    /**
     * Root key for all level quiz option queries
     */
    all: ["level-quiz-options"] as const,

    /**
     * Key for metadata query
     */
    metadata: () => [...levelQuizOptionKeys.all, "metadata"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...levelQuizOptionKeys.all, "list"] as const,

    /**
     * Key for specific list with params
     */
    list: (params?: LevelQuizOptionsListParams) =>
        params
            ? ([...levelQuizOptionKeys.lists(), params] as const)
            : levelQuizOptionKeys.lists(),

    /**
     * Key for infinite list queries
     */
    infinite: (params?: Omit<LevelQuizOptionsListParams, "page">) =>
        params
            ? ([...levelQuizOptionKeys.all, "infinite", params] as const)
            : ([...levelQuizOptionKeys.all, "infinite"] as const),

    /**
     * Key for all detail queries
     */
    details: () => [...levelQuizOptionKeys.all, "detail"] as const,

    /**
     * Key for specific level quiz option detail
     */
    detail: (id: string) => [...levelQuizOptionKeys.details(), id] as const,

    /**
     * Key for options by question ID
     */
    byQuestion: (questionId: string, params?: LevelQuizOptionsListParams) =>
        params
            ? ([
                  ...levelQuizOptionKeys.all,
                  "by-question",
                  questionId,
                  params,
              ] as const)
            : ([
                  ...levelQuizOptionKeys.all,
                  "by-question",
                  questionId,
              ] as const),
};

/**
 * Type for level quiz option query keys
 */
export type LevelQuizOptionQueryKey =
    | typeof levelQuizOptionKeys.all
    | ReturnType<typeof levelQuizOptionKeys.metadata>
    | ReturnType<typeof levelQuizOptionKeys.lists>
    | ReturnType<typeof levelQuizOptionKeys.list>
    | ReturnType<typeof levelQuizOptionKeys.infinite>
    | ReturnType<typeof levelQuizOptionKeys.details>
    | ReturnType<typeof levelQuizOptionKeys.detail>
    | ReturnType<typeof levelQuizOptionKeys.byQuestion>;
