/**
 * Level Prices Feature - API Functions
 *
 * Raw API functions for level prices domain.
 * These are pure functions that make HTTP requests.
 * They are used by query and mutation hooks.
 */

import { api } from "@/shared/api/client";
import type {
    LevelPrice,
    LevelPricesListParams,
    LevelPriceCreatePayload,
    LevelPriceUpdatePayload,
    LevelPricesPaginatedResponse,
} from "../types";
import { ApiResponse } from "@/shared/api";

const BASE_URL = "/level-prices";

/**
 * Level Prices API functions
 */
export const levelPricesApi = {
    /**
     * Get list of all level prices
     */
    getList: async (
        params?: LevelPricesListParams,
        signal?: AbortSignal
    ): Promise<LevelPrice[]> => {
        const response = await api.get<ApiResponse<LevelPrice[]>>(BASE_URL, {
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
     * Get level prices for a specific level (paginated)
     */
    getByLevel: async (
        levelId: string | number,
        signal?: AbortSignal
    ): Promise<LevelPricesPaginatedResponse> => {
        const response = await api.get<
            ApiResponse<LevelPricesPaginatedResponse>
        >(`${BASE_URL}/level/${levelId}`, { signal });

        if (response.error) {
            throw response.error;
        }

        if (!response.data?.data) {
            throw new Error("No data returned from server");
        }

        return response.data.data;
    },

    /**
     * Get single level price by ID
     */
    getById: async (
        id: string | number,
        signal?: AbortSignal
    ): Promise<LevelPrice> => {
        const response = await api.get<ApiResponse<LevelPrice>>(
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
     * Create a new level price
     */
    create: async (payload: LevelPriceCreatePayload): Promise<LevelPrice> => {
        const response = await api.post<ApiResponse<LevelPrice>>(
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
     * Update an existing level price
     */
    update: async (
        id: string | number,
        payload: LevelPriceUpdatePayload
    ): Promise<LevelPrice> => {
        const response = await api.patch<ApiResponse<LevelPrice>>(
            `${BASE_URL}/${id}`,
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
     * Delete a level price
     */
    delete: async (id: string | number): Promise<void> => {
        const response = await api.delete<ApiResponse<void>>(
            `${BASE_URL}/${id}`
        );

        if (response.error) {
            throw response.error;
        }
    },
};
