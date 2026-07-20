import { api } from "@/shared/api/client";
import type {
    DistributionStats,
    DistributionMethodConfig,
    DistributionData,
} from "../types";
import { ApiResponse } from "@/shared/api";
import {
    getMockDistributionStats,
    getMockDistributionMethodConfig,
    getMockDistributionData,
} from "../mockData";

const BASE_URL = "/tickets/distribution";

/**
 * Distribution API functions
 */
export const distributionApi = {
    /**
     * Get distribution statistics
     */
    getStats: async (signal?: AbortSignal): Promise<DistributionStats> => {
        return getMockDistributionStats();
    },

    /**
     * Get distribution method configuration
     */
    getMethodConfig: async (
        signal?: AbortSignal
    ): Promise<DistributionMethodConfig> => {
        return getMockDistributionMethodConfig();
    },

    /**
     * Get complete distribution data
     */
    getData: async (signal?: AbortSignal): Promise<DistributionData> => {
        return getMockDistributionData();
    },

    /**
     * Toggle distribution method
     */
    toggleMethod: async (
        isActive: boolean
    ): Promise<DistributionMethodConfig> => {
        const config = getMockDistributionMethodConfig();
        config.isActive = isActive;
        return config;
    },
};

export default distributionApi;
