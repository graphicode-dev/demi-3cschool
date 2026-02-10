/**
 * Support Block Feature - API Functions
 *
 * Raw API functions for support block domain.
 */

import { api } from "@/shared/api/client";
import type { TeamStats, Block } from "../types";
import { ApiResponse } from "@/shared/api";
import { SupportBlockData } from "../types/supportBlock.types";

const BASE_URL = "/tickets/team-structure";

/**
 * Support Block API functions
 */
export const supportBlockApi = {
    /**
     * Get support block statistics
     */
    getStats: async (signal?: AbortSignal): Promise<TeamStats> => {
        const response = await api.get<ApiResponse<TeamStats>>(
            `${BASE_URL}/stats`,
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
     * Get all blocks
     */
    getBlocks: async (signal?: AbortSignal): Promise<Block[]> => {
        const response = await api.get<ApiResponse<Block[]>>(
            `${BASE_URL}/blocks`,
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
     * Get single block by ID
     */
    getBlock: async (id: string, signal?: AbortSignal): Promise<Block> => {
        const response = await api.get<ApiResponse<Block>>(
            `${BASE_URL}/blocks/${id}`,
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
     * Get complete support block data
     */
    getData: async (signal?: AbortSignal): Promise<SupportBlockData> => {
        const response = await api.get<ApiResponse<SupportBlockData>>(
            `${BASE_URL}`,
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
};

export default supportBlockApi;
