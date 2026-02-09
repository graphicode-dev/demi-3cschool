import { RouteConfig } from "@/router";
import { slotsRoutes } from "../slots";
import { studentsRoutes } from "../students";
import { teachersRoutes } from "../teachers";
import { trainingCentersRoutes } from "../trainingCenters";

export const settingsRoutes: RouteConfig[] = [
    {
        path: "settings",
        lazy: () =>
            import("@/features/dashboard/admin/settings/pages/site_map/SettingsSiteMap"),
        meta: { titleKey: "settings:sitemap.title" },
        handle: { crumb: "settings:breadcrumb.settings" },
    },
    ...slotsRoutes,
    ...studentsRoutes,
    ...teachersRoutes,
    ...trainingCentersRoutes,
];
