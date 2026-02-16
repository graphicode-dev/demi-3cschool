import type { RouteConfig } from "@/router";

/**
 * Auditing feature routes (Admin only)
 * These routes are under the admin dashboard
 */
export const auditingRoutes: RouteConfig[] = [
    {
        path: "auditing",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "auditing:title",
            requiresAuth: true,
        },
    },
];
