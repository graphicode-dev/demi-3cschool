/**
 * Subscriptions Feature - Routes
 *
 * Routes for subscriptions and payments pages.
 */

import type { RouteConfig } from "@/router";
import { salesPermissions } from "@/auth";

const { installmentPayment } = salesPermissions;

export const subscriptionRoutes: RouteConfig[] = [
    {
        path: "payments",
        lazy: () =>
            import("../pages/InstallmentsListPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Payments",
            titleKey: "salesSubscription:payments.pageTitle",
            requiresAuth: true,
        },
        permissions: [installmentPayment.viewAny],
    },
    {
        path: "payments/pay/:paymentId",
        lazy: () =>
            import("../pages/PayInstallmentPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Pay Installment",
            titleKey: "salesSubscription:payments.pay.title",
            requiresAuth: true,
        },
        permissions: [installmentPayment.create],
    },
];
