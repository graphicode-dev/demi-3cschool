/**
 * Staff Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 *
 * @example
 * ```ts
 * // Invalidate all staff data
 * queryClient.invalidateQueries({ queryKey: staffKeys.all });
 *
 * // Invalidate only lists (keeps detail cache)
 * queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
 *
 * // Invalidate specific staff member
 * queryClient.invalidateQueries({ queryKey: staffKeys.detail(staffId) });
 * ```
 */

import type { ListQueryParams } from "@/shared/api";

/**
 * Query key factory for staff
 *
 * Hierarchy:
 * - all: ['staff']
 * - lists: ['staff', 'list']
 * - list(params): ['staff', 'list', params]
 * - details: ['staff', 'detail']
 * - detail(id): ['staff', 'detail', id]
 * - metadata: ['staff', 'metadata']
 */
export const staffKeys = {
    /**
     * Root key for all staff queries
     */
    all: ["staff"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...staffKeys.all, "list"] as const,

    /**
     * Key for specific list with params
     */
    list: (params?: ListQueryParams) =>
        params ? ([...staffKeys.lists(), params] as const) : staffKeys.lists(),

    /**
     * Key for all detail queries
     */
    details: () => [...staffKeys.all, "detail"] as const,

    /**
     * Key for specific staff detail
     */
    detail: (id: number) => [...staffKeys.details(), id] as const,

    /**
     * Key for staff metadata
     */
    metadata: () => [...staffKeys.all, "metadata"] as const,
};
