/**
 * Overview Management - Routes
 *
 * Route configuration for Overview.
 * Uses FeatureRouteModule format for the new routing architecture.
 * Permission-controlled routes using dashboardPermissions config.
 */

import type { RouteConfig } from "@/router/routes.types";
import { Navigate } from "react-router-dom";

// ============================================================================
// Overview Routes
// ============================================================================

export const overviewRoutes: RouteConfig[] = [
    {
        index: true,
        element: <Navigate to="overview" replace />,
    },
    {
        path: "overview",
        lazy: () =>
            import("@/features/dashboard/admin/overview/pages/Dashboard"),
        // permissions: [dashboardPermissions.view],
        meta: { titleKey: "common:dashboard" },
        handle: { crumb: "common:dashboard" },
    },
];
