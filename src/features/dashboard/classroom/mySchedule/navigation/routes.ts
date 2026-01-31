import type { RouteConfig } from "@/router";
import { groupsPermissions } from "@/auth";

const { groupSession } = groupsPermissions;

/**
 * My Schedule feature routes
 * These routes are under the classroom dashboard
 * Permission-controlled using groupsPermissions config.
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
        // permissions: [groupSession.viewAny],
    },
];

export default myScheduleRoutes;
