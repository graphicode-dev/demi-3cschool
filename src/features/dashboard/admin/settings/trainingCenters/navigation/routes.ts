import type { RouteConfig } from "@/router";

export const trainingCentersRoutes: RouteConfig[] = [
    {
        path: "settings/training-centers",
        lazy: () =>
            import(
                "@/features/dashboard/admin/settings/trainingCenters/pages/List"
            ).then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Training Centers",
            titleKey: "trainingCenters:title",
            requiresAuth: true,
        },
    },
    {
        path: "settings/training-centers/create",
        lazy: () =>
            import(
                "@/features/dashboard/admin/settings/trainingCenters/pages/Create"
            ).then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Create Training Center",
            titleKey: "trainingCenters:actions.create",
            requiresAuth: true,
        },
    },
    {
        path: "settings/training-centers/view/:id",
        lazy: () =>
            import(
                "@/features/dashboard/admin/settings/trainingCenters/pages/View"
            ).then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "View Training Center",
            titleKey: "trainingCenters:actions.view",
            requiresAuth: true,
        },
    },
    {
        path: "settings/training-centers/edit/:id",
        lazy: () =>
            import(
                "@/features/dashboard/admin/settings/trainingCenters/pages/Edit"
            ).then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Edit Training Center",
            titleKey: "trainingCenters:actions.edit",
            requiresAuth: true,
        },
    },
];
