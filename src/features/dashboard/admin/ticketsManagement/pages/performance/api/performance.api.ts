/**
 * Performance Feature - API Functions
 *
 * Raw API functions for performance domain.
 */

import { api } from "@/shared/api/client";
import type { PerformanceData, PeriodFilter } from "../types";
import { ApiResponse } from "@/shared/api";

const BASE_URL = "/tickets/performance";

/**
 * Performance API functions
 */
export const performanceApi = {
    /**
     * Get complete performance data
     */
    getData: async (
        period?: PeriodFilter,
        signal?: AbortSignal
    ): Promise<PerformanceData> => {
        const response = await api.get<ApiResponse<PerformanceData>>(BASE_URL, {
            params: period ? { period } : undefined,
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
};

export default performanceApi;
