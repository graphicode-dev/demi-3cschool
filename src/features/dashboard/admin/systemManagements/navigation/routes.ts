import { RouteConfig } from "@/router";
import { permissionRoutes } from "../pages/permissions/navigation/routes";
import { usersRoutes } from "../pages/users/navigation";
import { rolesRoutes } from "../pages/roles/navigation";
import { groupsRoutes } from "../pages/groups/navigation";
import { squadsRoutes } from "../pages/squads/navigation";

export const managementRoutes: RouteConfig[] = [
    {
        path: "system-management",
        children: [
            {
                path: "settings",
                lazy: () =>
                    import("@/features/dashboard/admin/settings/pages/site_map/SettingsSiteMap"),
                meta: { titleKey: "systemManagements:title" },
                handle: { crumb: "systemManagements:title" },
            },
            ...permissionRoutes,
            ...usersRoutes,
            ...rolesRoutes,
            ...groupsRoutes,
            ...squadsRoutes,
        ],
    },
];
