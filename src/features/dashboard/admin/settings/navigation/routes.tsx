import type { RouteConfig } from "@/router";
import { accountPermissions } from "@/auth/permission.config";

const { setting } = accountPermissions;

/**
 * Settings feature routes (Admin only)
 *
 */
export const settingsRoutes: RouteConfig[] = [
    {
        path: "settings",
        lazy: () =>
            import("@/features/dashboard/admin/settings/pages/Main").then(
                (m) => ({
                    default: m.default,
                })
            ),
        meta: {
            title: "Settings",
            titleKey: "admin:nav.settings",
            requiresAuth: true,
        },
        permissions: [setting.viewAny],
    },
];
