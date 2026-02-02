/**
 * Resource Folders Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 */

import type { FoldersListParams } from "../../types";

/**
 * Query key factory for resource folders
 */
export const folderKeys = {
    /**
     * Root key for all folder queries
     */
    all: ["resource-folders"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...folderKeys.all, "list"] as const,

    /**
     * Key for specific list with params
     */
    list: (params?: FoldersListParams) =>
        params
            ? ([...folderKeys.lists(), params] as const)
            : folderKeys.lists(),

    /**
     * Key for all detail queries
     */
    details: () => [...folderKeys.all, "detail"] as const,

    /**
     * Key for specific folder detail
     */
    detail: (id: string) => [...folderKeys.details(), id] as const,
};

/**
 * Type for folder query keys
 */
export type FolderQueryKey =
    | typeof folderKeys.all
    | ReturnType<typeof folderKeys.lists>
    | ReturnType<typeof folderKeys.list>
    | ReturnType<typeof folderKeys.details>
    | ReturnType<typeof folderKeys.detail>;
