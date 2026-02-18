/**
 * Roles Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 *
 * @example
 * ```ts
 * // Invalidate all roles data
 * queryClient.invalidateQueries({ queryKey: roleKeys.all });
 *
 * // Invalidate only lists (keeps detail cache)
 * queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
 *
 * // Invalidate specific role
 * queryClient.invalidateQueries({ queryKey: roleKeys.detail(roleId) });
 * ```
 */

import type { ListQueryParams } from "@/shared/api";

/**
 * Query key factory for roles
 *
 * Hierarchy:
 * - all: ['roles']
 * - lists: ['roles', 'list']
 * - list(params): ['roles', 'list', params]
 * - details: ['roles', 'detail']
 * - detail(id): ['roles', 'detail', id]
 * - metadata: ['roles', 'metadata']
 */
export const roleKeys = {
    /**
     * Root key for all role queries
     */
    all: ["roles"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...roleKeys.all, "list"] as const,

    /**
     * Key for specific list with params
     */
    list: (params?: ListQueryParams) =>
        params ? ([...roleKeys.lists(), params] as const) : roleKeys.lists(),

    /**
     * Key for all detail queries
     */
    details: () => [...roleKeys.all, "detail"] as const,

    /**
     * Key for specific role detail
     */
    detail: (id: number) => [...roleKeys.details(), id] as const,

    /**
     * Key for roles metadata
     */
    metadata: () => [...roleKeys.all, "metadata"] as const,
};

/**
 * Type for role query keys
 */
export type RoleQueryKey =
    | typeof roleKeys.all
    | ReturnType<typeof roleKeys.lists>
    | ReturnType<typeof roleKeys.list>
    | ReturnType<typeof roleKeys.details>
    | ReturnType<typeof roleKeys.detail>
    | ReturnType<typeof roleKeys.metadata>;
