/**
 * Levels Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 *
 * @example
 * ```ts
 * // Invalidate all levels data
 * queryClient.invalidateQueries({ queryKey: levelKeys.all });
 *
 * // Invalidate only lists (keeps detail cache)
 * queryClient.invalidateQueries({ queryKey: levelKeys.lists() });
 *
 * // Invalidate specific level
 * queryClient.invalidateQueries({ queryKey: levelKeys.detail(levelId) });
 * ```
 */

import type {
    LevelsListParams,
    LevelsByCourseParams,
} from "../types/levels.types";

/**
 * Query key factory for levels
 *
 * Hierarchy:
 * - all: ['levels']
 * - metadata: ['levels', 'metadata']
 * - lists: ['levels', 'list']
 * - list(params): ['levels', 'list', params]
 * - byCourse(params): ['levels', 'byCourse', courseId, params]
 * - details: ['levels', 'detail']
 * - detail(id): ['levels', 'detail', id]
 */
export const levelKeys = {
    /**
     * Root key for all level queries
     */
    all: ["levels"] as const,

    /**
     * Key for metadata query
     */
    metadata: () => [...levelKeys.all, "metadata"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...levelKeys.all, "list"] as const,

    /**
     * Key for specific list with params (includes type and programs_curriculum)
     */
    list: (params?: LevelsListParams) =>
        params ? ([...levelKeys.lists(), params] as const) : levelKeys.lists(),

    /**
     * Key for levels by course ID (includes type and programs_curriculum)
     */
    byCourse: (params: LevelsByCourseParams) =>
        [
            ...levelKeys.all,
            "byCourse",
            params.courseId,
            {
                page: params.page,
                type: params.type,
                programs_curriculum: params.programs_curriculum,
            },
        ] as const,

    /**
     * Key for all byCourse queries of a specific course
     */
    byCourseId: (courseId: string) =>
        [...levelKeys.all, "byCourse", courseId] as const,

    /**
     * Key for infinite list queries
     */
    infinite: (params?: Omit<LevelsListParams, "page">) =>
        params
            ? ([...levelKeys.all, "infinite", params] as const)
            : ([...levelKeys.all, "infinite"] as const),

    /**
     * Key for infinite list by course
     */
    infiniteByCourse: (courseId: string) =>
        [...levelKeys.all, "infinite", "byCourse", courseId] as const,

    /**
     * Key for levels by grade ID
     */
    byGrade: (gradeId: string | number) =>
        [...levelKeys.all, "byGrade", gradeId] as const,

    /**
     * Key for all detail queries
     */
    details: () => [...levelKeys.all, "detail"] as const,

    /**
     * Key for specific level detail
     */
    detail: (id: string) => [...levelKeys.details(), id] as const,
};

/**
 * Type for level query keys
 */
export type LevelQueryKey =
    | typeof levelKeys.all
    | ReturnType<typeof levelKeys.metadata>
    | ReturnType<typeof levelKeys.lists>
    | ReturnType<typeof levelKeys.list>
    | ReturnType<typeof levelKeys.byCourse>
    | ReturnType<typeof levelKeys.byCourseId>
    | ReturnType<typeof levelKeys.infinite>
    | ReturnType<typeof levelKeys.infiniteByCourse>
    | ReturnType<typeof levelKeys.byGrade>
    | ReturnType<typeof levelKeys.details>
    | ReturnType<typeof levelKeys.detail>;
