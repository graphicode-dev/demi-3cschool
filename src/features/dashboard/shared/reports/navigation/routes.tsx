import type { RouteConfig } from "@/router";
import { accountPermissions } from "@/auth/permission.config";

const { report } = accountPermissions;

/**
 * Reports feature routes
 *
 */
export const reportsRoutes: RouteConfig[] = [
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
            titleKey: "classroom:nav.reports",
            requiresAuth: true,
        },
        // permissions: [report.viewAny],
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
            titleKey: "classroom:nav.reports",
            requiresAuth: true,
        },
        // permissions: [report.view],
    },
];
