import type { RouteConfig } from "@/router/routes.types";
import { AcceptanceExamRouteGuard } from "../components";

/**
 * Acceptance Test feature routes
 * Under /classroom/acceptance-exam
 * Protected by AcceptanceExamRouteGuard:
 * - Redirects to profile if status is "accepted"
 * - Routes user to correct page based on their status (pending/waiting/rejected)
 */

export const acceptanceTestRoutes: RouteConfig[] = [
    {
        path: "acceptance-exam",
        element: <AcceptanceExamRouteGuard />,
        meta: {
            requiresAuth: true,
        },
        children: [
            {
                index: true,
                lazy: () => import("../pages/main"),
                meta: {
                    titleKey: "acceptanceTest:exam.title",
                },
            },
            {
                path: "waiting",
                lazy: () => import("../pages/waiting"),
                meta: {
                    titleKey: "acceptanceTest:waiting.title",
                },
            },
            {
                path: "rejected",
                lazy: () => import("../pages/rejected"),
                meta: {
                    titleKey: "acceptanceTest:rejected.title",
                },
            },
        ],
    },
];

export default acceptanceTestRoutes;
