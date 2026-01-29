import type { RouteConfig } from "@/router";
import { accountPermissions } from "@/auth/permission.config";

const { certificate } = accountPermissions;

/**
 * Certificates feature routes
 */
export const certificatesRoutes: RouteConfig[] = [
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
            titleKey: "classroom:nav.certificates",
            requiresAuth: true,
        },
        permissions: [certificate.viewAny],
    },
];
