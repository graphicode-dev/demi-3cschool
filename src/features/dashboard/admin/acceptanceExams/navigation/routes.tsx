/**
 * Acceptance Exams Feature - Routes
 *
 * Route configuration for Acceptance Exams navigation.
 * Nests exams and submissions as children under acceptance-exams.
 * Uses FeatureRouteModule format for the new routing architecture.
 *
 * Permission-controlled routes using acceptanceExamsPermissions config.
 */

import type { RouteConfig } from "@/router/routes.types";
import { acceptanceExamsRoutes as examsRoutes } from "../pages/exams/navigation/routes";
import { submissionsRoutes } from "../pages/submissions/navigation/routes";

// ============================================================================
// Acceptance Exams Navigation Routes (New Structure)
// ============================================================================

export const acceptanceExamsRoutes: RouteConfig[] = [
    {
        path: "acceptance-exams",
        children: [...examsRoutes, ...submissionsRoutes],
        meta: { titleKey: "acceptanceExams:title" },
        handle: { crumb: "acceptanceExams:title" },
    },
];
