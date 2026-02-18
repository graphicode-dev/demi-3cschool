import { RouteConfig } from "@/router";

export const rolesRoutes: RouteConfig[] = [
    {
        path: "roles",
        lazy: () =>
            import("@/features/dashboard/admin/systemManagements/pages/roles/pages/main"),
        meta: { titleKey: "systemManagements:roles.title" },
        handle: { crumb: "systemManagements:roles.title" },
    },
];
