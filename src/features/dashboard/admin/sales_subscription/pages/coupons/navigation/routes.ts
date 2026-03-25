import type { RouteConfig } from "@/router";

/**
 * Coupons feature routes
 */
export const couponsRoutes: RouteConfig[] = [
    {
        path: "coupons",
        lazy: () =>
            import("../pages/CouponsList").then((m) => ({
                default: m.default,
            })),
        handle: {
            crumb: "sales_subscription:coupons.title",
        },
        meta: {
            title: "Coupons",
            titleKey: "sales_subscription:coupons.title",
            requiresAuth: true,
        },
    },
    {
        path: "coupons/create",
        lazy: () =>
            import("../pages/CouponCreate").then((m) => ({
                default: m.default,
            })),
        handle: {
            crumb: "sales_subscription:coupons.actions.createNew",
        },
        meta: {
            title: "Create Coupon",
            titleKey: "sales_subscription:coupons.actions.createNew",
            requiresAuth: true,
        },
    },
    {
        path: "coupons/view/:id",
        lazy: () =>
            import("../pages/CouponDetail").then((m) => ({
                default: m.default,
            })),
        handle: {
            crumb: "sales_subscription:coupons.actions.view",
        },
        meta: {
            title: "Coupon Details",
            titleKey: "sales_subscription:coupons.actions.view",
            requiresAuth: true,
        },
    },
    {
        path: "coupons/edit/:id",
        lazy: () =>
            import("../pages/CouponEdit").then((m) => ({
                default: m.default,
            })),
        handle: {
            crumb: "sales_subscription:coupons.actions.edit",
        },
        meta: {
            title: "Edit Coupon",
            titleKey: "sales_subscription:coupons.actions.edit",
            requiresAuth: true,
        },
    },
    {
        path: "coupons/usages/:id",
        lazy: () =>
            import("../pages/CouponUsages").then((m) => ({
                default: m.default,
            })),
        handle: {
            crumb: "sales_subscription:coupons.usages.title",
        },
        meta: {
            title: "Coupon Usages",
            titleKey: "sales_subscription:coupons.usages.title",
            requiresAuth: true,
        },
    },
];
