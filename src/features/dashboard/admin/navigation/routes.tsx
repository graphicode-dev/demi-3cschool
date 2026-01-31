/**
 * Admin Feature - Route Module
 *
 * Defines routes for the admin feature.
 * Base path: /dashboard/admin/*
 *
 * Uses shared features from dashboard/shared.
 * Admin-only features (settings) are defined here.
 */

import { Navigate } from "react-router-dom";
import type { FeatureRouteModule } from "@/router/routes.types";
import { adminSharedRoutes } from "@/features/dashboard/shared/navigation";
import { settingsRoutes } from "../settings/navigation";
import { ticketsManagementRoutes } from "../ticketsManagement/navigation";

/**
 * Admin Route Module
 */
export const adminRouteModule: FeatureRouteModule = {
    id: "admin",
    name: "Admin",
    basePath: "/admin",
    layout: "dashboard",
    routes: {
        children: [
            // Index redirect to overview (dashboard root)
            {
                index: true,
                element: <Navigate to="/dashboard" replace />,
            },
            // Shared features (profile, chat, certificates, reports)
            ...adminSharedRoutes,
            // Admin-only features
            ...settingsRoutes,
            // Tickets Management feature
            ...ticketsManagementRoutes,
        ],
    },
};

export default adminRouteModule;
