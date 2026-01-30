/**
 * Groups Analytics - Routes
 *
 * Route configuration for Groups Analytics.
 * Uses FeatureRouteModule format for the new routing architecture.
 * Permission-controlled routes using groupsPermissions config.
 */

import type { RouteConfig, FeatureRouteModule } from "@/router/routes.types";
import { groupsPermissions } from "@/auth";

const { group } = groupsPermissions;

// ============================================================================
// Groups Analytics Routes
// ============================================================================

const groupsAnalyticsRoutes: RouteConfig[] = [
    {
        index: true,
        lazy: () => import("@/features/groupsAnalytics/pages/GroupsAnalytics"),
        permissions: [group.viewAny],
        meta: { titleKey: "groupsAnalytics:groups.title" },
        handle: { crumb: "groupsAnalytics:groups.title" },
    },
];

// ============================================================================
// Feature Route Module
// ============================================================================

export const groupsAnalyticsManagementRoutes: FeatureRouteModule = {
    id: "groupsAnalytics",
    name: "Groups Analytics",
    basePath: "/dashboard/groups-analytics",
    layout: "dashboard",
    routes: {
        meta: {
            titleKey: "groupsAnalytics:groups.title",
            requiresAuth: true,
        },
        children: groupsAnalyticsRoutes,
    },
};

export default groupsAnalyticsManagementRoutes;
