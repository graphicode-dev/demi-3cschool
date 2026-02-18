/**
 * Users Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 *
 * @example
 * ```ts
 * // Invalidate all users data
 * queryClient.invalidateQueries({ queryKey: userKeys.all });
 *
 * // Invalidate only lists (keeps detail cache)
 * queryClient.invalidateQueries({ queryKey: userKeys.lists() });
 *
 * // Invalidate specific user
 * queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
 * ```
 */

import type { ListQueryParams } from "@/shared/api";

/**
 * Query key factory for users
 *
 * Hierarchy:
 * - all: ['users']
 * - lists: ['users', 'list']
 * - list(params): ['users', 'list', params]
 * - details: ['users', 'detail']
 * - detail(id): ['users', 'detail', id]
 */
export const userKeys = {
    /**
     * Root key for all user queries
     */
    all: ["users"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...userKeys.all, "list"] as const,

    /**
     * Key for specific list with params
     */
    list: (params?: ListQueryParams) =>
        params ? ([...userKeys.lists(), params] as const) : userKeys.lists(),

    /**
     * Key for all detail queries
     */
    details: () => [...userKeys.all, "detail"] as const,

    /**
     * Key for specific user detail
     */
    detail: (id: number) => [...userKeys.details(), id] as const,
};
