/**
 * Support Block Feature - Query Hooks
 *
 * TanStack Query hooks for reading and mutating support block data.
 */

import {
    useQuery,
    useMutation,
    useQueryClient,
    type UseQueryOptions,
} from "@tanstack/react-query";
import { supportBlockKeys } from "./supportBlock.keys";
import { supportBlockApi } from "./supportBlock.api";
import type {
    SupportBlock,
    SupportBlocksListResponse,
    CreateSupportBlockPayload,
    UpdateSupportBlockPayload,
} from "../types";

// ============================================================================
// List Query
// ============================================================================

/**
 * Hook to fetch paginated support blocks list
 */
export function useSupportBlocks(
    page: number = 1,
    options?: Partial<UseQueryOptions<SupportBlocksListResponse, Error>>
) {
    return useQuery({
        queryKey: supportBlockKeys.list(page),
        queryFn: ({ signal }) => supportBlockApi.getList(page, signal),
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    });
}

// ============================================================================
// Detail Query
// ============================================================================

/**
 * Hook to fetch single support block by ID
 */
export function useSupportBlock(
    id: number | string | undefined | null,
    options?: Partial<UseQueryOptions<SupportBlock, Error>>
) {
    return useQuery({
        queryKey: supportBlockKeys.detail(id ?? ""),
        queryFn: ({ signal }) => supportBlockApi.getById(id!, signal),
        enabled: !!id,
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    });
}
