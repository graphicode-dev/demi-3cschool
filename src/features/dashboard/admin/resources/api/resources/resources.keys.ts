/**
 * Resources Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 */

import type { ResourcesListParams } from "../../types";

/**
 * Query key factory for resources
 */
export const resourceKeys = {
    /**
     * Root key for all resource queries
     */
    all: ["resources"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...resourceKeys.all, "list"] as const,

    /**
     * Key for specific list with params
     */
    list: (params: ResourcesListParams) =>
        [...resourceKeys.lists(), params] as const,

    /**
     * Key for resources by folder ID
     */
    byFolder: (folderId: string | number) =>
        [...resourceKeys.all, "byFolder", folderId] as const,

    /**
     * Key for all detail queries
     */
    details: () => [...resourceKeys.all, "detail"] as const,

    /**
     * Key for specific resource detail
     */
    detail: (id: string | number) => [...resourceKeys.details(), id] as const,
};

/**
 * Type for resource query keys
 */
export type ResourceQueryKey =
    | typeof resourceKeys.all
    | ReturnType<typeof resourceKeys.lists>
    | ReturnType<typeof resourceKeys.list>
    | ReturnType<typeof resourceKeys.byFolder>
    | ReturnType<typeof resourceKeys.details>
    | ReturnType<typeof resourceKeys.detail>;
