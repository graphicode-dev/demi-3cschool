/**
 * Overview Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 *
 * @example
 * ```ts
 * // Invalidate all overview data
 * queryClient.invalidateQueries({ queryKey: overviewKeys.all });
 *
 * // Invalidate only stats
 * queryClient.invalidateQueries({ queryKey: overviewKeys.stats() });
 * ```
 */

/**
 * Query key factory for overview
 *
 * Hierarchy:
 * - all: ['tickets-overview']
 * - stats: ['tickets-overview', 'stats']
 * - statusDistribution: ['tickets-overview', 'status-distribution']
 * - workload: ['tickets-overview', 'workload']
 * - systemHealth: ['tickets-overview', 'system-health']
 * - weeklyTrend: ['tickets-overview', 'weekly-trend']
 */
export const overviewKeys = {
    /**
     * Root key for all overview queries
     */
    all: ["tickets-overview"] as const,

    /**
     * Key for stats query
     */
    stats: () => [...overviewKeys.all, "stats"] as const,

    /**
     * Key for status distribution query
     */
    statusDistribution: () =>
        [...overviewKeys.all, "status-distribution"] as const,

    /**
     * Key for workload by block query
     */
    workload: () => [...overviewKeys.all, "workload"] as const,

    /**
     * Key for system health query
     */
    systemHealth: () => [...overviewKeys.all, "system-health"] as const,

    /**
     * Key for weekly trend query
     */
    weeklyTrend: () => [...overviewKeys.all, "weekly-trend"] as const,

    /**
     * Key for complete overview data
     */
    data: () => [...overviewKeys.all, "data"] as const,
};

/**
 * Type for overview query keys
 */
export type OverviewQueryKey =
    | typeof overviewKeys.all
    | ReturnType<typeof overviewKeys.stats>
    | ReturnType<typeof overviewKeys.statusDistribution>
    | ReturnType<typeof overviewKeys.workload>
    | ReturnType<typeof overviewKeys.systemHealth>
    | ReturnType<typeof overviewKeys.weeklyTrend>
    | ReturnType<typeof overviewKeys.data>;
