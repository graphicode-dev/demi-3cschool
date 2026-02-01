/**
 * Lesson Quizzes Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 *
 * @example
 * ```ts
 * // Invalidate all lesson quizzes data
 * queryClient.invalidateQueries({ queryKey: lessonQuizKeys.all });
 *
 * // Invalidate only lists (keeps detail cache)
 * queryClient.invalidateQueries({ queryKey: lessonQuizKeys.lists() });
 *
 * // Invalidate specific lesson quiz
 * queryClient.invalidateQueries({ queryKey: lessonQuizKeys.detail(quizId) });
 * ```
 */

import { LessonQuizzesListParams } from "../../types";

/**
 * Query key factory for lesson quizzes
 *
 * Hierarchy:
 * - all: ['lesson-quizzes']
 * - metadata: ['lesson-quizzes', 'metadata']
 * - lists: ['lesson-quizzes', 'list']
 * - list(params): ['lesson-quizzes', 'list', params]
 * - infinite: ['lesson-quizzes', 'infinite']
 * - details: ['lesson-quizzes', 'detail']
 * - detail(id): ['lesson-quizzes', 'detail', id]
 */
export const lessonQuizKeys = {
    /**
     * Root key for all lesson quiz queries
     */
    all: ["lesson-quizzes"] as const,

    /**
     * Key for metadata query
     */
    metadata: () => [...lessonQuizKeys.all, "metadata"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...lessonQuizKeys.all, "list"] as const,

    /**
     * Key for specific list with params
     */
    list: (params?: LessonQuizzesListParams) =>
        params
            ? ([...lessonQuizKeys.lists(), params] as const)
            : lessonQuizKeys.lists(),

    /**
     * Key for infinite list queries
     */
    infinite: () => [...lessonQuizKeys.all, "infinite"] as const,

    /**
     * Key for quizzes by level ID
     */
    byLevel: (levelId: string) =>
        [...lessonQuizKeys.all, "byLevel", levelId] as const,

    /**
     * Key for all detail queries
     */
    details: () => [...lessonQuizKeys.all, "detail"] as const,

    /**
     * Key for specific lesson quiz detail
     */
    detail: (id: string) => [...lessonQuizKeys.details(), id] as const,
};

/**
 * Type for lesson quiz query keys
 */
export type LessonQuizQueryKey =
    | typeof lessonQuizKeys.all
    | ReturnType<typeof lessonQuizKeys.metadata>
    | ReturnType<typeof lessonQuizKeys.lists>
    | ReturnType<typeof lessonQuizKeys.list>
    | ReturnType<typeof lessonQuizKeys.infinite>
    | ReturnType<typeof lessonQuizKeys.details>
    | ReturnType<typeof lessonQuizKeys.detail>;
