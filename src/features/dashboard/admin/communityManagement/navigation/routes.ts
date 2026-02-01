import type { RouteConfig } from "@/router";

/**
 * Community Management feature routes (Admin only)
 * These routes are under the admin dashboard
 */
export const communityManagementRoutes: RouteConfig[] = [
    {
        path: "community-management",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "communityManagement:title",
            requiresAuth: true,
        },
    },
];
