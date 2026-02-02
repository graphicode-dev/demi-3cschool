/**
 * Programs Management - Routes
 *
 * Route configuration for Programs.
 * Uses FeatureRouteModule format for the new routing architecture.
 * Permission-controlled routes using learningPermissions config.
 */

import type { RouteConfig, FeatureRouteModule } from "@/router/routes.types";
import { learningPermissions } from "@/auth";

const { course } = learningPermissions;

// ============================================================================
// Programs Routes
// ============================================================================

const programsRoutes: RouteConfig[] = [
    {
        index: true,
        lazy: () =>
            import("@/features/dashboard/admin/programs/pages/Programs"),
        // permissions: [course.viewAny],
        meta: { titleKey: "programs:programs.title" },
        handle: { crumb: "programs:programs.title" },
    },
];

// ============================================================================
// Feature Route Module
// ============================================================================

export const programsManagementRoutes: FeatureRouteModule = {
    id: "programsManagement",
    name: "Programs Management",
    basePath: "/admin/programs",
    layout: "dashboard",
    routes: {
        meta: {
            titleKey: "programs:programs.title",
            requiresAuth: true,
        },
        children: programsRoutes,
    },
};

export default programsManagementRoutes;
