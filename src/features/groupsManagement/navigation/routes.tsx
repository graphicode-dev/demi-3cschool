/**
 * Groups Management - Routes
 *
 * Route configuration for Groups.
 * Uses FeatureRouteModule format for the new routing architecture.
 * Permission-controlled routes using groupsPermissions config.
 */

import { Navigate } from "react-router-dom";
import type { RouteConfig, FeatureRouteModule } from "@/router/routes.types";
import { groupsPermissions } from "@/auth";
import { eligibleStudentsRoutes } from "../pages/EligibleStudents/navigation";

const { group, groupSession, studentAttendance } = groupsPermissions;

// ============================================================================
// Groups Routes
// ============================================================================

const groupsRoutes: RouteConfig[] = [
    {
        index: true,
        element: <Navigate to="regular" replace />,
    },
    {
        path: "regular",
        lazy: () =>
            import("@/features/groupsManagement/pages/RegularGroups/list"),
        permissions: [group.viewAny],
        meta: { titleKey: "groupsManagement:groups.regularListBreadcrumb" },
        handle: { crumb: "groupsManagement:groups.regularListBreadcrumb" },
    },
    {
        path: "regular/create",
        lazy: () =>
            import("@/features/groupsManagement/pages/RegularGroups/create"),
        permissions: [group.create],
        meta: { titleKey: "groupsManagement:groups.form.create.title" },
        handle: { crumb: "groupsManagement:groups.form.create.title" },
    },
    {
        path: "regular/view/:id",
        lazy: () =>
            import("@/features/groupsManagement/pages/RegularGroups/view"),
        permissions: [group.view],
        meta: { titleKey: "groupsManagement:groups.form.view.title" },
        handle: { crumb: "groupsManagement:groups.form.view.title" },
    },
    {
        path: "regular/edit/:id",
        lazy: () =>
            import("@/features/groupsManagement/pages/RegularGroups/edit"),
        permissions: [group.update],
        meta: { titleKey: "groupsManagement:groups.edit.title" },
        handle: { crumb: "groupsManagement:groups.edit.title" },
    },
    {
        path: "regular/:id/assign",
        lazy: () =>
            import("@/features/groupsManagement/pages/RegularGroups/assign"),
        permissions: [group.update],
        meta: { titleKey: "groupsManagement:groups.assignStudent.title" },
        handle: { crumb: "groupsManagement:groups.assignStudent.title" },
    },
    {
        path: "regular/:id/attendance",
        lazy: () =>
            import("@/features/groupsManagement/pages/RegularGroups/attendance"),
        permissions: [studentAttendance.viewAny],
        meta: { titleKey: "groupsManagement:groups.attendance.title" },
        handle: { crumb: "groupsManagement:groups.attendance.title" },
    },
    {
        path: "regular/:id/instructor",
        lazy: () =>
            import("@/features/groupsManagement/pages/RegularGroups/instructor"),
        permissions: [group.update],
        meta: { titleKey: "groupsManagement:groups.instructor.title" },
        handle: { crumb: "groupsManagement:groups.instructor.title" },
    },
    {
        path: "regular/:id/sessions",
        lazy: () =>
            import("@/features/groupsManagement/pages/RegularGroups/sessions"),
        permissions: [groupSession.viewAny],
        meta: { titleKey: "groupsManagement:groups.sessions.title" },
        handle: { crumb: "groupsManagement:groups.sessions.title" },
    },
    {
        path: "semi-private",
        lazy: () =>
            import("@/features/groupsManagement/pages/SemiPrivateGroups/list"),
        permissions: [group.viewAny],
        meta: { titleKey: "groupsManagement:groups.semiPrivateListBreadcrumb" },
        handle: { crumb: "groupsManagement:groups.semiPrivateListBreadcrumb" },
    },
    {
        path: "private",
        lazy: () =>
            import("@/features/groupsManagement/pages/PrivateGroups/list"),
        permissions: [group.viewAny],
        meta: { titleKey: "groupsManagement:groups.privateListBreadcrumb" },
        handle: { crumb: "groupsManagement:groups.privateListBreadcrumb" },
    },
    {
        path: "sessions",
        lazy: () =>
            import("@/features/groupsManagement/pages/SessionsGroups/list"),
        permissions: [groupSession.viewAny],
        meta: { titleKey: "groupsManagement:groups.sessionsListBreadcrumb" },
        handle: { crumb: "groupsManagement:groups.sessionsListBreadcrumb" },
    },

    ...eligibleStudentsRoutes,
];

// ============================================================================
// Feature Route Module
// ============================================================================

export const groupsManagementRoutes: FeatureRouteModule = {
    id: "groupsManagement",
    name: "Groups Management",
    basePath: "/dashboard/groups",
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
