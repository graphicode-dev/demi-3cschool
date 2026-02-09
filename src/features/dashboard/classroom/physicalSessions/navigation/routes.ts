import type { RouteConfig } from "@/router";

/**
 * Physical Sessions feature routes
 * These routes are under the classroom dashboard
 * Permission-controlled using groupsPermissions config.
 */
export const physicalSessionsRoutes: RouteConfig[] = [
    {
        path: "physical-sessions",
        lazy: () =>
            import("../pages/PhysicalSessionsPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "physicalSessions:title",
            requiresAuth: true,
        },
        handle: {
            crumb: "physicalSessions:breadcrumb.physicalStudyContent",
        },
        // permissions: [groupSession.viewAny],
    },
];
