/**
 * Shared Dashboard Features - Route Definitions
 *
 * These routes are shared between admin and classroom sections.
 * They are imported by both admin and classroom route modules.
 * Permission-controlled using accountPermissions config.
 */

import type { RouteConfig } from "@/router";
import { accountPermissions } from "@/auth";

const { conversation, certificate, report } = accountPermissions;

/**
 * Create shared routes with a specific base path prefix
 * This allows the same components to be used under different base paths
 */
export const createSharedRoutes = (
    basePath: "admin" | "classroom"
): RouteConfig[] => [
    {
        path: "profile",
        lazy: () =>
            import("@/features/dashboard/shared/profile/pages/profile").then(
                (m) => ({
                    default: m.default,
                })
            ),
        meta: {
            titleKey: `${basePath}:nav.profile`,
        },
        handle: {
            crumb: `${basePath}:nav.profile`,
        },
    },
    {
        path: "chat",
        lazy: () =>
            import("@/features/dashboard/shared/chat/pages/Main").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Chat",
            titleKey: `${basePath}:nav.chat`,
            requiresAuth: true,
        },
        permissions: [conversation.viewAny],
    },
    {
        path: "certificates",
        lazy: () =>
            import("@/features/dashboard/shared/certificates/pages/Main").then(
                (m) => ({
                    default: m.default,
                })
            ),
        meta: {
            title: "Certificates",
            titleKey: `${basePath}:nav.certificates`,
            requiresAuth: true,
        },
        permissions: [certificate.viewAny],
    },
    {
        path: "reports",
        lazy: () =>
            import("@/features/dashboard/shared/reports/pages/Main").then(
                (m) => ({
                    default: m.default,
                })
            ),
        meta: {
            title: "Reports",
            titleKey: `${basePath}:nav.reports`,
            requiresAuth: true,
        },
        permissions: [report.viewAny],
    },
    {
        path: "reports/view/:id",
        lazy: () =>
            import("@/features/dashboard/shared/reports/pages/View").then(
                (m) => ({
                    default: m.default,
                })
            ),
        meta: {
            title: "Review Report",
            titleKey: `${basePath}:nav.reports`,
            requiresAuth: true,
        },
        permissions: [report.view],
    },
];

// Pre-created routes for each section
export const classroomSharedRoutes = createSharedRoutes("classroom");
export const adminSharedRoutes = createSharedRoutes("admin");
