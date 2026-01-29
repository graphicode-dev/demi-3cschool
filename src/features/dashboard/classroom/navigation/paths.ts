/**
 * Classroom Feature - Path Definitions
 *
 * Centralized path definitions for the classroom feature.
 */

import { registerFeaturePaths } from "@/router/paths.registry";

export const classroomPaths = {
    root: () => "/dashboard/classroom",
    profile: () => "/dashboard/classroom/profile",
    chat: () => "/dashboard/classroom/chat",
    certificates: () => "/dashboard/classroom/certificates",
    reports: () => "/dashboard/classroom/reports",
} as const;

export const classroomManagementPaths = registerFeaturePaths("classroom", {
    root: classroomPaths.root,
    profile: classroomPaths.profile,
    chat: classroomPaths.chat,
    certificates: classroomPaths.certificates,
    reports: classroomPaths.reports,
});

export type ClassroomPaths = typeof classroomPaths;
