import type { RouteConfig } from "@/router";
import { groupsPermissions } from "@/auth";

const { groupSession } = groupsPermissions;

/**
 * Virtual Sessions feature routes
 * These routes are under the classroom dashboard
 * Permission-controlled using groupsPermissions config.
 */
export const virtualSessionsRoutes: RouteConfig[] = [
    {
        path: "virtual-sessions",
        lazy: () =>
            import("../pages/VirtualSessionsPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "virtualSessions:title",
            requiresAuth: true,
        },
        permissions: [groupSession.viewAny],
    },
    {
        path: "virtual-sessions/recording/:sessionId",
        lazy: () =>
            import("../pages/RecordingPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "virtualSessions:recording.title",
            requiresAuth: true,
        },
        permissions: [groupSession.view],
    },
];
