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

// ============================================================================
// Groups Paths
// ============================================================================

const BasePath = "/admin/groups";

export const groupsPaths = {
    // New Grade/Level structure
    gradesList: () => `${BasePath}/grades`,
    levelsList: (gradeId: string | number = ":gradeId") =>
        `${BasePath}/grades/${gradeId}/levels`,
    regularList: (
        gradeId: string | number = ":gradeId",
        levelId: string | number = ":levelId"
    ) => `${BasePath}/grades/${gradeId}/levels/${levelId}/regular`,
    regularCreate: (
        gradeId: string | number = ":gradeId",
        levelId: string | number = ":levelId"
    ) => `${BasePath}/grades/${gradeId}/levels/${levelId}/regular/create`,
    regularView: (
        gradeId: string | number = ":gradeId",
        levelId: string | number = ":levelId",
        id: string | number = ":id"
    ) => `${BasePath}/grades/${gradeId}/levels/${levelId}/regular/view/${id}`,
    regularEdit: (
        gradeId: string | number = ":gradeId",
        levelId: string | number = ":levelId",
        id: string | number = ":id"
    ) => `${BasePath}/grades/${gradeId}/levels/${levelId}/regular/edit/${id}`,
    regularAssign: (
        gradeId: string | number = ":gradeId",
        levelId: string | number = ":levelId",
        id: string | number = ":id"
    ) => `${BasePath}/grades/${gradeId}/levels/${levelId}/regular/${id}/assign`,
    regularAttendance: (
        gradeId: string | number = ":gradeId",
        levelId: string | number = ":levelId",
        id: string | number = ":id"
    ) =>
        `${BasePath}/grades/${gradeId}/levels/${levelId}/regular/${id}/attendance`,
    regularInstructor: (
        gradeId: string | number = ":gradeId",
        levelId: string | number = ":levelId",
        id: string | number = ":id"
    ) =>
        `${BasePath}/grades/${gradeId}/levels/${levelId}/regular/${id}/instructor`,
    regularSessions: (
        gradeId: string | number = ":gradeId",
        levelId: string | number = ":levelId",
        id: string | number = ":id"
    ) =>
        `${BasePath}/grades/${gradeId}/levels/${levelId}/regular/${id}/sessions`,
    semiPrivateList: () => `${BasePath}/semi-private`,
    semiPrivateCreate: () => `${BasePath}/semi-private/create`,
    semiPrivateView: () => `${BasePath}/semi-private/view/:id`,
    privateList: () => `${BasePath}/private`,
    privateCreate: () => `${BasePath}/private/create`,
    privateView: () => `${BasePath}/private/view/:id`,
    sessionsList: () => `${BasePath}/sessions`,
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
});

// ============================================================================
// Type Exports
// ============================================================================

export type GroupsPaths = typeof groupsPaths;
export type GroupsManagementPaths = typeof groupsManagementPaths;
