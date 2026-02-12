import { RouteConfig } from "@/router";
import { studentsRoutes } from "../students";
import { teachersRoutes } from "../teachers";

export const userManagementRoutes: RouteConfig[] = [
    {
        path: "userManagement",
        lazy: () =>
            import("@/features/dashboard/admin/userManagement/pages/site_map/UserManagementSiteMap"),
        meta: { titleKey: "userManagement:sitemap.title" },
        handle: { crumb: "userManagement:breadcrumb.userManagement" },
    },
    ...studentsRoutes,
    ...teachersRoutes,
];
