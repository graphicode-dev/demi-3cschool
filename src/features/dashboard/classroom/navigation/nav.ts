/**
 * Classroom Feature - Navigation Module
 *
 * Navigation configuration for the classroom feature (student/teacher portal).
 * Uses shared navigation items from dashboard/shared.
 */

import type { FeatureNavModule } from "@/navigation/nav.types";
import { classroomSharedNavItems } from "@/features/dashboard/shared/navigation";
import { selfStudyNavItem } from "../selfStudy/navigation";
import { physicalSessionsNavItem } from "../physicalSessions/navigation";

export const classroomNav: FeatureNavModule = {
    featureId: "classroom",
    section: "Classroom",
    order: 20,
    items: [
        ...classroomSharedNavItems,
        selfStudyNavItem,
        physicalSessionsNavItem,
    ],
};

export default classroomNav;
