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
 * // Invalidate quizzes by level
 * queryClient.invalidateQueries({ queryKey: levelQuizKeys.byLevel(levelId) });
 *
 * // Invalidate specific level quiz
 * queryClient.invalidateQueries({ queryKey: levelQuizKeys.detail(levelQuizId) });
 * ```
 */

import { ListQueryParams } from "@/shared/api";

/**
 * Query key factory for level quizzes
 *
 * Hierarchy:
 * - all: ['level-quizzes']
 * - metadata: ['level-quizzes', 'metadata']
 * - byLevelRoot: ['level-quizzes', 'by-level']
 * - byLevel(levelId, params): ['level-quizzes', 'by-level', levelId, params]
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
     * Key for all by-level queries
     */
    byLevelRoot: () => [...levelQuizKeys.all, "by-level"] as const,

    /**
     * Key for quizzes by level ID with optional params
     */
    byLevel: (levelId: string, params?: ListQueryParams) =>
        params
            ? ([...levelQuizKeys.byLevelRoot(), levelId, params] as const)
            : ([...levelQuizKeys.byLevelRoot(), levelId] as const),

    /**
     * Key for infinite list queries by level
     */
    infiniteByLevel: (levelId: string) =>
        [...levelQuizKeys.all, "infinite", levelId] as const,

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
    | ReturnType<typeof levelQuizKeys.byLevelRoot>
    | ReturnType<typeof levelQuizKeys.byLevel>
    | ReturnType<typeof levelQuizKeys.infiniteByLevel>
    | ReturnType<typeof levelQuizKeys.details>
    | ReturnType<typeof levelQuizKeys.detail>;
