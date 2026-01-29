import type { RouteConfig } from "@/router";
import { salesPermissions } from "@/auth";

const { subscription } = salesPermissions;

/**
 * Purchase feature routes
 *
 * These are imported and spread into the main sales_subscription routes.
 */
export const purchaseRoutes: RouteConfig[] = [
    {
        path: "purchases",
        lazy: () =>
            import("../pages/StudentPurchasePage").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Student Purchase",
            titleKey: "salesSubscription:purchases.pageTitle",
            requiresAuth: true,
        },
        permissions: [subscription.viewAny],
    },
    {
        path: "purchases/create",
        lazy: () =>
            import("../pages/CreateInvoicePage").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Create Subscription",
            titleKey: "salesSubscription:subscriptions.wizard.title",
            requiresAuth: true,
        },
        permissions: [subscription.create],
    },
    {
        path: "purchases/view/:id",
        lazy: () =>
            import("../pages/ViewSubscriptionPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "View Subscription",
            titleKey: "salesSubscription:subscriptions.view.title",
            requiresAuth: true,
        },
        permissions: [subscription.view],
    },
];
