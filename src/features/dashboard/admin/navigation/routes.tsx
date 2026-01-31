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
import { eligibleStudentsRoutes } from "../groupsManagement/pages/EligibleStudents/navigation";

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
// Standard Learning Routes
// ============================================================================

const standardLearningRoutes: RouteConfig[] = [
    {
        path: "standard-learning/courses",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/courses/pages/CoursesList"),
        permissions: [course.viewAny],
        meta: { titleKey: "learning:learning.standard.courses" },
        handle: { crumb: "learning:learning.standard.courses" },
    },
    {
        path: "standard-learning/courses/create",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/courses/pages/CoursesCreate"),
        permissions: [course.create],
        meta: { titleKey: "learning:courses.form.create.title" },
        handle: { crumb: "learning:courses.form.create.title" },
    },
    {
        path: "standard-learning/courses/edit/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/courses/pages/CoursesEdit"),
        permissions: [course.update],
        meta: { titleKey: "learning:courses.form.edit.title" },
        handle: { crumb: "learning:courses.form.edit.title" },
    },
    {
        path: "standard-learning/levels",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/levels/pages/LevelsList"),
        permissions: [level.viewAny],
        meta: { titleKey: "learning:learning.standard.levels" },
        handle: { crumb: "learning:learning.standard.levels" },
    },
    {
        path: "standard-learning/levels/create",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/levels/pages/LevelsCreate"),
        permissions: [level.create],
        meta: { titleKey: "learning:levels.form.create.title" },
        handle: { crumb: "learning:levels.form.create.title" },
    },
    {
        path: "standard-learning/levels/edit/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/levels/pages/LevelsEdit"),
        permissions: [level.update],
        meta: { titleKey: "learning:levels.form.edit.title" },
        handle: { crumb: "learning:levels.form.edit.title" },
    },
    {
        path: "standard-learning/levels/view/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/levels/pages/LevelsDetail"),
        permissions: [level.view],
        meta: { titleKey: "learning:levels.detail.title" },
        handle: { crumb: "learning:levels.detail.title" },
    },
    {
        path: "standard-learning/lessons",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsList"),
        permissions: [lesson.viewAny],
        meta: { titleKey: "learning:learning.standard.lessons" },
        handle: { crumb: "learning:learning.standard.lessons" },
    },
    {
        path: "standard-learning/lessons/create",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsCreate"),
        permissions: [lesson.create],
        meta: { titleKey: "learning:lessons.form.create.title" },
        handle: { crumb: "learning:lessons.form.create.title" },
    },
    {
        path: "standard-learning/lessons/edit/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsEdit"),
        permissions: [lesson.update],
        meta: { titleKey: "learning:lessons.form.edit.title" },
        handle: { crumb: "learning:lessons.form.edit.title" },
    },
    {
        path: "standard-learning/lessons/view/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsDetail"),
        permissions: [lesson.view],
        meta: { titleKey: "learning:lessons.form.view.title" },
        handle: {
            crumb: (params: Record<string, string>) => `Lesson #${params.id}`,
        },
    },
];

// ============================================================================
// Professional Learning Routes
// ============================================================================

const professionalLearningRoutes: RouteConfig[] = [
    {
        path: "professional-learning/courses",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/courses/pages/CoursesList"),
        permissions: [course.viewAny],
        meta: { titleKey: "learning:learning.professional.courses" },
        handle: { crumb: "learning:learning.professional.courses" },
    },
    {
        path: "professional-learning/courses/create",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/courses/pages/CoursesCreate"),
        permissions: [course.create],
        meta: { titleKey: "learning:courses.form.create.title" },
        handle: { crumb: "learning:courses.form.create.title" },
    },
    {
        path: "professional-learning/courses/edit/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/courses/pages/CoursesEdit"),
        permissions: [course.update],
        meta: { titleKey: "learning:courses.form.edit.title" },
        handle: { crumb: "learning:courses.form.edit.title" },
    },
    {
        path: "professional-learning/levels",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/levels/pages/LevelsList"),
        permissions: [level.viewAny],
        meta: { titleKey: "learning:learning.professional.levels" },
        handle: { crumb: "learning:learning.professional.levels" },
    },
    {
        path: "professional-learning/levels/create",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/levels/pages/LevelsCreate"),
        permissions: [level.create],
        meta: { titleKey: "learning:levels.form.create.title" },
        handle: { crumb: "learning:levels.form.create.title" },
    },
    {
        path: "professional-learning/levels/edit/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/levels/pages/LevelsEdit"),
        permissions: [level.update],
        meta: { titleKey: "learning:levels.form.edit.title" },
        handle: { crumb: "learning:levels.form.edit.title" },
    },
    {
        path: "professional-learning/levels/view/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/levels/pages/LevelsDetail"),
        permissions: [level.view],
        meta: { titleKey: "learning:levels.detail.title" },
        handle: { crumb: "learning:levels.detail.title" },
    },
    {
        path: "professional-learning/lessons",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsList"),
        permissions: [lesson.viewAny],
        meta: { titleKey: "learning:learning.professional.lessons" },
        handle: { crumb: "learning:learning.professional.lessons" },
    },
    {
        path: "professional-learning/lessons/create",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsCreate"),
        permissions: [lesson.create],
        meta: { titleKey: "learning:lessons.form.create.title" },
        handle: { crumb: "learning:lessons.form.create.title" },
    },
    {
        path: "professional-learning/lessons/edit/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsEdit"),
        permissions: [lesson.update],
        meta: { titleKey: "learning:lessons.form.edit.title" },
        handle: { crumb: "learning:lessons.form.edit.title" },
    },
    {
        path: "professional-learning/lessons/view/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsDetail"),
        permissions: [lesson.view],
        meta: { titleKey: "learning:lessons.form.view.title" },
        handle: {
            crumb: (params: Record<string, string>) => `Lesson #${params.id}`,
        },
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
// Groups Management Routes
// ============================================================================

