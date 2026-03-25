/**
 * Level Subscriptions Feature - Query Hooks
 *
 * TanStack Query hooks for reading level subscription data.
 * All queries support AbortSignal for cancellation.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useLevelSubscriptionsList({ page: 1 });
 * const { data: subscription } = useLevelSubscription(id);
 * ```
 */

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { levelSubscriptionKeys } from "./levelSubscriptions.keys";
import { levelSubscriptionsApi } from "./levelSubscriptions.api";
import type { LevelSubscriptionListParams } from "../types";

/**
 * Hook to fetch paginated list of level subscriptions
 *
 * @param params - Optional filter/pagination params
 * @returns Query result with paginated subscription data
 */
export function useLevelSubscriptionsList(
    params?: LevelSubscriptionListParams
) {
    return useQuery({
        queryKey: levelSubscriptionKeys.list(params),
        queryFn: ({ signal }) => levelSubscriptionsApi.getList(params, signal),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}

/**
 * Hook to fetch a single level subscription by ID
 *
 * @param id - Subscription ID
 * @returns Query result with subscription data
 */
export function useLevelSubscription(id: string | number | undefined) {
    return useQuery({
        queryKey: levelSubscriptionKeys.detail(id!),
        queryFn: ({ signal }) => levelSubscriptionsApi.getById(id!, signal),
        enabled: !!id,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
