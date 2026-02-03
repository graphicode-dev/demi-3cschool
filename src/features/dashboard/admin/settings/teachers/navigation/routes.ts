import type { RouteConfig } from "@/router";

export const teachersRoutes: RouteConfig[] = [
    {
        path: "settings/teachers",
        lazy: () =>
            import(
                "@/features/dashboard/admin/settings/teachers/pages/List"
            ).then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Teachers",
            titleKey: "teachers:title",
            requiresAuth: true,
        },
    },
    {
        path: "settings/teachers/create",
        lazy: () =>
            import(
                "@/features/dashboard/admin/settings/teachers/pages/Create"
            ).then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Create Teacher",
            titleKey: "teachers:actions.create",
            requiresAuth: true,
        },
    },
    {
        path: "settings/teachers/view/:id",
        lazy: () =>
            import(
                "@/features/dashboard/admin/settings/teachers/pages/View"
            ).then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "View Teacher",
            titleKey: "teachers:actions.view",
            requiresAuth: true,
        },
    },
    {
        path: "settings/teachers/edit/:id",
        lazy: () =>
            import(
                "@/features/dashboard/admin/settings/teachers/pages/Edit"
            ).then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Edit Teacher",
            titleKey: "teachers:actions.edit",
            requiresAuth: true,
        },
    },
];
