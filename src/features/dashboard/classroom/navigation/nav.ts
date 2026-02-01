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
import { virtualSessionsNavItem } from "../virtualSessions/navigation";
import { acceptanceTestNavItem } from "../acceptanceTest/navigation";
import { projectsNavItem } from "../projects/navigation";
import { finalExamsNavItem } from "../finalExams/navigation";
import { myScheduleNavItem } from "../mySchedule/navigation";
import { supportHelpNavItem } from "../ticketsManagement/pages/supportHelp/navigation";
import { resourcesNavItem } from "../resources/navigation";
import { enrollmentsGroupNavItem } from "../enrollmentsGroup/navigation";
import { communityNavItem } from "../community/navigation";

export const classroomNav: FeatureNavModule = {
    featureId: "classroom",
    section: "Classroom",
    order: 20,

    items: [
        ...classroomSharedNavItems,
        acceptanceTestNavItem,
        enrollmentsGroupNavItem,
        selfStudyNavItem,
        physicalSessionsNavItem,
        virtualSessionsNavItem,
        projectsNavItem,
        finalExamsNavItem,
        myScheduleNavItem,
        supportHelpNavItem,
        resourcesNavItem,
        communityNavItem,
    ],
};

export default classroomNav;
