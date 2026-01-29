import type { RouteConfig } from "@/router";

/**
 * Self Study feature routes
 * These routes are under the classroom dashboard
 */
export const selfStudyRoutes: RouteConfig[] = [
    {
        path: "self-study",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "selfStudy:title",
            requiresAuth: true,
        },
    },
    {
        path: "self-study/lesson/:sessionId",
        lazy: () =>
            import("../pages/lesson").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "selfStudy:lesson.title",
            requiresAuth: true,
        },
    },
];

export default selfStudyRoutes;
