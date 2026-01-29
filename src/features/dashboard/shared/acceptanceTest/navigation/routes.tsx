import type { FeatureRouteModule } from "@/router/routes.types";

/**
 * Acceptance Test feature routes
 * These are public routes for the acceptance exam flow (not under dashboard layout)
 */
export const acceptanceTestRoutes: FeatureRouteModule = {
    id: "acceptanceTest",
    name: "Acceptance Test",
    basePath: "/acceptance-exam",
    layout: "none",
    routes: {
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
};

export default acceptanceTestRoutes;
