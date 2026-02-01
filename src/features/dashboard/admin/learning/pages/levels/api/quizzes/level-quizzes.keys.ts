/**
 * Level Quizzes Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 *
 * @example
 * ```ts
 * // Invalidate all level quizzes data
 * queryClient.invalidateQueries({ queryKey: levelQuizKeys.all });
 *
 * // Invalidate only lists (keeps detail cache)
 * queryClient.invalidateQueries({ queryKey: levelQuizKeys.lists() });
 *
 * // Invalidate specific level quiz
 * queryClient.invalidateQueries({ queryKey: levelQuizKeys.detail(levelQuizId) });
 * ```
 */

import { LevelQuizzesListParams } from "../../types/level-quizzes.types";

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
export const levelQuizKeys = {
    /**
     * Root key for all level quiz queries
     */
    all: ["level-quizzes"] as const,

    /**
     * Key for metadata query
     */
    metadata: () => [...levelQuizKeys.all, "metadata"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...levelQuizKeys.all, "list"] as const,

    /**
     * Key for quizzes by level ID
     */
    byLevel: (levelId: string, params?: LevelQuizzesListParams) =>
        params
            ? ([...levelQuizKeys.all, "byLevel", levelId, params] as const)
            : ([...levelQuizKeys.all, "byLevel", levelId] as const),

    /**
     * Key for all detail queries
     */
    details: () => [...levelQuizKeys.all, "detail"] as const,

    /**
     * Key for specific level quiz detail
     */
    detail: (id: string) => [...levelQuizKeys.details(), id] as const,
};

/**
 * Type for level quiz query keys
 */
export type LevelQuizQueryKey =
    | typeof levelQuizKeys.all
    | ReturnType<typeof levelQuizKeys.metadata>
    | ReturnType<typeof levelQuizKeys.lists>
    | ReturnType<typeof levelQuizKeys.byLevel>
    | ReturnType<typeof levelQuizKeys.details>
    | ReturnType<typeof levelQuizKeys.detail>;
