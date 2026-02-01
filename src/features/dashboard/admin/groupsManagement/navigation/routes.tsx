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
import type { RouteConfig, FeatureRouteModule } from "@/router/routes.types";
import { groupsPermissions } from "@/auth";

const { group, groupSession, studentAttendance } = groupsPermissions;

// ============================================================================
// Groups Routes (New Grade/Level Structure)
// ============================================================================

const groupsRoutes: RouteConfig[] = [
    // Redirect to grades list
    {
        index: true,
        element: <Navigate to="grades" replace />,
    },
    // Grades List
    {
        path: "grades",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/grades/GradesList"),
        permissions: [group.viewAny],
        meta: { titleKey: "groupsManagement:groups.grades.title" },
        handle: { crumb: "groupsManagement:groups.grades.title" },
    },
    // Levels List for a Grade
    {
        path: "grades/:gradeId/levels",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/grades/LevelsList"),
        permissions: [group.viewAny],
        meta: { titleKey: "groupsManagement:groups.levels.title" },
        handle: { crumb: "groupsManagement:groups.levels.title" },
    },
    // Groups List for a Level
    {
        path: "grades/:gradeId/levels/:levelId/group",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/list"),
        permissions: [group.viewAny],
        meta: { titleKey: "groupsManagement:groups.regularListBreadcrumb" },
        handle: { crumb: "groupsManagement:groups.regularListBreadcrumb" },
    },
    // Create Group for a Level
    {
        path: "grades/:gradeId/levels/:levelId/group/create",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/create"),
        permissions: [group.create],
        meta: { titleKey: "groupsManagement:groups.form.create.title" },
        handle: { crumb: "groupsManagement:groups.form.create.title" },
    },
    // View Group
    {
        path: "grades/:gradeId/levels/:levelId/group/view/:id",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/view"),
        permissions: [group.view],
        meta: { titleKey: "groupsManagement:groups.form.view.title" },
        handle: { crumb: "groupsManagement:groups.form.view.title" },
    },
    // Edit Group
    {
        path: "grades/:gradeId/levels/:levelId/group/edit/:id",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/edit"),
        permissions: [group.update],
        meta: { titleKey: "groupsManagement:groups.edit.title" },
        handle: { crumb: "groupsManagement:groups.edit.title" },
    },
    // Assign Students to Group
    {
        path: "grades/:gradeId/levels/:levelId/group/:id/assign",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/assign"),
        permissions: [group.update],
        meta: { titleKey: "groupsManagement:groups.assignStudent.title" },
        handle: { crumb: "groupsManagement:groups.assignStudent.title" },
    },
    // Group Attendance
    {
        path: "grades/:gradeId/levels/:levelId/group/:id/attendance",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/attendance"),
        permissions: [studentAttendance.viewAny],
        meta: { titleKey: "groupsManagement:groups.attendance.title" },
        handle: { crumb: "groupsManagement:groups.attendance.title" },
    },
    // Group Instructor
    {
        path: "grades/:gradeId/levels/:levelId/group/:id/instructor",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/instructor"),
        permissions: [group.update],
        meta: { titleKey: "groupsManagement:groups.instructor.title" },
        handle: { crumb: "groupsManagement:groups.instructor.title" },
    },
    // Group Sessions
    {
        path: "grades/:gradeId/levels/:levelId/group/:id/sessions",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/sessions"),
        permissions: [groupSession.viewAny],
        meta: { titleKey: "groupsManagement:groups.sessions.title" },
        handle: { crumb: "groupsManagement:groups.sessions.title" },
    },
    // Group Final Level Quiz
    {
        path: "grades/:gradeId/levels/:levelId/group/:id/final-quiz",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/finalLevelQuiz"),
        permissions: [group.view],
        meta: { titleKey: "groupsManagement:groups.finalQuiz.title" },
        handle: { crumb: "groupsManagement:groups.finalQuiz.title" },
    },
];

// ============================================================================
// Feature Route Module
// ============================================================================

export const groupsManagementRoutes: FeatureRouteModule = {
    id: "groupsManagement",
    name: "Groups Management",
    basePath: "/admin/groups",
    layout: "dashboard",
    routes: {
        meta: {
            titleKey: "groupsManagement:groups.title",
            requiresAuth: true,
        },
        children: groupsRoutes,
    },
};

export default groupsManagementRoutes;
