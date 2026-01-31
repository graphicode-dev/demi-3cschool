/**
 * Team Structure Feature - API Functions
 *
 * Raw API functions for team structure domain.
 */

import { api } from "@/shared/api/client";
import type { TeamStats, Block, TeamStructureData } from "../types";
import { ApiResponse } from "@/shared/api";

const BASE_URL = "/tickets/team-structure";

/**
 * Team Structure API functions
 */
export const teamStructureApi = {
    /**
     * Get team structure statistics
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
     * Get complete team structure data
     */
    getData: async (signal?: AbortSignal): Promise<TeamStructureData> => {
        const response = await api.get<ApiResponse<TeamStructureData>>(
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

export default teamStructureApi;
