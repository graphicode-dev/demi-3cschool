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
    ) => `${BasePath}/grades/${gradeId}/levels/${levelId}/group`,
    regularCreate: (
        gradeId: string | number = ":gradeId",
        levelId: string | number = ":levelId"
    ) => `${BasePath}/grades/${gradeId}/levels/${levelId}/group/create`,
    regularView: (
        gradeId: string | number = ":gradeId",
        levelId: string | number = ":levelId",
        id: string | number = ":id"
    ) => `${BasePath}/grades/${gradeId}/levels/${levelId}/group/view/${id}`,
    regularEdit: (
        gradeId: string | number = ":gradeId",
        levelId: string | number = ":levelId",
        id: string | number = ":id"
    ) => `${BasePath}/grades/${gradeId}/levels/${levelId}/group/edit/${id}`,
    regularAssign: (
        gradeId: string | number = ":gradeId",
        levelId: string | number = ":levelId",
        id: string | number = ":id"
    ) => `${BasePath}/grades/${gradeId}/levels/${levelId}/group/${id}/assign`,
    regularAttendance: (
        gradeId: string | number = ":gradeId",
        levelId: string | number = ":levelId",
        id: string | number = ":id"
    ) =>
        `${BasePath}/grades/${gradeId}/levels/${levelId}/group/${id}/attendance`,
    regularInstructor: (
        gradeId: string | number = ":gradeId",
        levelId: string | number = ":levelId",
        id: string | number = ":id"
    ) =>
        `${BasePath}/grades/${gradeId}/levels/${levelId}/group/${id}/instructor`,
    regularSessions: (
        gradeId: string | number = ":gradeId",
        levelId: string | number = ":levelId",
        id: string | number = ":id"
    ) => `${BasePath}/grades/${gradeId}/levels/${levelId}/group/${id}/sessions`,
    regularFinalQuiz: (
        gradeId: string | number = ":gradeId",
        levelId: string | number = ":levelId",
        id: string | number = ":id"
    ) =>
        `${BasePath}/grades/${gradeId}/levels/${levelId}/group/${id}/final-quiz`,
    regularAssignTeacher: (
        gradeId: string | number = ":gradeId",
        levelId: string | number = ":levelId",
        id: string | number = ":id"
    ) =>
        `${BasePath}/grades/${gradeId}/levels/${levelId}/group/${id}/instructor/assign-teacher`,
    teacherManagement: (
        gradeId: string | number = ":gradeId",
        levelId: string | number = ":levelId",
        id: string | number = ":id"
    ) =>
        `${BasePath}/grades/${gradeId}/levels/${levelId}/group/${id}/teacher-management`,
    reassignTeacher: (
        gradeId: string | number = ":gradeId",
        levelId: string | number = ":levelId",
        id: string | number = ":id"
    ) =>
        `${BasePath}/grades/${gradeId}/levels/${levelId}/group/${id}/teacher-management/reassign`,
    changeSessionTeacher: (
        gradeId: string | number = ":gradeId",
        levelId: string | number = ":levelId",
        id: string | number = ":id",
        sessionId: string | number = ":sessionId"
    ) =>
        `${BasePath}/grades/${gradeId}/levels/${levelId}/group/${id}/teacher-management/session/${sessionId}/change-teacher`,
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
    regularFinalQuiz: groupsPaths.regularFinalQuiz,
    regularAssignTeacher: groupsPaths.regularAssignTeacher,
    teacherManagement: groupsPaths.teacherManagement,
    reassignTeacher: groupsPaths.reassignTeacher,
    changeSessionTeacher: groupsPaths.changeSessionTeacher,
    sessionsList: groupsPaths.sessionsList,
});

// ============================================================================
// Type Exports
// ============================================================================

export type GroupsPaths = typeof groupsPaths;
export type GroupsManagementPaths = typeof groupsManagementPaths;
