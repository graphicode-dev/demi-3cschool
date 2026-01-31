/**
 * Lesson Videos Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 *
 * @example
 * ```ts
 * // Invalidate all lesson videos data
 * queryClient.invalidateQueries({ queryKey: lessonVideoKeys.all });
 *
 * // Invalidate only lists (keeps detail cache)
 * queryClient.invalidateQueries({ queryKey: lessonVideoKeys.lists() });
 *
 * // Invalidate specific lesson video
 * queryClient.invalidateQueries({ queryKey: lessonVideoKeys.detail(videoId) });
 * ```
 */

/**
 * Query key factory for lesson videos
 *
 * Hierarchy:
 * - all: ['lesson-videos']
 * - lists: ['lesson-videos', 'list']
 * - details: ['lesson-videos', 'detail']
 * - detail(id): ['lesson-videos', 'detail', id]
 */
export const lessonVideoKeys = {
    /**
     * Root key for all lesson video queries
     */
    all: ["lesson-videos"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...lessonVideoKeys.all, "list"] as const,

    /**
     * Key for all detail queries
     */
    details: () => [...lessonVideoKeys.all, "detail"] as const,

    /**
     * Key for specific lesson video detail
     */
    detail: (id: string) => [...lessonVideoKeys.details(), id] as const,
};

/**
 * Type for lesson video query keys
 */
export type LessonVideoQueryKey =
    | typeof lessonVideoKeys.all
    | ReturnType<typeof lessonVideoKeys.lists>
    | ReturnType<typeof lessonVideoKeys.details>
    | ReturnType<typeof lessonVideoKeys.detail>;
