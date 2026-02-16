/**
 * Acceptance Exams Feature - Routes
 *
 * Route configuration for Exams navigation.
 * New flow: Exams
 * Uses FeatureRouteModule format for the new routing architecture.
 *
 * Permission-controlled routes using acceptanceExamsPermissions config.
 */

import type { RouteConfig } from "@/router/routes.types";

// ============================================================================
// Exams Navigation Routes (New Structure)
// ============================================================================

export const acceptanceExamsRoutes: RouteConfig[] = [
    // Exams List
    {
        path: "exams",
        lazy: () =>
            import("@/features/dashboard/admin/acceptanceExams/pages/exams/pages/main"),
        // permissions: [lesson.viewAny],
        meta: { titleKey: "acceptanceExams:title" },
        handle: { crumb: "acceptanceExams:title" },
    },
];
