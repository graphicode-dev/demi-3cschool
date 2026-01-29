/**
 * Classroom Feature - Route Module
 *
 * Defines routes for the classroom feature (student/teacher portal).
 * Base path: /dashboard/classroom/*
 *
 * Uses shared features from dashboard/shared.
 */

import type { FeatureRouteModule } from "@/router/routes.types";
import { classroomSharedRoutes } from "@/features/dashboard/shared/navigation";
import { selfStudyRoutes } from "../selfStudy/navigation";

/**
 * Classroom Route Module
 */
export const classroomRouteModule: FeatureRouteModule = {
    id: "classroom",
    name: "Classroom",
    basePath: "/dashboard/classroom",
    layout: "dashboard",
    routes: {
        children: [
            // Shared features (profile, chat, certificates, reports)
            ...classroomSharedRoutes,
            // Self Study feature
            ...selfStudyRoutes,
        ],
    },
};

export default classroomRouteModule;
