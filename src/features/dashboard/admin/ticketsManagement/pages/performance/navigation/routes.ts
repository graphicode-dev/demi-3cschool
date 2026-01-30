import type { RouteConfig } from "@/router";
import { supportPermissions } from "@/auth";

const { ticket } = supportPermissions;

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
