import { RouteConfig } from "@/router";
import { permissionRoutes } from "../pages/permissions/navigation/routes";

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
        ],
    },
];
