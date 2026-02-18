import { RouteConfig } from "@/router";

export const usersRoutes: RouteConfig[] = [
    {
        path: "users",
        lazy: () =>
            import("@/features/dashboard/admin/systemManagements/pages/users/pages/main"),
        meta: { titleKey: "systemManagements:users.title" },
        handle: { crumb: "systemManagements:users.title" },
    },
];
