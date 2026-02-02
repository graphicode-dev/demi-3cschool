/**
 * Resources Feature - Query Hooks
 *
 * TanStack Query hooks for fetching resource data.
 */

import { useQuery } from "@tanstack/react-query";
import { resourceKeys } from "./resources.keys";
import { resourcesApi } from "./resources.api";
import type { ResourcesListParams } from "../../types";

/**
 * Hook to fetch list of resources by folder
 */
export function useResourcesList(params: ResourcesListParams, enabled = true) {
    return useQuery({
        queryKey: resourceKeys.list(params),
        queryFn: ({ signal }) => resourcesApi.getList(params, signal),
        enabled: !!params.folderId && enabled,
    });
}

/**
 * Hook to fetch a single resource by ID
 */
export function useResource(id: string, enabled = true) {
    return useQuery({
        queryKey: resourceKeys.detail(id),
        queryFn: ({ signal }) => resourcesApi.getById(id, signal),
        enabled: !!id && enabled,
    });
}
