/**
 * Distribution Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 */

/**
 * Query key factory for distribution
 */
export const distributionKeys = {
    /**
     * Root key for all distribution queries
     */
    all: ["distribution"] as const,

    /**
     * Key for stats query
     */
    stats: () => [...distributionKeys.all, "stats"] as const,

    /**
     * Key for method config query
     */
    methodConfig: () => [...distributionKeys.all, "method-config"] as const,

    /**
     * Key for complete distribution data
     */
    data: () => [...distributionKeys.all, "data"] as const,
};

/**
 * Type for distribution query keys
 */
export type DistributionQueryKey =
    | typeof distributionKeys.all
    | ReturnType<typeof distributionKeys.stats>
    | ReturnType<typeof distributionKeys.methodConfig>
    | ReturnType<typeof distributionKeys.data>;
