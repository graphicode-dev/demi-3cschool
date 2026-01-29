/**
 * Performance Feature - Query Hooks
 *
 * TanStack Query hooks for reading performance data.
 *
 * TODO: Remove mock data imports and uncomment real API calls when backend is ready.
 */

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { performanceKeys } from "./performance.keys";
import { getMockPerformanceData } from "../mockData";
import type { PerformanceData, PeriodFilter } from "../types";

// ============================================================================
// Complete Performance Data Query
// ============================================================================

/**
 * Hook to fetch complete performance data
 */
export function usePerformanceData(
    period?: PeriodFilter,
    options?: Partial<UseQueryOptions<PerformanceData, Error>>
) {
    return useQuery({
        queryKey: performanceKeys.data(period),
        // TODO: Uncomment when using real API
        // queryFn: ({ signal }) => performanceApi.getData(period, signal),
        queryFn: () => Promise.resolve(getMockPerformanceData()),
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    });
}
