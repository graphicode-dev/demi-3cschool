/**
 * Slots Feature - Routes
 */

import type { RouteConfig } from "@/router";

export const slotsRoutes: RouteConfig[] = [
    {
        path: "settings/slots",
        lazy: () =>
            import(
                "@/features/dashboard/admin/settings/slots/pages/Main"
            ).then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Slots",
            titleKey: "slots:title",
            requiresAuth: true,
        },
    },
];
