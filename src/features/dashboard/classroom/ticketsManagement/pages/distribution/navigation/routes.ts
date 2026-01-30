import type { RouteConfig } from "@/router";
import { supportPermissions } from "@/auth";

const { ticket } = supportPermissions;

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
