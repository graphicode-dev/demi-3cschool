import type { RouteConfig } from "@/router";

/**
 * Community feature routes
 * These routes are under the classroom dashboard
 */
export const communityRoutes: RouteConfig[] = [
    {
        path: "community",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "community:title",
            requiresAuth: true,
        },
    },
];
