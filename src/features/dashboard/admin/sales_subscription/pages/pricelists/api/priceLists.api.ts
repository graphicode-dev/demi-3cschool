/**
 * Level Prices Feature - API Functions
 *
 * Raw API functions for level prices domain.
 * These are pure functions that make HTTP requests.
 * They are used by query and mutation hooks.
 */

import { api } from "@/shared/api/client";
import {
    LevelPrice,
    LevelPricesListParams,
    LevelPriceCreatePayload,
    LevelPriceUpdatePayload,
    LevelPricesPaginatedResponse,
} from "../types";
import { ApiResponse } from "@/shared/api";
import { USE_MOCK_API } from "../../../api.config";
import { mockLevelPrices, mockLevelPricesPaginated } from "./mock";

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
        if (USE_MOCK_API) {
            return new Promise((resolve) => setTimeout(() => resolve([...mockLevelPrices]), 500));
        }

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
        if (USE_MOCK_API) {
            return new Promise((resolve) => setTimeout(() => resolve(mockLevelPricesPaginated), 500));
        }

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
        if (USE_MOCK_API) {
            const mock = mockLevelPrices.find(p => p.id === Number(id)) || mockLevelPrices[0];
            return new Promise((resolve) => setTimeout(() => resolve({ ...mock }), 500));
        }

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
        if (USE_MOCK_API) {
            const newPrice: LevelPrice = {
                ...mockLevelPrices[0],
                id: Math.floor(Math.random() * 1000) + 10,
                name: payload.name,
                description: payload.description || "",
                price: payload.price.toString(),
                groupType: payload.groupType || "regular",
                originalPrice: payload.original_price?.toString() || payload.price.toString(),
                maxInstallments: payload.max_installments || 1,
                isDefault: payload.is_default === 1,
                isActive: payload.is_active !== 0,
                validFrom: payload.valid_from || new Date().toISOString(),
                validUntil: payload.valid_until || "2030-01-01T00:00:00Z",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            return new Promise((resolve) => setTimeout(() => resolve(newPrice), 500));
        }

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
        if (USE_MOCK_API) {
            const mock = mockLevelPrices.find(p => p.id === Number(id)) || mockLevelPrices[0];
            const updated: LevelPrice = { ...mock, ...payload, updatedAt: new Date().toISOString() } as unknown as LevelPrice;
            return new Promise((resolve) => setTimeout(() => resolve(updated), 500));
        }

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
        if (USE_MOCK_API) {
            return new Promise((resolve) => setTimeout(resolve, 500));
        }

        const response = await api.delete<ApiResponse<void>>(
            `${BASE_URL}/${id}`
        );

        if (response.error) {
            throw response.error;
        }
    },
};
