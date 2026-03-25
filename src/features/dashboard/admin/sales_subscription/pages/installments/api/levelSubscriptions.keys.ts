/**
 * Level Subscriptions Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 *
 * @example
 * ```ts
 * // Invalidate all level subscriptions data
 * queryClient.invalidateQueries({ queryKey: levelSubscriptionKeys.all });
 *
 * // Invalidate only lists (keeps detail cache)
 * queryClient.invalidateQueries({ queryKey: levelSubscriptionKeys.lists() });
 *
 * // Invalidate specific subscription
 * queryClient.invalidateQueries({ queryKey: levelSubscriptionKeys.detail(id) });
 * ```
 */

import type { LevelSubscriptionListParams } from "../types";

/**
 * Query key factory for level subscriptions
 *
 * Hierarchy:
 * - all: ['level-subscriptions']
 * - lists: ['level-subscriptions', 'list']
 * - list(params): ['level-subscriptions', 'list', params]
 * - details: ['level-subscriptions', 'detail']
 * - detail(id): ['level-subscriptions', 'detail', id]
 */
export const levelSubscriptionKeys = {
    /**
     * Root key for all level subscription queries
     */
    all: ["level-subscriptions"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...levelSubscriptionKeys.all, "list"] as const,

    /**
     * Key for specific list with params
     */
    list: (params?: LevelSubscriptionListParams) =>
        params
            ? ([...levelSubscriptionKeys.lists(), params] as const)
            : levelSubscriptionKeys.lists(),

    /**
     * Key for all detail queries
     */
    details: () => [...levelSubscriptionKeys.all, "detail"] as const,

    /**
     * Key for specific subscription detail
     */
    detail: (id: string | number) =>
        [...levelSubscriptionKeys.details(), String(id)] as const,
};

/**
 * Type for level subscription query keys
 */
export type LevelSubscriptionQueryKey =
    | typeof levelSubscriptionKeys.all
    | ReturnType<typeof levelSubscriptionKeys.lists>
    | ReturnType<typeof levelSubscriptionKeys.list>
    | ReturnType<typeof levelSubscriptionKeys.details>
    | ReturnType<typeof levelSubscriptionKeys.detail>;
