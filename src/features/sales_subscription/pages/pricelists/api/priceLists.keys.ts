/**
 * Level Prices Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 */

import type { LevelPricesListParams } from "../types";

/**
 * Query key factory for level prices
 *
 * Hierarchy:
 * - all: ['level-prices']
 * - lists: ['level-prices', 'list']
 * - list(params): ['level-prices', 'list', params]
 * - details: ['level-prices', 'detail']
 * - detail(id): ['level-prices', 'detail', id]
 * - byLevel: ['level-prices', 'by-level']
 * - forLevel(levelId): ['level-prices', 'by-level', levelId]
 */
export const levelPriceKeys = {
    /**
     * Root key for all level price queries
     */
    all: ["level-prices"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...levelPriceKeys.all, "list"] as const,

    /**
     * Key for specific list with params
     */
    list: (params?: LevelPricesListParams) =>
        params
            ? ([...levelPriceKeys.lists(), params] as const)
            : levelPriceKeys.lists(),

    /**
     * Key for all detail queries
     */
    details: () => [...levelPriceKeys.all, "detail"] as const,

    /**
     * Key for specific level price detail
     */
    detail: (id: string) => [...levelPriceKeys.details(), id] as const,

    /**
     * Key for all by-level queries
     */
    byLevel: () => [...levelPriceKeys.all, "by-level"] as const,

    /**
     * Key for level prices for a specific level
     */
    forLevel: (levelId: string) =>
        [...levelPriceKeys.byLevel(), levelId] as const,
};

/**
 * Type for level price query keys
 */
export type LevelPriceQueryKey =
    | typeof levelPriceKeys.all
    | ReturnType<typeof levelPriceKeys.lists>
    | ReturnType<typeof levelPriceKeys.list>
    | ReturnType<typeof levelPriceKeys.details>
    | ReturnType<typeof levelPriceKeys.detail>
    | ReturnType<typeof levelPriceKeys.byLevel>
    | ReturnType<typeof levelPriceKeys.forLevel>;
