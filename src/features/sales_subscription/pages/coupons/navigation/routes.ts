import type { RouteConfig } from "@/router";
import { salesPermissions } from "@/auth";

const { coupon } = salesPermissions;

/**
 * Coupons feature routes
 *
 * These are imported and spread into the main sales_subscription routes.
 */
export const couponsRoutes: RouteConfig[] = [
    {
        path: "coupons",
        lazy: () =>
            import("../pages/CouponsList").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Coupons",
            titleKey: "salesSubscription:coupons.title",
            requiresAuth: true,
        },
        permissions: [coupon.viewAny],
    },
    {
        path: "coupons/create",
        lazy: () =>
            import("../pages/CouponCreate").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Create Coupon",
            titleKey: "salesSubscription:coupons.actions.createNew",
            requiresAuth: true,
        },
        permissions: [coupon.create],
    },
    {
        path: "coupons/view/:id",
        lazy: () =>
            import("../pages/CouponDetail").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Coupon Details",
            requiresAuth: true,
        },
        permissions: [coupon.view],
    },
    {
        path: "coupons/edit/:id",
        lazy: () =>
            import("../pages/CouponEdit").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Edit Coupon",
            requiresAuth: true,
        },
        permissions: [coupon.update],
    },
    {
        path: "coupons/usages/:id",
        lazy: () =>
            import("../pages/CouponUsages").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Coupon Usages",
            requiresAuth: true,
        },
        permissions: [coupon.view],
    },
];
