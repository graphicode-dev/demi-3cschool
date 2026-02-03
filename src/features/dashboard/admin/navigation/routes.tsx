/**
 * Admin Feature - Route Module
 *
 * Defines routes for the admin feature.
 * Base path: /admin/*
 *
 * Consolidates ALL admin features:
 * - Overview (dashboard home)
 * - Learning (standard & professional)
 * - Groups Management
 * - Groups Analytics
 * - Programs
 * - Sales Subscription
 * - Tickets Management
 * - Settings
 * - Shared features (profile, chat, certificates, reports)
 */

import { Navigate } from "react-router-dom";
import type { FeatureRouteModule, RouteConfig } from "@/router/routes.types";
import { adminSharedRoutes } from "@/features/dashboard/shared/navigation";
import { ticketsManagementRoutes } from "../ticketsManagement/navigation";
import { communityManagementRoutes } from "../communityManagement/navigation";
import { slotsRoutes } from "../settings/slots/navigation";
import { trainingCentersRoutes } from "../settings/trainingCenters/navigation";

// Import admin feature route arrays
import {
    learningPermissions,
    groupsPermissions,
    dashboardPermissions,
} from "@/auth";

const { course, level, lesson } = learningPermissions;
const { group, groupSession, studentAttendance } = groupsPermissions;

// ============================================================================
// Overview Routes
// ============================================================================

const overviewRoutes: RouteConfig[] = [
    {
        index: true,
        element: <Navigate to="overview" replace />,
    },
    {
        path: "overview",
        lazy: () =>
            import("@/features/dashboard/admin/overview/pages/Dashboard"),
        // permissions: [dashboardPermissions.view],
        meta: { titleKey: "common:dashboard" },
        handle: { crumb: "common:dashboard" },
    },
];

// ============================================================================
// Grades Navigation Routes (New Structure)
// ============================================================================

const gradesRoutes: RouteConfig[] = [
    // Grades List
    {
        path: "grades",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/grades/pages/GradesList"),
        // permissions: [lesson.viewAny],
        meta: { titleKey: "learning:grades.title" },
        handle: { crumb: "learning:grades.title" },
    },
    // Levels List for a Grade
    {
        path: "grades/:gradeId/levels",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/grades/pages/LevelsList"),
        // permissions: [lesson.viewAny],
        meta: { titleKey: "learning:levels.title" },
        handle: { crumb: "learning:levels.title" },
    },
    // Lessons List for a Level
    {
        path: "grades/:gradeId/levels/:levelId/lessons",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsList"),
        // permissions: [lesson.viewAny],
        meta: { titleKey: "learning:lessons.title" },
        handle: { crumb: "learning:lessons.title" },
    },
    // Create Lesson
    {
        path: "grades/:gradeId/levels/:levelId/lessons/create",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsCreate"),
        // permissions: [lesson.create],
        meta: { titleKey: "learning:lessons.form.create.title" },
        handle: { crumb: "learning:lessons.form.create.title" },
    },
    // Edit Lesson
    {
        path: "grades/:gradeId/levels/:levelId/lessons/edit/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsEdit"),
        // permissions: [lesson.update],
        meta: { titleKey: "learning:lessons.form.edit.title" },
        handle: { crumb: "learning:lessons.form.edit.title" },
    },
    // View Lesson
    {
        path: "grades/:gradeId/levels/:levelId/lessons/view/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsDetail"),
        // permissions: [lesson.view],
        meta: { titleKey: "learning:lessons.form.view.title" },
        handle: { crumb: "learning:lessons.form.view.title" },
    },
    // Lesson Quizzes
    {
        path: "grades/:gradeId/levels/:levelId/lessons/quiz/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsQuizDetail"),
        // permissions: [lesson.view],
        meta: { titleKey: "learning:lessons.quiz.title" },
        handle: { crumb: "learning:lessons.quiz.title" },
    },
    // Level Quizzes
    {
        path: "grades/:gradeId/levels/:levelId/quiz",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/levels/pages/LevelsDetail"),
        // permissions: [lesson.view],
        meta: { titleKey: "learning:levels.quiz.title" },
        handle: { crumb: "learning:levels.quiz.title" },
    },
];

// ============================================================================
// Programs Routes
// ============================================================================

const programsRoutes: RouteConfig[] = [
    {
        path: "programs",
        lazy: () =>
            import("@/features/dashboard/admin/programs/pages/Programs"),
        // permissions: [course.viewAny],
        meta: { titleKey: "programs:programs.title" },
        handle: { crumb: "programs:programs.title" },
    },
];

