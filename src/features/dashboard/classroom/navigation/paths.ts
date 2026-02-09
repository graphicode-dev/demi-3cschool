/**
 * Classroom Feature - Path Definitions
 *
 * Centralized path definitions for the classroom feature.
 */

import { registerFeaturePaths } from "@/router/paths.registry";
import { CLASSROOM_PATH } from "./constant";
import { acceptanceTestPaths } from "../acceptanceTest/navigation";
import { ticketsPaths } from "../ticketsManagement/navigation";
import { communityPaths } from "../community";
import { enrollmentsGroupPaths } from "../enrollmentsGroup/navigation/paths";
import { finalExamsPaths } from "../finalExams";
import { mySchedulePaths } from "../mySchedule/navigation/paths";
import { physicalSessionsPaths } from "../physicalSessions/navigation";
import { projectsPaths } from "../projects/navigation/paths";
import { resourcesPaths } from "../resources";
import { selfStudyPaths } from "../selfStudy";
import { virtualSessionsPaths } from "../virtualSessions";

export const classroomPaths = {
    root: () => CLASSROOM_PATH,
    profile: () => `${CLASSROOM_PATH}/profile`,
    chat: () => `${CLASSROOM_PATH}/chat`,
    certificates: () => `${CLASSROOM_PATH}/certificates`,
    reports: () => `${CLASSROOM_PATH}/reports`,
    communityPaths,
    enrollmentsGroupPaths,
    acceptanceTestPaths,
    ticketsPaths,
    finalExamsPaths,
    mySchedulePaths,
    physicalSessionsPaths,
    projectsPaths,
    resourcesPaths,
    selfStudyPaths,
    virtualSessionsPaths,
} as const;

export const classroomManagementPaths = registerFeaturePaths("classroom", {
    root: classroomPaths.root,
    profile: classroomPaths.profile,
    chat: classroomPaths.chat,
    certificates: classroomPaths.certificates,
    reports: classroomPaths.reports,
});

export type ClassroomPaths = typeof classroomPaths;
