/**
 * Learning Resources Feature - Routes
 *
 * Route configuration for the resources feature.
 */

import type { RouteConfig } from "@/router";

/**
 * Resources routes for embedding in classroom routes
 */
export const resourcesRoutes: RouteConfig[] = [
    {
        path: "resources",
        lazy: () =>
            import("../pages/ResourcesPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "resources:resources.pageTitle",
            requiresAuth: true,
        },
    },
    {
        path: "resources/:sessionId",
        lazy: () =>
            import("../pages/SessionResourcesPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            titleKey: "resources:resources.pageTitle",
            requiresAuth: true,
        },
    },
];

export default resourcesRoutes;
