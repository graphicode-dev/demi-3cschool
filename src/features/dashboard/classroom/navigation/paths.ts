/**
 * Classroom Feature - Path Definitions
 *
 * Centralized path definitions for the classroom feature.
 */

import { registerFeaturePaths } from "@/router/paths.registry";
import { CLASSROOM_PATH } from "./constant";

export const classroomPaths = {
    root: () => CLASSROOM_PATH,
    profile: () => `${CLASSROOM_PATH}/profile`,
    chat: () => `${CLASSROOM_PATH}/chat`,
    certificates: () => `${CLASSROOM_PATH}/certificates`,
    reports: () => `${CLASSROOM_PATH}/reports`,
    acceptanceTest: () => `${CLASSROOM_PATH}/acceptance-exam`,
} as const;

export const classroomManagementPaths = registerFeaturePaths("classroom", {
    root: classroomPaths.root,
    profile: classroomPaths.profile,
    chat: classroomPaths.chat,
    certificates: classroomPaths.certificates,
    reports: classroomPaths.reports,
    acceptanceTest: classroomPaths.acceptanceTest,
});

export type ClassroomPaths = typeof classroomPaths;
