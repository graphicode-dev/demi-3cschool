import type { RouteConfig } from "@/router";

/**
 * Performance feature routes
 */
export const performanceRoutes: RouteConfig[] = [
    {
        path: "performance",
        lazy: () =>
            import("../pages/PerformancePage").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Performance",
            titleKey: "ticketsManagement:performance.pageTitle",
            requiresAuth: true,
        },
    },
];
