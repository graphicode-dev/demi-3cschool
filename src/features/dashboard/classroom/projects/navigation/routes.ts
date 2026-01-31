import type { RouteConfig } from "@/router";

/**
 * Projects feature routes
 * These routes are under the classroom dashboard
 */
export const projectsRoutes: RouteConfig[] = [
    {
        path: "projects",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "projects:title",
            requiresAuth: true,
        },
    },
    {
        path: "projects/homework/:projectId",
        lazy: () =>
            import("../pages/HomeworkFile").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "projects:homeworkFile.title",
            requiresAuth: true,
        },
    },
    {
        path: "projects/results/:projectId",
        lazy: () =>
            import("../pages/HomeworkResult").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "projects:result.title",
            requiresAuth: true,
        },
    },
    {
        path: "projects/submit/:projectId",
        lazy: () =>
            import("../pages/SubmitAssignment").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "projects:submit.title",
            requiresAuth: true,
        },
    },
];

export default projectsRoutes;
