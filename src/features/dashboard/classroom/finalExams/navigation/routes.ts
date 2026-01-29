import type { RouteConfig } from "@/router";

/**
 * Final Exams feature routes
 * These routes are under the classroom dashboard
 */
export const finalExamsRoutes: RouteConfig[] = [
    {
        path: "final-exams",
        lazy: () =>
            import("../pages/main").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "finalExams:title",
            requiresAuth: true,
        },
    },
];

export default finalExamsRoutes;
