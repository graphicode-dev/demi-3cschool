/**
 * Resource Folders Feature - Query Hooks
 *
 * TanStack Query hooks for fetching folder data.
 */

import { useQuery } from "@tanstack/react-query";
import { folderKeys } from "./folders.keys";
import { foldersApi } from "./folders.api";
import type { FoldersListParams } from "../../types";

/**
 * Hook to fetch list of folders
 */
export function useFoldersList(params?: FoldersListParams) {
    return useQuery({
        queryKey: folderKeys.list(params),
        queryFn: ({ signal }) => foldersApi.getList(params, signal),
    });
}

/**
 * Hook to fetch a single folder by ID
 */
export function useFolder(id: string, enabled = true) {
    return useQuery({
        queryKey: folderKeys.detail(id),
        queryFn: ({ signal }) => foldersApi.getById(id, signal),
        enabled: !!id && enabled,
    });
}
