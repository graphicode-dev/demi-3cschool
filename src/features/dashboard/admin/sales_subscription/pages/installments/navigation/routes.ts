import type { RouteConfig } from "@/router";

export const subscriptionRoutes: RouteConfig[] = [
    {
        path: "payments",
        lazy: () =>
            import("../pages/InstallmentsListPage").then((m) => ({
                default: m.default,
            })),
        handle: {
            crumb: "sales_subscription:payments.pageTitle",
        },
        meta: {
            title: "Payments",
            titleKey: "sales_subscription:payments.pageTitle",
            requiresAuth: true,
        },
    },
    {
        path: "payments/pay/:paymentId",
        lazy: () =>
            import("../pages/PayInstallmentPage").then((m) => ({
                default: m.default,
            })),
        handle: {
            crumb: "sales_subscription:payments.pay.title",
        },
        meta: {
            title: "Pay Installment",
            titleKey: "sales_subscription:payments.pay.title",
            requiresAuth: true,
        },
    },
];
