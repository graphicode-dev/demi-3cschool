/**
 * Support Block Feature - API Functions
 *
 * Raw API functions for support block domain.
 */

import { api } from "@/shared/api/client";
import type {
    SupportBlock,
    SupportBlocksListResponse,
    CreateSupportBlockPayload,
    UpdateSupportBlockPayload,
    ApiResponse,
} from "../types";

const BASE_URL = "/support-blocks";

/**
 * Support Block API functions
 */
export const supportBlockApi = {
    /**
     * Get all support blocks (paginated)
     */
    getList: async (
        page: number = 1,
        signal?: AbortSignal
    ): Promise<SupportBlocksListResponse> => {
        const response = await api.get<ApiResponse<SupportBlocksListResponse>>(
            `${BASE_URL}?page=${page}`,
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
     * Get single support block by ID
     */
    getById: async (
        id: number | string,
        signal?: AbortSignal
    ): Promise<SupportBlock> => {
        const response = await api.get<ApiResponse<SupportBlock>>(
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
     * Create a new support block
     */
    create: async (
        payload: CreateSupportBlockPayload
    ): Promise<SupportBlocksListResponse> => {
        const response = await api.post<ApiResponse<SupportBlocksListResponse>>(
            BASE_URL,
            payload
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
     * Update an existing support block
     */
    update: async (
        id: number | string,
        payload: UpdateSupportBlockPayload
    ): Promise<SupportBlock> => {
        const response = await api.patch<ApiResponse<SupportBlock>>(
            `${BASE_URL}/${id}`,
            payload
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
     * Delete a support block
     */
    delete: async (id: number | string): Promise<void> => {
        const response = await api.delete(`${BASE_URL}/${id}`);

        if (response.error) {
            throw response.error;
        }
    },
};

export default supportBlockApi;
