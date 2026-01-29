/**
 * Admin Feature - Route Module
 *
 * Defines routes for the admin feature.
 * Base path: /dashboard/admin/*
 *
 * Uses shared features from dashboard/shared.
 * Admin-only features (settings) are defined here.
 */

import type { FeatureRouteModule } from "@/router/routes.types";
import { adminSharedRoutes } from "@/features/dashboard/shared/navigation";
import { settingsRoutes } from "../settings/navigation";

/**
 * Admin Route Module
 */
export const adminRouteModule: FeatureRouteModule = {
    id: "admin",
    name: "Admin",
    basePath: "/dashboard/admin",
    layout: "dashboard",
    routes: {
        children: [
            // Shared features (profile, chat, certificates, reports)
            ...adminSharedRoutes,
            // Admin-only features
            ...settingsRoutes,
        ],
    },
};

export default adminRouteModule;
