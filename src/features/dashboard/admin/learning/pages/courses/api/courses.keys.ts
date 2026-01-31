/**
 * Courses Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 *
 * @example
 * ```ts
 * // Invalidate all courses data
 * queryClient.invalidateQueries({ queryKey: courseKeys.all });
 *
 * // Invalidate only lists (keeps detail cache)
 * queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
 *
 * // Invalidate specific course
 * queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
 * ```
 */

import type {
    CoursesListParams,
    CoursesByProgramParams,
    ProgramType,
} from "../types/courses.types";

/**
 * Query key factory for courses
 *
 * Hierarchy:
 * - all: ['courses']
 * - metadata: ['courses', 'metadata']
 * - lists: ['courses', 'list']
 * - list(params): ['courses', 'list', params]
 * - byProgram(params): ['courses', 'byProgram', programType, params]
 * - details: ['courses', 'detail']
 * - detail(id): ['courses', 'detail', id]
 */
export const courseKeys = {
    /**
     * Root key for all course queries
     */
    all: ["courses"] as const,

    /**
     * Key for metadata query
     */
    metadata: () => [...courseKeys.all, "metadata"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...courseKeys.all, "list"] as const,

    /**
     * Key for specific list with params
     */
    list: (params?: CoursesListParams) =>
        params
            ? ([...courseKeys.lists(), params] as const)
            : courseKeys.lists(),

    /**
     * Key for courses by program type
     */
    byProgram: (params: CoursesByProgramParams) =>
        [
            ...courseKeys.all,
            "byProgram",
            params.programType,
            { page: params.page },
        ] as const,

    /**
     * Key for all byProgram queries of a specific type
     */
    byProgramType: (programType: ProgramType) =>
        [...courseKeys.all, "byProgram", programType] as const,

    /**
     * Key for infinite list queries
     */
    infinite: (params?: Omit<CoursesListParams, "page">) =>
        params
            ? ([...courseKeys.all, "infinite", params] as const)
            : ([...courseKeys.all, "infinite"] as const),

    /**
     * Key for infinite list by program type
     */
    infiniteByProgram: (programType: ProgramType) =>
        [...courseKeys.all, "infinite", "byProgram", programType] as const,

    /**
     * Key for all detail queries
     */
    details: () => [...courseKeys.all, "detail"] as const,

    /**
     * Key for specific course detail
     */
    detail: (id: string) => [...courseKeys.details(), id] as const,
};

/**
 * Type for course query keys
 */
export type CourseQueryKey =
    | typeof courseKeys.all
    | ReturnType<typeof courseKeys.metadata>
    | ReturnType<typeof courseKeys.lists>
    | ReturnType<typeof courseKeys.list>
    | ReturnType<typeof courseKeys.byProgram>
    | ReturnType<typeof courseKeys.byProgramType>
    | ReturnType<typeof courseKeys.infinite>
    | ReturnType<typeof courseKeys.infiniteByProgram>
    | ReturnType<typeof courseKeys.details>
    | ReturnType<typeof courseKeys.detail>;
