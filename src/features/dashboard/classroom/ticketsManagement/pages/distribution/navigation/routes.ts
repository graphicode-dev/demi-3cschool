import type { RouteConfig } from "@/router";

/**
 * Distribution feature routes
 */
export const distributionRoutes: RouteConfig[] = [
    {
        path: "distribution",
        lazy: () =>
            import("../pages/DistributionPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Distribution",
            titleKey: "ticketsManagement:distribution.pageTitle",
            requiresAuth: true,
        },
    },
];
