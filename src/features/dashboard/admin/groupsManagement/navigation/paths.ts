/**
 * Groups Management - Path Builders
 *
 * Centralized, type-safe path builders for groups management.
 * Includes Terms, Courses, and Lessons paths.
 *
 * @example
 * ```ts
 * import { groupsPaths } from '@/features/groups/paths';
 *
 * navigate(groupsPaths.groups.list());
 * navigate(groupsPaths.groups.view(courseId));
 * navigate(groupsPaths.lessons.edit(lessonId));
 * ```
 */

import { registerFeaturePaths } from "@/router/paths.registry";
import {
    eligibleStudents,
    eligibleStudentsPaths,
} from "../pages/EligibleStudents/navigation";

// ============================================================================
// Groups Paths
// ============================================================================

const BasePath = "/admin/groups";

export const groupsPaths = {
    regularList: () => `${BasePath}/regular`,
    regularCreate: () => `${BasePath}/regular/create`,
    regularView: (id: string | number = ":id") =>
        `${BasePath}/regular/view/${id}`,
    regularEdit: (id: string | number = ":id") =>
        `${BasePath}/regular/edit/${id}`,
    regularAssign: (id: string | number = ":id") =>
        `${BasePath}/regular/${id}/assign`,
    regularAttendance: (id: string | number = ":id") =>
        `${BasePath}/regular/${id}/attendance`,
    regularInstructor: (id: string | number = ":id") =>
        `${BasePath}/regular/${id}/instructor`,
    regularSessions: (id: string | number = ":id") =>
        `${BasePath}/regular/${id}/sessions`,
    semiPrivateList: () => `${BasePath}/semi-private`,
    semiPrivateCreate: () => `${BasePath}/semi-private/create`,
    semiPrivateView: () => `${BasePath}/semi-private/view/:id`,
    privateList: () => `${BasePath}/private`,
    privateCreate: () => `${BasePath}/private/create`,
    privateView: () => `${BasePath}/private/view/:id`,
    sessionsList: () => `${BasePath}/sessions`,
    eligibleStudents,
} as const;

// ============================================================================
// Combined Groups Management Paths
// ============================================================================

export const groupsManagementPaths = registerFeaturePaths("groupsManagement", {
    // Groups
    groupsList: groupsPaths.regularList,
    regularCreate: groupsPaths.regularCreate,
    regularView: groupsPaths.regularView,
    regularEdit: groupsPaths.regularEdit,
    regularAssign: groupsPaths.regularAssign,
    regularAttendance: groupsPaths.regularAttendance,
    regularInstructor: groupsPaths.regularInstructor,
    regularSessions: groupsPaths.regularSessions,
    semiPrivateList: groupsPaths.semiPrivateList,
    semiPrivateCreate: groupsPaths.semiPrivateCreate,
    semiPrivateView: groupsPaths.semiPrivateView,
    privateList: groupsPaths.privateList,
    privateCreate: groupsPaths.privateCreate,
    privateView: groupsPaths.privateView,
    sessionsList: groupsPaths.sessionsList,
    ...eligibleStudentsPaths,
});

// ============================================================================
// Type Exports
// ============================================================================

export type GroupsPaths = typeof groupsPaths;
export type GroupsManagementPaths = typeof groupsManagementPaths;
