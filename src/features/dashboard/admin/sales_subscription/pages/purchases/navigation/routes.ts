import type { RouteConfig } from "@/router";

// const { subscription } = salesPermissions;

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
        handle: {
            crumb: "sales_subscription:purchases.pageTitle",
        },
        meta: {
            title: "Student Purchase",
            titleKey: "sales_subscription:purchases.pageTitle",
            requiresAuth: true,
        },
        // permissions: [subscription.viewAny],
    },
    {
        path: "purchases/create",
        lazy: () =>
            import("../pages/CreateInvoicePage").then((m) => ({
                default: m.default,
            })),
        handle: {
            crumb: "sales_subscription:subscriptions.wizard.title",
        },
        meta: {
            title: "Create Subscription",
            titleKey: "sales_subscription:subscriptions.wizard.title",
            requiresAuth: true,
        },
        // permissions: [subscription.create],
    },
    {
        path: "purchases/view/:id",
        lazy: () =>
            import("../pages/ViewSubscriptionPage").then((m) => ({
                default: m.default,
            })),
        handle: {
            crumb: "sales_subscription:subscriptions.view.title",
        },
        meta: {
            title: "View Subscription",
            titleKey: "sales_subscription:subscriptions.view.title",
            requiresAuth: true,
        },
        // permissions: [subscription.view],
    },
];
