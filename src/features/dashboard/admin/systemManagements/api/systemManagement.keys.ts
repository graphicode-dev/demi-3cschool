/**
 * System Managements Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 *
 * @example
 * ```ts
 * // Invalidate all students data
 * queryClient.invalidateQueries({ queryKey: studentKeys.all });
 *
 * // Invalidate only lists (keeps detail cache)
 * queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
 *
 * // Invalidate specific student
 * queryClient.invalidateQueries({ queryKey: studentKeys.detail(studentId) });
 * ```
 */

import type { StudentListParams } from "../types";

/**
 * Query key factory for students
 *
 * Hierarchy:
 * - all: ['students']
 * - lists: ['students', 'list']
 * - list(params): ['students', 'list', params]
 * - details: ['students', 'detail']
 * - detail(id): ['students', 'detail', id]
 */
export const studentKeys = {
    /**
     * Root key for all student queries
     */
    all: ["students"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...studentKeys.all, "list"] as const,

    /**
     * Key for specific list with params
     */
    list: (params?: StudentListParams) =>
        params
            ? ([...studentKeys.lists(), params] as const)
            : studentKeys.lists(),

    /**
     * Key for all detail queries
     */
    details: () => [...studentKeys.all, "detail"] as const,

    /**
     * Key for specific student detail
     */
    detail: (id: number) => [...studentKeys.details(), id] as const,
};

/**
 * Type for student query keys
 */
export type StudentQueryKey =
    | typeof studentKeys.all
    | ReturnType<typeof studentKeys.lists>
    | ReturnType<typeof studentKeys.list>
    | ReturnType<typeof studentKeys.details>
    | ReturnType<typeof studentKeys.detail>;
