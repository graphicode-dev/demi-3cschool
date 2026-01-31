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
import { settingsRoutes } from "../settings/navigation";
import { ticketsManagementRoutes } from "../ticketsManagement/navigation";

// Import admin feature route arrays
import {
    learningPermissions,
    groupsPermissions,
    dashboardPermissions,
} from "@/auth";
import { purchaseRoutes } from "../sales_subscription/pages/purchases/navigation/routes";
import { couponsRoutes } from "../sales_subscription/pages/coupons/navigation";
import { priceListsRoutes } from "../sales_subscription/pages/pricelists/navigation";
import { subscriptionRoutes } from "../sales_subscription/pages/installments/navigation/routes";

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
        permissions: [dashboardPermissions.view],
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
        permissions: [lesson.viewAny],
        meta: { titleKey: "learning:grades.title" },
        handle: { crumb: "learning:grades.title" },
    },
    // Levels List for a Grade
    {
        path: "grades/:gradeId/levels",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/grades/pages/LevelsList"),
        permissions: [lesson.viewAny],
        meta: { titleKey: "learning:levels.title" },
        handle: { crumb: "learning:levels.title" },
    },
    // Lessons List for a Level
    {
        path: "grades/:gradeId/levels/:levelId/lessons",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsList"),
        permissions: [lesson.viewAny],
        meta: { titleKey: "learning:lessons.title" },
        handle: { crumb: "learning:lessons.title" },
    },
    // Create Lesson
    {
        path: "grades/:gradeId/levels/:levelId/lessons/create",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsCreate"),
        permissions: [lesson.create],
        meta: { titleKey: "learning:lessons.form.create.title" },
        handle: { crumb: "learning:lessons.form.create.title" },
    },
    // Edit Lesson
    {
        path: "grades/:gradeId/levels/:levelId/lessons/edit/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsEdit"),
        permissions: [lesson.update],
        meta: { titleKey: "learning:lessons.form.edit.title" },
        handle: { crumb: "learning:lessons.form.edit.title" },
    },
    // View Lesson
    {
        path: "grades/:gradeId/levels/:levelId/lessons/view/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsDetail"),
        permissions: [lesson.view],
        meta: { titleKey: "learning:lessons.form.view.title" },
        handle: { crumb: "learning:lessons.form.view.title" },
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
        permissions: [course.viewAny],
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
        permissions: [group.viewAny],
        meta: { titleKey: "groupsManagement:groups.grades.title" },
        handle: { crumb: "groupsManagement:groups.grades.title" },
    },
    // Levels List for a Grade
    {
        path: "groups/grades/:gradeId/levels",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/grades/LevelsList"),
        permissions: [group.viewAny],
        meta: { titleKey: "groupsManagement:groups.levels.title" },
        handle: { crumb: "groupsManagement:groups.levels.title" },
    },
    // Groups List for a Level
    {
        path: "groups/grades/:gradeId/levels/:levelId/regular",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/list"),
        permissions: [group.viewAny],
        meta: { titleKey: "groupsManagement:groups.regularListBreadcrumb" },
        handle: { crumb: "groupsManagement:groups.regularListBreadcrumb" },
    },
    // Create Group for a Level
    {
        path: "groups/grades/:gradeId/levels/:levelId/regular/create",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/create"),
        permissions: [group.create],
        meta: { titleKey: "groupsManagement:groups.form.create.title" },
        handle: { crumb: "groupsManagement:groups.form.create.title" },
    },
    // View Group
    {
        path: "groups/grades/:gradeId/levels/:levelId/regular/view/:id",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/view"),
        permissions: [group.view],
        meta: { titleKey: "groupsManagement:groups.form.view.title" },
        handle: { crumb: "groupsManagement:groups.form.view.title" },
    },
    // Edit Group
    {
        path: "groups/grades/:gradeId/levels/:levelId/regular/edit/:id",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/edit"),
        permissions: [group.update],
        meta: { titleKey: "groupsManagement:groups.edit.title" },
        handle: { crumb: "groupsManagement:groups.edit.title" },
    },
    // Assign Students to Group
    {
        path: "groups/grades/:gradeId/levels/:levelId/regular/:id/assign",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/assign"),
        permissions: [group.update],
        meta: { titleKey: "groupsManagement:groups.assignStudent.title" },
        handle: { crumb: "groupsManagement:groups.assignStudent.title" },
    },
    // Group Attendance
    {
        path: "groups/grades/:gradeId/levels/:levelId/regular/:id/attendance",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/attendance"),
        permissions: [studentAttendance.viewAny],
        meta: { titleKey: "groupsManagement:groups.attendance.title" },
        handle: { crumb: "groupsManagement:groups.attendance.title" },
    },
    // Group Instructor
    {
        path: "groups/grades/:gradeId/levels/:levelId/regular/:id/instructor",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/instructor"),
        permissions: [group.update],
        meta: { titleKey: "groupsManagement:groups.instructor.title" },
        handle: { crumb: "groupsManagement:groups.instructor.title" },
    },
    // Group Sessions
    {
        path: "groups/grades/:gradeId/levels/:levelId/regular/:id/sessions",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/sessions"),
        permissions: [groupSession.viewAny],
        meta: { titleKey: "groupsManagement:groups.sessions.title" },
        handle: { crumb: "groupsManagement:groups.sessions.title" },
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
        permissions: [group.viewAny],
        meta: { titleKey: "groupsAnalytics:groups.title" },
        handle: { crumb: "groupsAnalytics:groups.title" },
    },
];

// ============================================================================
// Sales Subscription Routes
// ============================================================================

const salesRoutes: RouteConfig[] = [
    {
        path: "sales",
        element: <Navigate to="sales/coupons" replace />,
    },
    // Coupons routes (prefixed with sales/)
    ...couponsRoutes.map((route) => ({
        ...route,
        path: route.path ? `sales/${route.path}` : undefined,
    })),
    // Price Lists routes (prefixed with sales/)
    ...priceListsRoutes.map((route) => ({
        ...route,
        path: route.path ? `sales/${route.path}` : undefined,
    })),
    // Purchases routes (prefixed with sales/)
    ...purchaseRoutes.map((route) => ({
        ...route,
        path: route.path ? `sales/${route.path}` : undefined,
    })),
    // Subscriptions/Installments routes (prefixed with sales/)
    ...subscriptionRoutes.map((route) => ({
        ...route,
        path: route.path ? `sales/${route.path}` : undefined,
    })),
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
            // Sales Subscription
            ...salesRoutes,
            // Tickets Management
            ...ticketsManagementRoutes.map((route) => ({
                ...route,
                path: route.path
                    ? `tickets/${route.path}`
                    : "index" in route && route.index
                      ? undefined
                      : "tickets",
            })),
            // Settings (relative paths, basePath is /admin)
            ...settingsRoutes,
            // Shared features (profile, chat, certificates, reports)
            ...adminOnlySharedRoutes,
        ],
    },
};

export default adminRouteModule;
