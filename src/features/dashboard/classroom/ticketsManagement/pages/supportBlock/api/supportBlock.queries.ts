/**
 * Support Block Feature - Query Hooks
 *
 * TanStack Query hooks for reading support block data.
 *
 * TODO: Remove mock data imports and uncomment real API calls when backend is ready.
 */

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { supportBlockKeys } from "./supportBlock.keys";
import {
    getMockTeamStats,
    getMockBlocks,
    getMockSupportBlockData,
    getMockBlock,
} from "../mockData";
import type { TeamStats, Block, SupportBlockData } from "../types";

// ============================================================================
// Stats Query
// ============================================================================

/**
 * Hook to fetch support block statistics
 */
export function useTeamStats(
    options?: Partial<UseQueryOptions<TeamStats, Error>>
) {
    return useQuery({
        queryKey: supportBlockKeys.stats(),
        // TODO: Uncomment when using real API
        // queryFn: ({ signal }) => supportBlockApi.getStats(signal),
        queryFn: () => Promise.resolve(getMockTeamStats()),
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    });
}

// ============================================================================
// Blocks Query
// ============================================================================

/**
 * Hook to fetch all blocks
 */
export function useBlocks(options?: Partial<UseQueryOptions<Block[], Error>>) {
    return useQuery({
        queryKey: supportBlockKeys.blocks(),
        // TODO: Uncomment when using real API
        // queryFn: ({ signal }) => supportBlockApi.getBlocks(signal),
        queryFn: () => Promise.resolve(getMockBlocks()),
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    });
}

// ============================================================================
// Single Block Query
// ============================================================================

/**
 * Hook to fetch single block by ID
 */
export function useBlock(
    id: string | undefined | null,
    options?: Partial<UseQueryOptions<Block | undefined, Error>>
) {
    return useQuery({
        queryKey: supportBlockKeys.block(id ?? ""),
        // TODO: Uncomment when using real API
        // queryFn: ({ signal }) => supportBlockApi.getBlock(id!, signal),
        queryFn: () => Promise.resolve(getMockBlock(id!)),
        enabled: !!id,
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    });
}

// ============================================================================
// Complete Support Block Data Query
// ============================================================================

/**
 * Hook to fetch complete support block data
 */
export function useSupportBlockData(
    options?: Partial<UseQueryOptions<SupportBlockData, Error>>
) {
    return useQuery({
        queryKey: supportBlockKeys.data(),
        // TODO: Uncomment when using real API
        // queryFn: ({ signal }) => supportBlockApi.getData(signal),
        queryFn: () => Promise.resolve(getMockSupportBlockData()),
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    });
}
