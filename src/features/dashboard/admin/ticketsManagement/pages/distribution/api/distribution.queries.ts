/**
 * Distribution Feature - Query Hooks
 *
 * TanStack Query hooks for reading distribution data.
 *
 * TODO: Remove mock data imports and uncomment real API calls when backend is ready.
 */

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { distributionKeys } from "./distribution.keys";
import type { DistributionData } from "../types";
import distributionApi from "./distribution.api";

// ============================================================================
// Complete Distribution Data Query
// ============================================================================

/**
 * Hook to fetch complete distribution data
 */
export function useDistributionData(
    options?: Partial<UseQueryOptions<DistributionData, Error>>
) {
    return useQuery({
        queryKey: distributionKeys.data(),
        // TODO: Uncomment when using real API
        queryFn: ({ signal }) => distributionApi.getData(signal),
        staleTime: 1000 * 60 * 5, // 5 minutes
        ...options,
    });
}
