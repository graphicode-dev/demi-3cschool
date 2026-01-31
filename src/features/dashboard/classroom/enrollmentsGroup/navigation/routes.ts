import type { RouteConfig } from "@/router";

/**
 * Enrollments Group feature routes
 * These routes are under the classroom dashboard
 */
export const enrollmentsGroupRoutes: RouteConfig[] = [
    {
        path: "enrollments-group",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "enrollmentsGroup:title",
            requiresAuth: true,
        },
    },
];

export default enrollmentsGroupRoutes;
