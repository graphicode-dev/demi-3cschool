/**
 * Site - Routes
 *
 * Route configuration for public site pages.
 * Uses FeatureRouteModule format for the new routing architecture.
 */

import type { RouteConfig, FeatureRouteModule } from "@/router/routes.types";

const siteRoutes: RouteConfig[] = [
    {
        index: true,
        lazy: () => import("@/features/landing/pages/LandingPage"),
        meta: { titleKey: "landing:landing.meta.home.title" },
    },
];

export const siteManagementRoutes: FeatureRouteModule = {
    id: "site",
    name: "Public Site",
    basePath: "",
    layout: "site",
    routes: {
        meta: {
            title: "Site",
            requiresAuth: false,
        },
        children: siteRoutes,
    },
};

export default siteManagementRoutes;
