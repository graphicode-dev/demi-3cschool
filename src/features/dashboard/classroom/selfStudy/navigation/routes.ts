import type { RouteConfig } from "@/router";

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
        handle: {
            crumb: "selfStudy:breadcrumb.selfStudyContent",
        },
        // permissions: [lesson.viewAny],
    },
    // Lesson SiteMap (placeholder for /self-study/lesson)
    {
        path: "self-study/lesson",
        lazy: () =>
            import("../pages/site_map/LessonSiteMap").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "selfStudy:sitemap.lesson.title",
            requiresAuth: true,
        },
        handle: {
            crumb: "selfStudy:breadcrumb.lesson",
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
        // Dynamic breadcrumb is set by the page component using useDynamicBreadcrumb
        // permissions: [lesson.view],
    },
];

export default selfStudyRoutes;
