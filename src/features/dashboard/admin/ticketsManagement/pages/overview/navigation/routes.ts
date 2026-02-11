import type { RouteConfig } from "@/router";

/**
 * Overview feature routes
 *
 * These are imported and spread into the main ticketsManagement routes.
 */
export const overviewRoutes: RouteConfig[] = [
    {
        path: "overview",
        lazy: () =>
            import("../pages/OverviewPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Overview",
            titleKey: "adminTicketsManagement:overview.pageTitle",
            requiresAuth: true,
        },
    },
];
