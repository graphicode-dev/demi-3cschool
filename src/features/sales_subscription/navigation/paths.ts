/**
 * Sales Subscription Feature - Path Builders
 *
 * Centralized, type-safe path builders for Sales Subscription.
 * Includes Coupons, PriceLists, and Purchases paths.
 *
 * @example
 * ```ts
 * import { salesPaths } from '@/features/sales_subscription/navigation/paths';
 *
 * navigate(salesPaths.coupons.list());
 * navigate(salesPaths.priceLists.view(priceListId));
 * ```
 */

import { registerFeaturePaths } from "@/router/paths.registry";
import {
    purchases,
    purchaseSubscriptionPaths,
} from "../pages/purchases/navigation/paths";
import { coupons, couponsSubscriptionPaths } from "../pages/coupons/navigation";
import {
    priceLists,
    priceListsSubscriptionPaths,
} from "../pages/pricelists/navigation";
import {
    payments,
    paymentsSubscriptionPaths,
} from "../pages/installments/navigation/paths";
import { SALES_BASE_PATH } from "./constants";

// ============================================================================
// Sales Subscription Paths
// ============================================================================

export const salesPaths = {
    /**
     * Root sales path
     */
    root: () => SALES_BASE_PATH,

    /**
     * Coupons paths
     */
    coupons,

    /**
     * Price Lists paths
     */
    priceLists,

    /**
     * Purchases paths
     */
    purchases,

    /**
     * Payments paths
     */
    payments,
} as const;

// ============================================================================
// Register Feature Paths
// ============================================================================

export const salesSubscriptionPaths = registerFeaturePaths(
    "salesSubscription",
    {
        root: salesPaths.root,
        // Coupons
        ...couponsSubscriptionPaths,

        // Price Lists
        ...priceListsSubscriptionPaths,

        // Purchases
        ...purchaseSubscriptionPaths,

        // Payments
        ...paymentsSubscriptionPaths,
    }
);

// ============================================================================
// Type Exports
// ============================================================================

export type SalesPaths = typeof salesPaths;
