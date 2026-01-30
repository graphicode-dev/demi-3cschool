import type { RouteConfig } from "@/router";
import { eligibleStudentsPermissions } from "@/auth";

/**
 * Eligible Students feature routes
 *
 * These are imported and spread into the main groups management routes.
 */
export const eligibleStudentsRoutes: RouteConfig[] = [
    {
        path: "eligible-students",
        lazy: () =>
            import("../pages/list").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Eligible Students",
            titleKey: "groupsManagement:eligibleStudents.title",
            requiresAuth: true,
        },
        permissions: [eligibleStudentsPermissions.viewAny],
    },
];
