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
    all: ["support-blocks"] as const,

    /**
     * Key for paginated list query
     */
    list: (page: number = 1) =>
        [...supportBlockKeys.all, "list", { page }] as const,

    /**
     * Key for single support block detail
     */
    detail: (id: number | string) =>
        [...supportBlockKeys.all, "detail", id] as const,
};

/**
 * Type for support block query keys
 */
export type SupportBlockQueryKey =
    | typeof supportBlockKeys.all
    | ReturnType<typeof supportBlockKeys.list>
    | ReturnType<typeof supportBlockKeys.detail>;
