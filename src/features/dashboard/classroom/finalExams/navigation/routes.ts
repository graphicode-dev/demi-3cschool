import type { RouteConfig } from "@/router";

/**
 * Final Exams feature routes
 * These routes are under the classroom dashboard
 *
 * Routes:
 * - /final-exams - List of all exams
 * - /final-exams/:examId/take - Take an exam (pre-exam + exam taking)
 * - /final-exams/:examId/result - View exam result
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
    {
        path: "final-exams/:examId/take",
        lazy: () =>
            import("../pages/TakeExam").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "finalExams:exam.title",
            requiresAuth: true,
        },
    },
    {
        path: "final-exams/:examId/result",
        lazy: () =>
            import("../pages/ExamResult").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "finalExams:result.title",
            requiresAuth: true,
        },
    },
];

export default finalExamsRoutes;
