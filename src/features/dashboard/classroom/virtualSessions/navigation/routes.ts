import type { RouteConfig } from "@/router";

/**
 * Virtual Sessions feature routes
 * These routes are under the classroom dashboard
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
    },
];
