/**
 * Team Structure Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 */

/**
 * Query key factory for team structure
 */
export const teamStructureKeys = {
    /**
     * Root key for all team structure queries
     */
    all: ["team-structure"] as const,

    /**
     * Key for stats query
     */
    stats: () => [...teamStructureKeys.all, "stats"] as const,

    /**
     * Key for blocks list query
     */
    blocks: () => [...teamStructureKeys.all, "blocks"] as const,

    /**
     * Key for single block detail
     */
    block: (id: string) => [...teamStructureKeys.all, "block", id] as const,

    /**
     * Key for complete team structure data
     */
    data: () => [...teamStructureKeys.all, "data"] as const,
};

/**
 * Type for team structure query keys
 */
export type TeamStructureQueryKey =
    | typeof teamStructureKeys.all
    | ReturnType<typeof teamStructureKeys.stats>
    | ReturnType<typeof teamStructureKeys.blocks>
    | ReturnType<typeof teamStructureKeys.block>
    | ReturnType<typeof teamStructureKeys.data>;
