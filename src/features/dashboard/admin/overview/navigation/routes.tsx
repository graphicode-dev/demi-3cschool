/**
 * Overview Management - Routes
 *
 * Route configuration for Overview.
 * Uses FeatureRouteModule format for the new routing architecture.
 * Permission-controlled routes using dashboardPermissions config.
 */

import type { RouteConfig, FeatureRouteModule } from "@/router/routes.types";
import { dashboardPermissions } from "@/auth/permission.config";

// ============================================================================
// Overview Routes
// ============================================================================

const overviewRoutes: RouteConfig[] = [
    {
        index: true,
        lazy: () => import("@/features/dashboard/admin/overview/pages/Dashboard"),
        permissions: [dashboardPermissions.view],
        meta: { titleKey: "common:dashboard" },
        handle: { crumb: "common:dashboard" },
    },
];

// ============================================================================
// Feature Route Module
// ============================================================================

export const overviewManagementRoutes: FeatureRouteModule = {
    id: "overviewManagement",
    name: "Overview Management",
    basePath: "/dashboard",
    layout: "dashboard",
    routes: {
        meta: {
            titleKey: "common:dashboard",
            requiresAuth: true,
        },
        children: overviewRoutes,
    },
};

export default overviewManagementRoutes;
