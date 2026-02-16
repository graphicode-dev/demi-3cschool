/**
 * Submissions Feature - Routes
 *
 * Route configuration for Submissions navigation.
 * New flow: Submissions
 * Uses FeatureRouteModule format for the new routing architecture.
 *
 * Permission-controlled routes using acceptanceExamsPermissions config.
 */

import type { RouteConfig } from "@/router/routes.types";

// ============================================================================
// Submissions Navigation Routes (New Structure)
// ============================================================================

export const submissionsRoutes: RouteConfig[] = [
    // Submissions List
    {
        path: "submissions",
        lazy: () =>
            import("@/features/dashboard/admin/acceptanceExams/pages/submissions/pages/main"),
        // permissions: [lesson.viewAny],
        meta: { titleKey: "acceptanceExams:submissions.navTitle" },
        handle: { crumb: "acceptanceExams:submissions.navTitle" },
    },
];
