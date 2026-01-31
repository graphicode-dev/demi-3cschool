/**
 * Lessons Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 *
 * @example
 * ```ts
 * // Invalidate all lessons data
 * queryClient.invalidateQueries({ queryKey: lessonKeys.all });
 *
 * // Invalidate only lists (keeps detail cache)
 * queryClient.invalidateQueries({ queryKey: lessonKeys.lists() });
 *
 * // Invalidate specific lesson
 * queryClient.invalidateQueries({ queryKey: lessonKeys.detail(lessonId) });
 * ```
 */

import type {
    LessonsListParams,
    LessonsByLevelParams,
} from "../types/lessons.types";

/**
 * Query key factory for lessons
 *
 * Hierarchy:
 * - all: ['lessons']
 * - metadata: ['lessons', 'metadata']
 * - lists: ['lessons', 'list']
 * - list(params): ['lessons', 'list', params]
 * - byLevel(params): ['lessons', 'byLevel', levelId, params]
 * - details: ['lessons', 'detail']
 * - detail(id): ['lessons', 'detail', id]
 */
export const lessonKeys = {
    /**
     * Root key for all lesson queries
     */
    all: ["lessons"] as const,

    /**
     * Key for metadata query
     */
    metadata: () => [...lessonKeys.all, "metadata"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...lessonKeys.all, "list"] as const,

    /**
     * Key for specific list with params (includes type and programs_curriculum)
     */
    list: (params?: LessonsListParams) =>
        params
            ? ([...lessonKeys.lists(), params] as const)
            : lessonKeys.lists(),

    /**
     * Key for lessons by level ID (includes type and programs_curriculum)
     */
    byLevel: (params: LessonsByLevelParams) =>
        [
            ...lessonKeys.all,
            "byLevel",
            params.levelId,
            {
                page: params.page,
                type: params.type,
                programs_curriculum: params.programs_curriculum,
            },
        ] as const,

    /**
     * Key for all byLevel queries of a specific level
     */
    byLevelId: (levelId: string) =>
        [...lessonKeys.all, "byLevel", levelId] as const,

    /**
     * Key for infinite list queries
     */
    infinite: (params?: Omit<LessonsListParams, "page">) =>
        params
            ? ([...lessonKeys.all, "infinite", params] as const)
            : ([...lessonKeys.all, "infinite"] as const),

    /**
     * Key for infinite list by level
     */
    infiniteByLevel: (levelId: string) =>
        [...lessonKeys.all, "infinite", "byLevel", levelId] as const,

    /**
     * Key for all detail queries
     */
    details: () => [...lessonKeys.all, "detail"] as const,

    /**
     * Key for specific lesson detail
     */
    detail: (id: string) => [...lessonKeys.details(), id] as const,
};

/**
 * Type for lesson query keys
 */
export type LessonQueryKey =
    | typeof lessonKeys.all
    | ReturnType<typeof lessonKeys.metadata>
    | ReturnType<typeof lessonKeys.lists>
    | ReturnType<typeof lessonKeys.list>
    | ReturnType<typeof lessonKeys.byLevel>
    | ReturnType<typeof lessonKeys.byLevelId>
    | ReturnType<typeof lessonKeys.infinite>
    | ReturnType<typeof lessonKeys.infiniteByLevel>
    | ReturnType<typeof lessonKeys.details>
    | ReturnType<typeof lessonKeys.detail>;
