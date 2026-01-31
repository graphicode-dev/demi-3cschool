import type { RouteConfig } from "@/router";
import { learningPermissions } from "@/auth";

const { levelQuiz } = learningPermissions;

/**
 * Final Exams feature routes
 * These routes are under the classroom dashboard
 * Permission-controlled using learningPermissions config.
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
        permissions: [levelQuiz.viewAny],
    },
];

export default finalExamsRoutes;
