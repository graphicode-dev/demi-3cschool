import type { RouteConfig } from "@/router";

export const studentsRoutes: RouteConfig[] = [
    {
        path: "userManagement/students",
        lazy: () =>
            import("@/features/dashboard/admin/userManagement/students/pages/List").then(
                (m) => ({
                    default: m.default,
                })
            ),
        meta: {
            title: "Students",
            titleKey: "students:title",
            requiresAuth: true,
        },
    },
    {
        path: "userManagement/students/create",
        lazy: () =>
            import("@/features/dashboard/admin/userManagement/students/pages/Create").then(
                (m) => ({
                    default: m.default,
                })
            ),
        meta: {
            title: "Create Student",
            titleKey: "students:actions.create",
            requiresAuth: true,
        },
    },
    {
        path: "userManagement/students/view/:id",
        lazy: () =>
            import("@/features/dashboard/admin/userManagement/students/pages/View").then(
                (m) => ({
                    default: m.default,
                })
            ),
        meta: {
            title: "View Student",
            titleKey: "students:actions.view",
            requiresAuth: true,
        },
    },
    {
        path: "userManagement/students/edit/:id",
        lazy: () =>
            import("@/features/dashboard/admin/userManagement/students/pages/Edit").then(
                (m) => ({
                    default: m.default,
                })
            ),
        meta: {
            title: "Edit Student",
            titleKey: "students:actions.edit",
            requiresAuth: true,
        },
    },
];
