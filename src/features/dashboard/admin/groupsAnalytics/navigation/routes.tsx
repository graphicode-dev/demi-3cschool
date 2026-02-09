/**
 * Groups Analytics - Routes
 *
 * Route configuration for Groups Analytics.
 * Uses FeatureRouteModule format for the new routing architecture.
 * Permission-controlled routes using groupsPermissions config.
 */

import type { RouteConfig } from "@/router/routes.types";

// ============================================================================
// Groups Analytics Routes
// ============================================================================

export const groupsAnalyticsRoutes: RouteConfig[] = [
    {
        path: "groups-analytics",
        lazy: () =>
            import("@/features/dashboard/admin/groupsAnalytics/pages/GroupsAnalytics"),
        // permissions: [group.viewAny],
        meta: { titleKey: "groupsAnalytics:groups.title" },
        handle: { crumb: "groupsAnalytics:groups.title" },
    },
];
