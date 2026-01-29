import type { RouteConfig } from "@/router";

/**
 * Profile feature routes
 *
 */
export const profileRoutes: RouteConfig[] = [
    {
        path: "profile",
        lazy: () =>
            import("@/features/dashboard/shared/profile/pages/profile").then(
                (m) => ({
                    default: m.default,
                })
            ),
        meta: {
            titleKey: "classroom:nav.profile",
        },
        handle: {
            crumb: "classroom:nav.profile",
        },
    },
];
