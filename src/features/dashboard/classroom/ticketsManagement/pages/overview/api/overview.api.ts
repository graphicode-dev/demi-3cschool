/**
 * Overview Feature - API Functions
 *
 * Raw API functions for overview domain.
 * These are pure functions that make HTTP requests.
 * They are used by query hooks.
 *
 * @example
 * ```ts
 * // In a query hook
 * const { data } = useQuery({
 *     queryKey: overviewKeys.stats(),
 *     queryFn: ({ signal }) => overviewApi.getStats(signal),
 * });
 * ```
 */

import { api } from "@/shared/api/client";
import type {
    OverviewStats,
    TicketStatusDistribution,
    WorkloadByBlock,
    SystemHealth,
    WeeklyTrendItem,
    OverviewData,
} from "../types";
import { ApiResponse } from "@/shared/api";

const BASE_URL = "/tickets/overview";

/**
 * Overview API functions
 */
export const overviewApi = {
    /**
     * Get overview statistics
     */
    getStats: async (signal?: AbortSignal): Promise<OverviewStats> => {
        const response = await api.get<ApiResponse<OverviewStats>>(
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
     * Get ticket status distribution
     */
    getStatusDistribution: async (
        signal?: AbortSignal
    ): Promise<TicketStatusDistribution> => {
        const response = await api.get<ApiResponse<TicketStatusDistribution>>(
            `${BASE_URL}/status-distribution`,
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
     * Get workload by block
     */
    getWorkloadByBlock: async (
        signal?: AbortSignal
    ): Promise<WorkloadByBlock[]> => {
        const response = await api.get<ApiResponse<WorkloadByBlock[]>>(
            `${BASE_URL}/workload`,
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
     * Get system health metrics
     */
    getSystemHealth: async (signal?: AbortSignal): Promise<SystemHealth> => {
        const response = await api.get<ApiResponse<SystemHealth>>(
            `${BASE_URL}/system-health`,
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
     * Get weekly ticket trend
     */
    getWeeklyTrend: async (
        signal?: AbortSignal
    ): Promise<WeeklyTrendItem[]> => {
        const response = await api.get<ApiResponse<WeeklyTrendItem[]>>(
            `${BASE_URL}/weekly-trend`,
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
     * Get complete overview data
     */
    getData: async (signal?: AbortSignal): Promise<OverviewData> => {
        const response = await api.get<ApiResponse<OverviewData>>(
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

export default overviewApi;