const groupsManagementRoutes: RouteConfig[] = [
    {
        path: "groups",
        element: <Navigate to="groups/regular" replace />,
    },
    {
        path: "groups/regular",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/RegularGroups/list"),
        permissions: [group.viewAny],
        meta: { titleKey: "groupsManagement:groups.regularListBreadcrumb" },
        handle: { crumb: "groupsManagement:groups.regularListBreadcrumb" },
    },
    {
        path: "groups/regular/create",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/RegularGroups/create"),
        permissions: [group.create],
        meta: { titleKey: "groupsManagement:groups.form.create.title" },
        handle: { crumb: "groupsManagement:groups.form.create.title" },
    },
    {
        path: "groups/regular/view/:id",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/RegularGroups/view"),
        permissions: [group.view],
        meta: { titleKey: "groupsManagement:groups.form.view.title" },
        handle: { crumb: "groupsManagement:groups.form.view.title" },
    },
    {
        path: "groups/regular/edit/:id",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/RegularGroups/edit"),
        permissions: [group.update],
        meta: { titleKey: "groupsManagement:groups.edit.title" },
        handle: { crumb: "groupsManagement:groups.edit.title" },
    },
    {
        path: "groups/regular/:id/assign",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/RegularGroups/assign"),
        permissions: [group.update],
        meta: { titleKey: "groupsManagement:groups.assignStudent.title" },
        handle: { crumb: "groupsManagement:groups.assignStudent.title" },
    },
    {
        path: "groups/regular/:id/attendance",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/RegularGroups/attendance"),
        permissions: [studentAttendance.viewAny],
        meta: { titleKey: "groupsManagement:groups.attendance.title" },
        handle: { crumb: "groupsManagement:groups.attendance.title" },
    },
    {
        path: "groups/regular/:id/instructor",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/RegularGroups/instructor"),
        permissions: [group.update],
        meta: { titleKey: "groupsManagement:groups.instructor.title" },
        handle: { crumb: "groupsManagement:groups.instructor.title" },
    },
    {
        path: "groups/regular/:id/sessions",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/RegularGroups/sessions"),
        permissions: [groupSession.viewAny],
        meta: { titleKey: "groupsManagement:groups.sessions.title" },
        handle: { crumb: "groupsManagement:groups.sessions.title" },
    },
    {
        path: "groups/semi-private",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/SemiPrivateGroups/list"),
        permissions: [group.viewAny],
        meta: { titleKey: "groupsManagement:groups.semiPrivateListBreadcrumb" },
        handle: { crumb: "groupsManagement:groups.semiPrivateListBreadcrumb" },
    },
    {
        path: "groups/private",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/PrivateGroups/list"),
        permissions: [group.viewAny],
        meta: { titleKey: "groupsManagement:groups.privateListBreadcrumb" },
        handle: { crumb: "groupsManagement:groups.privateListBreadcrumb" },
    },
    {
        path: "groups/sessions",
        lazy: () =>
            import("@/features/dashboard/admin/groupsManagement/pages/SessionsGroups/list"),
        permissions: [groupSession.viewAny],
        meta: { titleKey: "groupsManagement:groups.sessionsListBreadcrumb" },
        handle: { crumb: "groupsManagement:groups.sessionsListBreadcrumb" },
    },
    // Eligible Students routes (prefixed with groups/)
    ...eligibleStudentsRoutes.map((route) => ({
        ...route,
        path: route.path ? `groups/${route.path}` : undefined,
    })),
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
            // Learning routes
            ...standardLearningRoutes,
            ...professionalLearningRoutes,
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
