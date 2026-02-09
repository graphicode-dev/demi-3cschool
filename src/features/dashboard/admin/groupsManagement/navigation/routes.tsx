/**
 * Groups Management - Routes
 *
 * Route configuration for Groups.
 * Uses FeatureRouteModule format for the new routing architecture.
 * Permission-controlled routes using groupsPermissions config.
 *
 * New structure: /admin/groups/grades/:gradeId/levels/:levelId/group
 */

import { Navigate } from "react-router-dom";
import type { RouteConfig } from "@/router/routes.types";

// ============================================================================
// Groups Routes (New Grade/Level Structure)
// ============================================================================

export const groupsRoutes: RouteConfig[] = [
    // Redirect /groups to /groups/grades
    {
        path: "groups",
        element: <Navigate to="groups/grades" replace />,
    },
    // Grades List
    {
        path: "groups/grades",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/grades/GradesList"),
        // permissions: [group.viewAny],
        meta: { titleKey: "groupsManagement:groups.grades.title" },
        handle: { crumb: "groupsManagement:groups.grades.title" },
    },
    // Grade SiteMap (placeholder for /groups/grades/:gradeId)
    {
        path: "groups/grades/:gradeId",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/site_map/GradeGroupSiteMap"),
        meta: { titleKey: "groupsManagement:sitemap.grade.title" },
        handle: { crumb: "groupsManagement:breadcrumb.grade" },
    },
    // Levels List for a Grade
    {
        path: "groups/grades/:gradeId/levels",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/grades/LevelsList"),
        // permissions: [group.viewAny],
        meta: { titleKey: "groupsManagement:groups.levels.title" },
        handle: { crumb: "groupsManagement:groups.levels.title" },
    },
    // Level SiteMap (placeholder for /groups/grades/:gradeId/levels/:levelId)
    {
        path: "groups/grades/:gradeId/levels/:levelId",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/site_map/LevelGroupSiteMap"),
        meta: { titleKey: "groupsManagement:sitemap.level.title" },
        handle: { crumb: "groupsManagement:breadcrumb.level" },
    },
    // Groups List for a Level
    {
        path: "groups/grades/:gradeId/levels/:levelId/group",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/list"),
        // permissions: [group.viewAny],
        meta: { titleKey: "groupsManagement:groups.regularListBreadcrumb" },
        handle: { crumb: "groupsManagement:groups.regularListBreadcrumb" },
    },
    // Create Group for a Level
    {
        path: "groups/grades/:gradeId/levels/:levelId/group/create",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/create"),
        // permissions: [group.create],
        meta: { titleKey: "groupsManagement:groups.form.create.title" },
        handle: { crumb: "groupsManagement:groups.form.create.title" },
    },
    // Group View SiteMap (placeholder for /groups/grades/:gradeId/levels/:levelId/group/view)
    {
        path: "groups/grades/:gradeId/levels/:levelId/group/view",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/site_map/GroupSiteMap"),
        meta: { titleKey: "groupsManagement:sitemap.group.viewTitle" },
        handle: { crumb: "groupsManagement:groups.form.view.title" },
    },
    // View Group
    {
        path: "groups/grades/:gradeId/levels/:levelId/group/view/:id",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/view"),
        // permissions: [group.view],
        meta: { titleKey: "groupsManagement:groups.form.view.title" },
        handle: { crumb: "groupsManagement:groups.form.view.title" },
    },
    // Group Edit SiteMap (placeholder for /groups/grades/:gradeId/levels/:levelId/group/edit)
    {
        path: "groups/grades/:gradeId/levels/:levelId/group/edit",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/site_map/GroupSiteMap"),
        meta: { titleKey: "groupsManagement:sitemap.group.editTitle" },
        handle: { crumb: "groupsManagement:groups.edit.title" },
    },
    // Edit Group
    {
        path: "groups/grades/:gradeId/levels/:levelId/group/edit/:id",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/edit"),
        // permissions: [group.update],
        meta: { titleKey: "groupsManagement:groups.edit.title" },
        handle: { crumb: "groupsManagement:groups.edit.title" },
    },
    // Assign Students to Group
    {
        path: "groups/grades/:gradeId/levels/:levelId/group/:id/assign",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/assign"),
        // permissions: [group.update],
        meta: { titleKey: "groupsManagement:groups.assignStudent.title" },
        handle: { crumb: "groupsManagement:groups.assignStudent.title" },
    },
    // Group Attendance
    {
        path: "groups/grades/:gradeId/levels/:levelId/group/:id/attendance",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/attendance"),
        // permissions: [studentAttendance.viewAny],
        meta: { titleKey: "groupsManagement:groups.attendance.title" },
        handle: { crumb: "groupsManagement:groups.attendance.title" },
    },
    // Attendance Session SiteMap (placeholder for /groups/grades/:gradeId/levels/:levelId/group/:id/attendance/session)
    {
        path: "groups/grades/:gradeId/levels/:levelId/group/:id/attendance/session",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/site_map/GroupSiteMap"),
        meta: {
            titleKey: "groupsManagement:sitemap.group.attendanceSessionTitle",
        },
        handle: { crumb: "groupsManagement:groups.sessionAttendance.title" },
    },
    // Session Attendance Details
    {
        path: "groups/grades/:gradeId/levels/:levelId/group/:id/attendance/session/:sessionId",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/sessionAttendance"),
        // permissions: [studentAttendance.viewAny],
        meta: { titleKey: "groupsManagement:groups.sessionAttendance.title" },
        handle: { crumb: "groupsManagement:groups.sessionAttendance.title" },
    },
    // Attendance Audit Log
    {
        path: "groups/grades/:gradeId/levels/:levelId/group/:id/attendance/audit-log",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/attendanceAuditLog"),
        // permissions: [studentAttendance.viewAny],
        meta: { titleKey: "groupsManagement:groups.attendanceAuditLog.title" },
        handle: { crumb: "groupsManagement:groups.attendanceAuditLog.title" },
    },
    // Assign Primary Teacher (must be before instructor route)
    {
        path: "groups/grades/:gradeId/levels/:levelId/group/:id/instructor/assign-teacher",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/assignTeacher"),
        // permissions: [group.update],
        meta: { titleKey: "groupsManagement:groups.assignTeacher.title" },
        handle: { crumb: "groupsManagement:groups.assignTeacher.title" },
    },
    // Group Instructor
    {
        path: "groups/grades/:gradeId/levels/:levelId/group/:id/instructor",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/instructor"),
        // permissions: [group.update],
        meta: { titleKey: "groupsManagement:groups.instructor.title" },
        handle: { crumb: "groupsManagement:groups.instructor.title" },
    },

    // Teacher Session Management
    {
        path: "groups/grades/:gradeId/levels/:levelId/group/:id/teacher-management",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/instructor"),
        // permissions: [group.update],
        meta: { titleKey: "groupsManagement:teacherManagement.title" },
        handle: { crumb: "groupsManagement:teacherManagement.title" },
    },

    // Reassign Primary Teacher
    {
        path: "groups/grades/:gradeId/levels/:levelId/group/:id/teacher-management/reassign",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/reassignTeacher"),
        // permissions: [group.update],
        meta: { titleKey: "groupsManagement:groups.reassignTeacher.title" },
        handle: { crumb: "groupsManagement:groups.reassignTeacher.title" },
    },

    // Teacher Session SiteMap (placeholder for /groups/grades/:gradeId/levels/:levelId/group/:id/teacher-management/session)
    {
        path: "groups/grades/:gradeId/levels/:levelId/group/:id/teacher-management/session",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/site_map/GroupSiteMap"),
        meta: {
            titleKey: "groupsManagement:sitemap.group.teacherSessionTitle",
        },
        handle: { crumb: "groupsManagement:groups.changeSessionTeacher.title" },
    },
    // Change Session Teacher
    {
        path: "groups/grades/:gradeId/levels/:levelId/group/:id/teacher-management/session/:sessionId/change-teacher",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/changeSessionTeacher"),
        // permissions: [group.update],
        meta: {
            titleKey: "groupsManagement:groups.changeSessionTeacher.title",
        },
        handle: { crumb: "groupsManagement:groups.changeSessionTeacher.title" },
    },
    // Group Sessions
    {
        path: "groups/grades/:gradeId/levels/:levelId/group/:id/sessions",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/sessions"),
        // permissions: [groupSession.viewAny],
        meta: { titleKey: "groupsManagement:groups.sessions.title" },
        handle: { crumb: "groupsManagement:groups.sessions.title" },
    },
    // Group Final Level Quiz
    {
        path: "groups/grades/:gradeId/levels/:levelId/group/:id/final-quiz",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/finalLevelQuiz"),
        // permissions: [group.view],
        meta: { titleKey: "groupsManagement:groups.finalQuiz.title" },
        handle: { crumb: "groupsManagement:groups.finalQuiz.title" },
    },
];
