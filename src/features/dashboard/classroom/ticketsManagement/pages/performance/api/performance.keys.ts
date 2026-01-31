/**
 * Performance Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 */

import type { PeriodFilter } from "../types";

/**
 * Query key factory for performance
 */
export const performanceKeys = {
    /**
     * Root key for all performance queries
     */
    all: ["performance"] as const,

    /**
     * Key for performance data with period filter
     */
    data: (period?: PeriodFilter) =>
        period
            ? ([...performanceKeys.all, "data", period] as const)
            : ([...performanceKeys.all, "data"] as const),
};

/**
 * Type for performance query keys
 */
export type PerformanceQueryKey =
    | typeof performanceKeys.all
    | ReturnType<typeof performanceKeys.data>;
