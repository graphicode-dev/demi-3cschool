/**
 * Level Subscriptions Feature - API Functions
 *
 * Raw API functions for level subscriptions domain.
 * These are pure functions that make HTTP requests.
 * They are used by query and mutation hooks.
 *
 * @example
 * ```ts
 * // In a query hook
 * const { data } = useQuery({
 *     queryKey: levelSubscriptionKeys.list(params),
 *     queryFn: ({ signal }) => levelSubscriptionsApi.getList(params, signal),
 * });
 * ```
 */

import { api } from "@/shared/api/client";
import type {
    LevelSubscription,
    LevelSubscriptionListParams,
    LevelSubscriptionCreatePayload,
    LevelSubscriptionStatusPayload,
    PaginatedLevelSubscriptionData,
} from "../types";
import { ApiResponse } from "@/shared/api";

const BASE_URL = "/subscriptions/level-subscriptions";

/**
 * Level Subscriptions API functions
 */
export const levelSubscriptionsApi = {
    /**
     * Get list of all level subscriptions (paginated)
     */
    getList: async (
        params?: LevelSubscriptionListParams,
        signal?: AbortSignal
    ): Promise<PaginatedLevelSubscriptionData> => {
        const response = await api.get<
            ApiResponse<PaginatedLevelSubscriptionData>
        >(BASE_URL, {
            params: params as Record<string, unknown>,
            signal,
        });

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    /**
     * Get single level subscription by ID
     */
    getById: async (
        id: string | number,
        signal?: AbortSignal
    ): Promise<LevelSubscription> => {
        const response = await api.get<ApiResponse<LevelSubscription>>(
            `${BASE_URL}/${id}`,
            { signal }
        );

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    /**
     * Create a new level subscription
     */
    create: async (
        payload: LevelSubscriptionCreatePayload
    ): Promise<LevelSubscription> => {
        const response = await api.post<ApiResponse<LevelSubscription>>(
            BASE_URL,
            payload
        );

        if (response.error) {
            // Throw the full error object to preserve field-level errors
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    /**
     * Update subscription status
     */
    updateStatus: async (
        id: string | number,
        payload: LevelSubscriptionStatusPayload
    ): Promise<LevelSubscription> => {
        const response = await api.patch<ApiResponse<LevelSubscription>>(
            `${BASE_URL}/${id}/status`,
            payload
        );

        if (response.error) {
            // Throw the full error object to preserve field-level errors
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },
};

export default levelSubscriptionsApi;
