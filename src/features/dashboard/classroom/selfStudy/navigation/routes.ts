import type { RouteConfig } from "@/router";
import { learningPermissions } from "@/auth";

const { lesson } = learningPermissions;

/**
 * Self Study feature routes
 * These routes are under the classroom dashboard
 * Permission-controlled using learningPermissions config.
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
        // permissions: [lesson.viewAny],
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
        // permissions: [lesson.view],
    },
];

export default selfStudyRoutes;
