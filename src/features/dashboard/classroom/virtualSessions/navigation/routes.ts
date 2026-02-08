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
        handle: {
            crumb: "virtualSessions:breadcrumb.virtualStudyContent",
        },
        // permissions: [groupSession.viewAny],
    },
    // Recording SiteMap (placeholder for /virtual-sessions/recording)
    {
        path: "virtual-sessions/recording",
        lazy: () =>
            import("../pages/site_map/RecordingSiteMap").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "virtualSessions:sitemap.recording.title",
            requiresAuth: true,
        },
        handle: {
            crumb: "virtualSessions:breadcrumb.recording",
        },
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
        // Dynamic breadcrumb is set by the page component using useDynamicBreadcrumb
        // permissions: [groupSession.view],
    },
];
