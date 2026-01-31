/**
 * Level Prices Feature - Query Hooks
 *
 * TanStack Query hooks for reading level price data.
 * All queries support AbortSignal for cancellation.
 */

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { levelPriceKeys } from "./priceLists.keys";
import { levelPricesApi } from "./priceLists.api";
import type {
    LevelPrice,
    LevelPricesListParams,
    LevelPricesPaginatedResponse,
} from "../types";

// ============================================================================
// List Queries
// ============================================================================

/**
 * Hook to fetch list of all level prices
 *
 * @param params - Query parameters for filtering
 * @param options - Additional query options
 */
export function useLevelPricesList(
    params?: LevelPricesListParams,
    options?: Partial<UseQueryOptions<LevelPrice[], Error>>
) {
    return useQuery({
        queryKey: levelPriceKeys.list(params),
        queryFn: ({ signal }) => levelPricesApi.getList(params, signal),
        placeholderData: (previousData) => previousData,
        ...options,
    });
}

/**
 * Hook to fetch level prices for a specific level (paginated)
 *
 * @param levelId - Level ID
 * @param options - Additional query options
 */
export function useLevelPricesForLevel(
    levelId: string | undefined | null,
    options?: Partial<UseQueryOptions<LevelPricesPaginatedResponse, Error>>
) {
    return useQuery({
        queryKey: levelPriceKeys.forLevel(levelId ?? ""),
        queryFn: ({ signal }) => levelPricesApi.getByLevel(levelId!, signal),
        enabled: !!levelId,
        ...options,
    });
}

// ============================================================================
// Detail Queries
// ============================================================================

/**
 * Hook to fetch single level price by ID
 *
 * @param id - Level Price ID
 * @param options - Additional query options
 */
export function useLevelPrice(
    id: string | undefined | null,
    options?: Partial<UseQueryOptions<LevelPrice, Error>>
) {
    return useQuery({
        queryKey: levelPriceKeys.detail(id ?? ""),
        queryFn: ({ signal }) => levelPricesApi.getById(id!, signal),
        enabled: !!id,
        ...options,
    });
}
