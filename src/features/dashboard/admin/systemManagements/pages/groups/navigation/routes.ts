import { RouteConfig } from "@/router";

export const groupsRoutes: RouteConfig[] = [
    {
        path: "groups",
        lazy: () =>
            import("@/features/dashboard/admin/systemManagements/pages/groups/pages/main"),
        meta: { titleKey: "systemManagements:groups.title" },
        handle: { crumb: "systemManagements:groups.title" },
    },
];
