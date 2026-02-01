/**
 * Classroom Feature - Route Module
 *
 * Defines routes for the classroom feature (student/teacher portal).
 * Base path: /classroom/*
 *
 * Uses shared features from dashboard/shared.
 */

import { Navigate } from "react-router-dom";
import type { FeatureRouteModule } from "@/router/routes.types";
import { classroomSharedRoutes } from "@/features/dashboard/shared/navigation";
import { selfStudyRoutes } from "../selfStudy/navigation";
import { physicalSessionsRoutes } from "../physicalSessions/navigation";
import { virtualSessionsRoutes } from "../virtualSessions/navigation";
import { acceptanceTestRoutes } from "../acceptanceTest/navigation";
import { projectsRoutes } from "../projects/navigation";
import { finalExamsRoutes } from "../finalExams/navigation";
import { myScheduleRoutes } from "../mySchedule/navigation";
import { supportHelpRoutes } from "../ticketsManagement/pages/supportHelp/navigation";
import { resourcesRoutes } from "../resources/navigation";
import { enrollmentsGroupRoutes } from "../enrollmentsGroup/navigation";
import { communityRoutes } from "../community/navigation";
import { classroomPaths } from "./paths";
import { CLASSROOM_PATH } from "./constant";

/**
 * Classroom Route Module
 */
export const classroomRouteModule: FeatureRouteModule = {
    id: "classroom",
    name: "Classroom",
    basePath: CLASSROOM_PATH,
    layout: "dashboard",
    routes: {
        children: [
            // Index redirect to profile
            {
                index: true,
                element: <Navigate to={classroomPaths.profile()} replace />,
            },
            // Shared features (profile, chat, certificates, reports)
            ...classroomSharedRoutes,
            // Self Study feature
            ...selfStudyRoutes,
            // Physical Sessions feature
            ...physicalSessionsRoutes,
            // Virtual Sessions feature
            ...virtualSessionsRoutes,
            // Acceptance Test feature
            ...acceptanceTestRoutes,
            // Projects feature
            ...projectsRoutes,
            // Final Exams feature
            ...finalExamsRoutes,
            // My Schedule feature
            ...myScheduleRoutes,
            // Support Help feature (student-facing)
            ...supportHelpRoutes,
            // Learning Resources feature
            ...resourcesRoutes,
            // Enrollments Group feature
            ...enrollmentsGroupRoutes,
            // Community feature
            ...communityRoutes,
        ],
    },
};

export default classroomRouteModule;
