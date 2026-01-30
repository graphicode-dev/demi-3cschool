/**
 * Distribution Feature - API Functions
 *
 * Raw API functions for distribution domain.
 */

import { api } from "@/shared/api/client";
import type {
    DistributionStats,
    DistributionMethodConfig,
    DistributionData,
} from "../types";
import { ApiResponse } from "@/shared/api";

const BASE_URL = "/tickets/distribution";

/**
 * Distribution API functions
 */
export const distributionApi = {
    /**
     * Get distribution statistics
     */
    getStats: async (signal?: AbortSignal): Promise<DistributionStats> => {
        const response = await api.get<ApiResponse<DistributionStats>>(
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
     * Get distribution method configuration
     */
    getMethodConfig: async (
        signal?: AbortSignal
    ): Promise<DistributionMethodConfig> => {
        const response = await api.get<ApiResponse<DistributionMethodConfig>>(
            `${BASE_URL}/method-config`,
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
     * Get complete distribution data
     */
    getData: async (signal?: AbortSignal): Promise<DistributionData> => {
        const response = await api.get<ApiResponse<DistributionData>>(
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

    /**
     * Toggle distribution method
     */
    toggleMethod: async (
        isActive: boolean
    ): Promise<DistributionMethodConfig> => {
        const response = await api.patch<ApiResponse<DistributionMethodConfig>>(
            `${BASE_URL}/method-config`,
            { isActive }
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

export default distributionApi;
