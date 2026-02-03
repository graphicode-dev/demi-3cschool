import type { RouteConfig } from "@/router";

export const studentsRoutes: RouteConfig[] = [
    {
        path: "settings/students",
        lazy: () =>
            import(
                "@/features/dashboard/admin/settings/students/pages/List"
            ).then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Students",
            titleKey: "students:title",
            requiresAuth: true,
        },
    },
    {
        path: "settings/students/create",
        lazy: () =>
            import(
                "@/features/dashboard/admin/settings/students/pages/Create"
            ).then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Create Student",
            titleKey: "students:actions.create",
            requiresAuth: true,
        },
    },
    {
        path: "settings/students/view/:id",
        lazy: () =>
            import(
                "@/features/dashboard/admin/settings/students/pages/View"
            ).then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "View Student",
            titleKey: "students:actions.view",
            requiresAuth: true,
        },
    },
    {
        path: "settings/students/edit/:id",
        lazy: () =>
            import(
                "@/features/dashboard/admin/settings/students/pages/Edit"
            ).then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Edit Student",
            titleKey: "students:actions.edit",
            requiresAuth: true,
        },
    },
];
