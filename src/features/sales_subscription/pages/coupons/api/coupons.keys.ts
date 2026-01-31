/**
 * Coupons Feature - Query Keys
 *
 * Stable query key factory for TanStack Query.
 * Keys are hierarchical for easy invalidation.
 *
 * @example
 * ```ts
 * // Invalidate all coupons data
 * queryClient.invalidateQueries({ queryKey: couponKeys.all });
 *
 * // Invalidate only lists (keeps detail cache)
 * queryClient.invalidateQueries({ queryKey: couponKeys.lists() });
 *
 * // Invalidate specific coupon
 * queryClient.invalidateQueries({ queryKey: couponKeys.detail(couponId) });
 * ```
 */

import type { CouponsListParams } from "../types";

/**
 * Query key factory for coupons
 *
 * Hierarchy:
 * - all: ['coupons']
 * - lists: ['coupons', 'list']
 * - list(params): ['coupons', 'list', params]
 * - details: ['coupons', 'detail']
 * - detail(id): ['coupons', 'detail', id]
 * - generateCode: ['coupons', 'generate-code']
 */
export const couponKeys = {
    /**
     * Root key for all coupon queries
     */
    all: ["coupons"] as const,

    /**
     * Key for all list queries
     */
    lists: () => [...couponKeys.all, "list"] as const,

    /**
     * Key for specific list with params
     */
    list: (params?: CouponsListParams) =>
        params
            ? ([...couponKeys.lists(), params] as const)
            : couponKeys.lists(),

    /**
     * Key for all detail queries
     */
    details: () => [...couponKeys.all, "detail"] as const,

    /**
     * Key for specific coupon detail
     */
    detail: (id: string) => [...couponKeys.details(), id] as const,

    /**
     * Key for generate code query
     */
    generateCode: () => [...couponKeys.all, "generate-code"] as const,

    /**
     * Key for all usages queries
     */
    usages: () => [...couponKeys.all, "usages"] as const,

    /**
     * Key for specific coupon usages
     */
    usage: (couponId: string) => [...couponKeys.usages(), couponId] as const,
};

/**
 * Type for coupon query keys
 */
export type CouponQueryKey =
    | typeof couponKeys.all
    | ReturnType<typeof couponKeys.lists>
    | ReturnType<typeof couponKeys.list>
    | ReturnType<typeof couponKeys.details>
    | ReturnType<typeof couponKeys.detail>
    | ReturnType<typeof couponKeys.generateCode>
    | ReturnType<typeof couponKeys.usages>
    | ReturnType<typeof couponKeys.usage>;