// ============================================================================
// Groups Management Routes (New Grade/Level Structure)
// ============================================================================

const groupsManagementRoutes: RouteConfig[] = [
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
    // Levels List for a Grade
    {
        path: "groups/grades/:gradeId/levels",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/grades/LevelsList"),
        // permissions: [group.viewAny],
        meta: { titleKey: "groupsManagement:groups.levels.title" },
        handle: { crumb: "groupsManagement:groups.levels.title" },
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
    // View Group
    {
        path: "groups/grades/:gradeId/levels/:levelId/group/view/:id",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/view"),
        // permissions: [group.view],
        meta: { titleKey: "groupsManagement:groups.form.view.title" },
        handle: { crumb: "groupsManagement:groups.form.view.title" },
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

// ============================================================================
// Groups Analytics Routes
// ============================================================================

const groupsAnalyticsRoutes: RouteConfig[] = [
    {
        path: "groups-analytics",
        lazy: () =>
            import("@/features/dashboard/admin/groupsAnalytics/pages/GroupsAnalytics"),
        // permissions: [group.viewAny],
        meta: { titleKey: "groupsAnalytics:groups.title" },
        handle: { crumb: "groupsAnalytics:groups.title" },
    },
];

// ============================================================================
// Resources Management Routes
// ============================================================================

const resourcesRoutes: RouteConfig[] = [
    // Resources Management (Folders List)
    {
        path: "resources",
        lazy: () =>
            import("@/features/dashboard/admin/resources/pages/ResourcesManagement"),
        meta: { titleKey: "resources:title" },
        handle: { crumb: "resources:title" },
    },
    // Create Folder
    {
        path: "resources/folder/create",
        lazy: () =>
            import("@/features/dashboard/admin/resources/pages/CreateFolder"),
        meta: { titleKey: "resources:folder.create" },
        handle: { crumb: "resources:folder.create" },
    },
    // Folder Details (Resources List)
    {
        path: "resources/folder/:folderId",
        lazy: () =>
            import("@/features/dashboard/admin/resources/pages/FolderDetails"),
        meta: { titleKey: "resources:title" },
        handle: { crumb: "resources:folder.title" },
    },
    // Edit Folder
    {
        path: "resources/folder/:folderId/edit",
        lazy: () =>
            import("@/features/dashboard/admin/resources/pages/EditFolder"),
        meta: { titleKey: "resources:folder.edit" },
        handle: { crumb: "resources:folder.edit" },
    },
    // Add Resource
    {
        path: "resources/folder/:folderId/resource/create",
        lazy: () =>
            import("@/features/dashboard/admin/resources/pages/AddResource"),
        meta: { titleKey: "resources:resource.add" },
        handle: { crumb: "resources:resource.add" },
    },
    // Edit Resource
    {
        path: "resources/folder/:folderId/resource/:resourceId/edit",
        lazy: () =>
            import("@/features/dashboard/admin/resources/pages/EditResource"),
        meta: { titleKey: "resources:resource.edit" },
        handle: { crumb: "resources:resource.edit" },
    },
];

// ============================================================================
// Admin Shared Routes (profile, chat, certificates, reports)
// ============================================================================

// Shared routes already have relative paths (profile, chat, etc.)
// No need to prefix since basePath is /admin
const adminOnlySharedRoutes: RouteConfig[] = [...adminSharedRoutes];

/**
 * Admin Route Module
 *
 * Consolidates all admin features under /admin/*
 */
export const adminRouteModule: FeatureRouteModule = {
    id: "admin",
    name: "Admin",
    basePath: "/admin",
    layout: "dashboard",
    routes: {
        children: [
            // Overview (dashboard home)
            ...overviewRoutes,
            // Grades (new navigation structure)
            ...gradesRoutes,
            // Programs
            ...programsRoutes,
            // Groups Management
            ...groupsManagementRoutes,
            // Groups Analytics
            ...groupsAnalyticsRoutes,
            // Resources Management
            ...resourcesRoutes,
            // Tickets Management
            ...ticketsManagementRoutes.map((route) => ({
                ...route,
                path: route.path
                    ? `tickets/${route.path}`
                    : "index" in route && route.index
                      ? undefined
                      : "tickets",
            })),
            // Slots (under settings)
            ...slotsRoutes,
            // Training Centers (under settings)
            ...trainingCentersRoutes,
            // Shared features (profile, chat, certificates, reports)
            ...adminOnlySharedRoutes,
            // Community Management
            ...communityManagementRoutes,
        ],
    },
};

export default adminRouteModule;
