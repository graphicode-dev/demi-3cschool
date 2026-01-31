/**
 * Team Structure Feature - Query Hooks
 *
 * TanStack Query hooks for reading team structure data.
 *
 * TODO: Remove mock data imports and uncomment real API calls when backend is ready.
 */

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { teamStructureKeys } from "./teamStructure.keys";
import {
    getMockTeamStats,
    getMockBlocks,
    getMockTeamStructureData,
    getMockBlock,
} from "../mockData";
import type { TeamStats, Block, TeamStructureData } from "../types";

// ============================================================================
// Stats Query
// ============================================================================

/**
 * Hook to fetch team structure statistics
 */
export function useTeamStats(
    options?: Partial<UseQueryOptions<TeamStats, Error>>
) {
    return useQuery({
        queryKey: teamStructureKeys.stats(),
        // TODO: Uncomment when using real API
        // queryFn: ({ signal }) => teamStructureApi.getStats(signal),
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
        queryKey: teamStructureKeys.blocks(),
        // TODO: Uncomment when using real API
        // queryFn: ({ signal }) => teamStructureApi.getBlocks(signal),
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
        queryKey: teamStructureKeys.block(id ?? ""),
        // TODO: Uncomment when using real API
        // queryFn: ({ signal }) => teamStructureApi.getBlock(id!, signal),
        queryFn: () => Promise.resolve(getMockBlock(id!)),
        enabled: !!id,
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    });
}

// ============================================================================
// Complete Team Structure Data Query
// ============================================================================

/**
 * Hook to fetch complete team structure data
 */
export function useTeamStructureData(
    options?: Partial<UseQueryOptions<TeamStructureData, Error>>
) {
    return useQuery({
        queryKey: teamStructureKeys.data(),
        // TODO: Uncomment when using real API
        // queryFn: ({ signal }) => teamStructureApi.getData(signal),
        queryFn: () => Promise.resolve(getMockTeamStructureData()),
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    });
}
