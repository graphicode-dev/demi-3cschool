import { RouteConfig } from "@/router";

export const permissionRoutes: RouteConfig[] = [
    {
        path: "permissions",
        lazy: () =>
            import("@/features/dashboard/admin/systemManagements/pages/permissions/pages/main"),
        meta: { titleKey: "systemManagements:permissions.title" },
        handle: { crumb: "systemManagements:permissions.title" },
    },
];
