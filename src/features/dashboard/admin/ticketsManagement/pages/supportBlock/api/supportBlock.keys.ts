/**
 * Support Block Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 */

/**
 * Query key factory for support block
 */
export const supportBlockKeys = {
    /**
     * Root key for all support block queries
     */
    all: ["support-block"] as const,

    /**
     * Key for stats query
     */
    stats: () => [...supportBlockKeys.all, "stats"] as const,

    /**
     * Key for blocks list query
     */
    blocks: () => [...supportBlockKeys.all, "blocks"] as const,

    /**
     * Key for single block detail
     */
    block: (id: string) => [...supportBlockKeys.all, "block", id] as const,

    /**
     * Key for complete support block data
     */
    data: () => [...supportBlockKeys.all, "data"] as const,
};

/**
 * Type for support block query keys
 */
export type SupportBlockQueryKey =
    | typeof supportBlockKeys.all
    | ReturnType<typeof supportBlockKeys.stats>
    | ReturnType<typeof supportBlockKeys.blocks>
    | ReturnType<typeof supportBlockKeys.block>
    | ReturnType<typeof supportBlockKeys.data>;
