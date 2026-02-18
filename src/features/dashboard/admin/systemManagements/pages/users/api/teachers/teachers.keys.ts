/**
 * Teachers Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 *
 * @example
 * ```ts
 * // Invalidate all teachers data
 * queryClient.invalidateQueries({ queryKey: teacherKeys.all });
 *
 * // Invalidate only lists (keeps detail cache)
 * queryClient.invalidateQueries({ queryKey: teacherKeys.lists() });
 *
 * // Invalidate specific teacher
 * queryClient.invalidateQueries({ queryKey: teacherKeys.detail(teacherId) });
 * ```
 */

import type { ListQueryParams } from "@/shared/api";

/**
 * Query key factory for teachers
 *
 * Hierarchy:
 * - all: ['teachers']
 * - lists: ['teachers', 'list']
 * - list(params): ['teachers', 'list', params]
 * - details: ['teachers', 'detail']
 * - detail(id): ['teachers', 'detail', id]
 * - metadata: ['teachers', 'metadata']
 */
export const teacherKeys = {
    /**
     * Root key for all teacher queries
     */
    all: ["teachers"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...teacherKeys.all, "list"] as const,

    /**
     * Key for specific list with params
     */
    list: (params?: ListQueryParams) =>
        params ? ([...teacherKeys.lists(), params] as const) : teacherKeys.lists(),

    /**
     * Key for all detail queries
     */
    details: () => [...teacherKeys.all, "detail"] as const,

    /**
     * Key for specific teacher detail
     */
    detail: (id: number) => [...teacherKeys.details(), id] as const,

    /**
     * Key for teachers metadata
     */
    metadata: () => [...teacherKeys.all, "metadata"] as const,
};
