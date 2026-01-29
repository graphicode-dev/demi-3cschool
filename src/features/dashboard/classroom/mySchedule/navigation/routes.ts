import type { RouteConfig } from "@/router";

/**
 * My Schedule feature routes
 * These routes are under the classroom dashboard
 */
export const myScheduleRoutes: RouteConfig[] = [
    {
        path: "my-schedule",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "mySchedule:title",
            requiresAuth: true,
        },
    },
];

export default myScheduleRoutes;
