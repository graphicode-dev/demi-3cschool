/**
 * Admin Feature - Route Module
 *
 * Defines routes for the admin feature.
 * Base path: /admin/*
 *
 * Consolidates ALL admin features:
 * - Overview (dashboard home)
 * - Learning (standard & professional)
 * - Groups Management
 * - Groups Analytics
 * - Programs
 * - Sales Subscription
 * - Tickets Management
 * - Settings
 * - Shared features (profile, chat, certificates, reports)
 */

import type { FeatureRouteModule, RouteConfig } from "@/router/routes.types";
import { adminSharedRoutes } from "@/features/dashboard/shared/navigation";
import { ticketsManagementRoutes } from "../ticketsManagement/navigation";
import { communityManagementRoutes } from "../communityManagement/navigation";
import { slotsRoutes } from "../settings/slots/navigation";
import { trainingCentersRoutes } from "../settings/trainingCenters/navigation";

import { programsRoutes } from "../programs/navigation";
import { groupsRoutes } from "../groupsManagement/navigation";
import { gradesRoutes } from "../learning/navigation/routes";
import { overviewRoutes } from "../overview/navigation";
import { resourcesRoutes } from "../resources/navigation/routes";
import { settingsRoutes } from "../settings/navigation/routes";
import { userManagementRoutes } from "../userManagement/navigation/routes";

// ============================================================================
// Admin Shared Routes (profile, chat, certificates, reports)
// ============================================================================

// Shared routes already have relative paths (profile, chat, etc.)
// No need to prefix since basePath is /admin
const adminOnlySharedRoutes: RouteConfig[] = [...adminSharedRoutes];

/**
 * Admin Route Module
 *
 * Consolidates all admin features under /admin/*
 */
export const adminRouteModule: FeatureRouteModule = {
    id: "admin",
    name: "Admin",
    basePath: "/admin",
    layout: "dashboard",
    routes: {
        children: [
            // Overview (dashboard home)
            ...overviewRoutes,
            // Grades (new navigation structure)
            ...gradesRoutes,
            // Programs
            ...programsRoutes,
            // Groups Management
            ...groupsRoutes,
            // Groups Analytics
            // ...groupsAnalyticsRoutes,
            // Resources Management
            ...resourcesRoutes,
            // Tickets Management
            ...ticketsManagementRoutes,
            // Settings SiteMap (placeholder for /settings)
            ...settingsRoutes,
            // Slots (under settings)
            ...slotsRoutes,
            // Training Centers (under settings)
            ...trainingCentersRoutes,
            // User Management
            ...userManagementRoutes,
            // Shared features (profile, chat, certificates, reports)
            ...adminOnlySharedRoutes,
            // Community Management
            ...communityManagementRoutes,
        ],
    },
};

export default adminRouteModule;
