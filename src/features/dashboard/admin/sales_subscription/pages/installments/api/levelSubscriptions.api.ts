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
import {
    LevelSubscription,
    LevelSubscriptionListParams,
    LevelSubscriptionCreatePayload,
    LevelSubscriptionStatusPayload,
    PaginatedLevelSubscriptionData,
} from "../types";
import { ApiResponse } from "@/shared/api";
import { USE_MOCK_API } from "../../../api.config";
import { mockLevelSubscription, mockPaginatedSubscriptions } from "./mock";

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
        if (USE_MOCK_API) {
            return new Promise((resolve) => setTimeout(() => resolve(mockPaginatedSubscriptions), 500));
        }

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
        if (USE_MOCK_API) {
            const mock = mockPaginatedSubscriptions.items.find(s => s.id === Number(id)) || mockLevelSubscription;
            return new Promise((resolve) => setTimeout(() => resolve({ ...mock }), 500));
        }

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
        if (USE_MOCK_API) {
            const newSub: LevelSubscription = {
                ...mockLevelSubscription,
                id: Math.floor(Math.random() * 1000) + 10,
                student: { id: Number(payload.studentId), name: "New Student", email: "student@example.com" },
                level: { id: Number(payload.levelId), title: "New Level", course: { id: 1, title: "Course" } },
                createdAt: new Date().toISOString()
            };
            return new Promise((resolve) => setTimeout(() => resolve(newSub), 500));
        }

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
        if (USE_MOCK_API) {
            const mock = mockPaginatedSubscriptions.items.find(s => s.id === Number(id)) || mockLevelSubscription;
            const updated = { ...mock, subscriptionStatus: payload.status };
            return new Promise((resolve) => setTimeout(() => resolve(updated as LevelSubscription), 500));
        }

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
