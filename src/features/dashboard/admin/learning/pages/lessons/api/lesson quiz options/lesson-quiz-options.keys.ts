/**
 * Lesson Quiz Options Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 *
 * @example
 * ```ts
 * // Invalidate all lesson quiz options data
 * queryClient.invalidateQueries({ queryKey: lessonQuizOptionKeys.all });
 *
 * // Invalidate only lists (keeps detail cache)
 * queryClient.invalidateQueries({ queryKey: lessonQuizOptionKeys.lists() });
 *
 * // Invalidate specific lesson quiz option
 * queryClient.invalidateQueries({ queryKey: lessonQuizOptionKeys.detail(optionId) });
 * ```
 */

import { LessonQuizOptionsListParams } from "../../types";


/**
 * Query key factory for lesson quiz options
 *
 * Hierarchy:
 * - all: ['lesson-quiz-options']
 * - metadata: ['lesson-quiz-options', 'metadata']
 * - lists: ['lesson-quiz-options', 'list']
 * - list(params): ['lesson-quiz-options', 'list', params]
 * - infinite: ['lesson-quiz-options', 'infinite']
 * - details: ['lesson-quiz-options', 'detail']
 * - detail(id): ['lesson-quiz-options', 'detail', id]
 */
export const lessonQuizOptionKeys = {
    /**
     * Root key for all lesson quiz option queries
     */
    all: ["lesson-quiz-options"] as const,

    /**
     * Key for metadata query
     */
    metadata: () => [...lessonQuizOptionKeys.all, "metadata"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...lessonQuizOptionKeys.all, "list"] as const,

    /**
     * Key for specific list with params
     */
    list: (params?: LessonQuizOptionsListParams) =>
        params
            ? ([...lessonQuizOptionKeys.lists(), params] as const)
            : lessonQuizOptionKeys.lists(),

    /**
     * Key for infinite list queries
     */
    infinite: (params?: Omit<LessonQuizOptionsListParams, "page">) =>
        params
            ? ([...lessonQuizOptionKeys.all, "infinite", params] as const)
            : ([...lessonQuizOptionKeys.all, "infinite"] as const),

    /**
     * Key for all detail queries
     */
    details: () => [...lessonQuizOptionKeys.all, "detail"] as const,

    /**
     * Key for specific lesson quiz option detail
     */
    detail: (id: string) => [...lessonQuizOptionKeys.details(), id] as const,
};

/**
 * Type for lesson quiz option query keys
 */
export type LessonQuizOptionQueryKey =
    | typeof lessonQuizOptionKeys.all
    | ReturnType<typeof lessonQuizOptionKeys.metadata>
    | ReturnType<typeof lessonQuizOptionKeys.lists>
    | ReturnType<typeof lessonQuizOptionKeys.list>
    | ReturnType<typeof lessonQuizOptionKeys.infinite>
    | ReturnType<typeof lessonQuizOptionKeys.details>
    | ReturnType<typeof lessonQuizOptionKeys.detail>;
