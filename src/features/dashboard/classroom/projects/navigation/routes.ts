import type { RouteConfig } from "@/router";

/**
 * Projects feature routes
 * These routes are under the classroom dashboard
 */
export const projectsRoutes: RouteConfig[] = [
    {
        path: "projects",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "projects:title",
            requiresAuth: true,
        },
    },
];

export default projectsRoutes;
