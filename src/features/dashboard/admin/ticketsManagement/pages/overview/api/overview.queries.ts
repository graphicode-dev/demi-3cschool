/**
 * Overview Feature - Query Hooks
 *
 * TanStack Query hooks for reading overview data.
 * All queries support AbortSignal for cancellation.
 *
 * TODO: Remove mock data imports and uncomment real API calls when backend is ready.
 *
 * @example
 * ```tsx
 * // Get overview stats
 * const { data: stats } = useOverviewStats();
 *
 * // Get complete overview data
 * const { data } = useOverviewData();
 * ```
 */

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { overviewKeys } from "./overview.keys";
import {
    getMockOverviewStats,
    getMockStatusDistribution,
    getMockWorkloadByBlock,
    getMockSystemHealth,
    getMockWeeklyTrend,
    getMockOverviewData,
} from "../mockData";
import type {
    OverviewStats,
    TicketStatusDistribution,
    WorkloadByBlock,
    SystemHealth,
    WeeklyTrendItem,
    OverviewData,
} from "../types";

// ============================================================================
// Stats Query
// ============================================================================

/**
 * Hook to fetch overview statistics
 *
 * @param options - Additional query options
 */
export function useOverviewStats(
    options?: Partial<UseQueryOptions<OverviewStats, Error>>
) {
    return useQuery({
        queryKey: overviewKeys.stats(),
        // TODO: Uncomment when using real API
        // queryFn: ({ signal }) => overviewApi.getStats(signal),
        queryFn: () => Promise.resolve(getMockOverviewStats()),
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    });
}

// ============================================================================
// Status Distribution Query
// ============================================================================

/**
 * Hook to fetch ticket status distribution
 *
 * @param options - Additional query options
 */
export function useStatusDistribution(
    options?: Partial<UseQueryOptions<TicketStatusDistribution, Error>>
) {
    return useQuery({
        queryKey: overviewKeys.statusDistribution(),
        // TODO: Uncomment when using real API
        // queryFn: ({ signal }) => overviewApi.getStatusDistribution(signal),
        queryFn: () => Promise.resolve(getMockStatusDistribution()),
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    });
}

// ============================================================================
// Workload Query
// ============================================================================

/**
 * Hook to fetch workload by block
 *
 * @param options - Additional query options
 */
export function useWorkloadByBlock(
    options?: Partial<UseQueryOptions<WorkloadByBlock[], Error>>
) {
    return useQuery({
        queryKey: overviewKeys.workload(),
        // TODO: Uncomment when using real API
        // queryFn: ({ signal }) => overviewApi.getWorkloadByBlock(signal),
        queryFn: () => Promise.resolve(getMockWorkloadByBlock()),
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    });
}

// ============================================================================
// System Health Query
// ============================================================================

/**
 * Hook to fetch system health metrics
 *
 * @param options - Additional query options
 */
export function useSystemHealth(
    options?: Partial<UseQueryOptions<SystemHealth, Error>>
) {
    return useQuery({
        queryKey: overviewKeys.systemHealth(),
        // TODO: Uncomment when using real API
        // queryFn: ({ signal }) => overviewApi.getSystemHealth(signal),
        queryFn: () => Promise.resolve(getMockSystemHealth()),
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    });
}

// ============================================================================
// Weekly Trend Query
// ============================================================================

/**
 * Hook to fetch weekly ticket trend
 *
 * @param options - Additional query options
 */
export function useWeeklyTrend(
    options?: Partial<UseQueryOptions<WeeklyTrendItem[], Error>>
) {
    return useQuery({
        queryKey: overviewKeys.weeklyTrend(),
        // TODO: Uncomment when using real API
        // queryFn: ({ signal }) => overviewApi.getWeeklyTrend(signal),
        queryFn: () => Promise.resolve(getMockWeeklyTrend()),
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    });
}

// ============================================================================
// Complete Overview Data Query
// ============================================================================

/**
 * Hook to fetch complete overview data
 *
 * @param options - Additional query options
 */
export function useOverviewData(
    options?: Partial<UseQueryOptions<OverviewData, Error>>
) {
    return useQuery({
        queryKey: overviewKeys.data(),
        // TODO: Uncomment when using real API
        // queryFn: ({ signal }) => overviewApi.getData(signal),
        queryFn: () => Promise.resolve(getMockOverviewData()),
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    });
}
