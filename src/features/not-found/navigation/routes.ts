/**
 * Not Found Feature - Routes
 *
 * Route configuration for the 404 not found page.
 * Uses the FeatureRouteModule format with catch-all path.
 */

import type { FeatureRouteModule } from "@/router/routes.types";

/**
 * Not Found feature route module
 *
 * Catch-all route that handles any unmatched paths.
 */
export const notFoundRoutes: FeatureRouteModule = {
    id: "not-found",
    name: "Not Found",
    basePath: "*",
    layout: "site",
    routes: {
        lazy: () => import("../pages/NotFoundPage"),
        meta: {
            titleKey: "dashboard:pages.shared.auth.notFound.pageNotFound",
        },
    },
};

export default notFoundRoutes;
