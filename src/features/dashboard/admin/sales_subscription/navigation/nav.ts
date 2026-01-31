/**
 * Sales Subscription Feature - Navigation
 *
 * Navigation metadata for Sales Analysis section.
 * Includes Coupons, Price Lists, and Purchases as sub-items.
 * Permission-controlled sidebar items using salesPermissions config.
 *
 * @example
 * ```ts
 * import { salesSubscriptionNav } from '@/features/sales_subscription/navigation/nav';
 * navRegistry.register(salesSubscriptionNav);
 * ```
 */

import type { FeatureNavModule } from "@/navigation/nav.types";
import { salesPermissions } from "@/auth";
import { salesPaths } from "./paths";

const { coupon, levelPrice, subscription, installmentPayment } =
    salesPermissions;

export const salesSubscriptionNav: FeatureNavModule = {
    featureId: "salesSubscription",
    section: "Sales Analysis",
    items: [
        {
            key: "sales",
            labelKey: "sales_subscription:salesAnalysis.title",
            label: "Sales",
            href: salesPaths.coupons.list(),
            order: 1,
            permissions: [
                coupon.viewAny,
                levelPrice.viewAny,
                subscription.viewAny,
                installmentPayment.viewAny,
            ],
            children: [
                {
                    key: "coupons",
                    labelKey: "sales_subscription:coupons.title",
                    label: "Coupons",
                    href: salesPaths.coupons.list(),
                    order: 1,
                    permissions: [coupon.viewAny],
                },
                {
                    key: "price-lists",
                    labelKey: "sales_subscription:priceLists.title",
                    label: "Price Lists",
                    href: salesPaths.priceLists.list(),
                    order: 2,
                    permissions: [levelPrice.viewAny],
                },
                {
                    key: "purchases",
                    labelKey: "sales_subscription:purchases.title",
                    label: "Purchases",
                    href: salesPaths.purchases.list(),
                    order: 3,
                    permissions: [subscription.viewAny],
                },
                {
                    key: "installments",
                    labelKey: "sales_subscription:installments.title",
                    label: "Installments",
                    href: salesPaths.payments.list(),
                    order: 4,
                    permissions: [installmentPayment.viewAny],
                },
            ],
        },
    ],
};

export default salesSubscriptionNav;
