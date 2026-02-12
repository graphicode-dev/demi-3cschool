/**
 * SettingsSiteMap Page
 *
 * Placeholder page for /admin/settings route.
 * Shows available settings-related routes to help users navigate.
 */

import { GraduationCap, Users } from "lucide-react";
import FeatureSiteMap from "@/shared/pages/FeatureSiteMap";
import type { SiteMapRoute } from "@/shared/pages/FeatureSiteMap";

export function UserManagementSiteMap() {
    const routes: SiteMapRoute[] = [
        {
            path: "/admin/userManagement/teachers",
            labelKey: "userManagement:sitemap.routes.teachers",
            descriptionKey: "userManagement:sitemap.routes.teachersDesc",
            icon: GraduationCap,
        },
        {
            path: "/admin/userManagement/students",
            labelKey: "userManagement:sitemap.routes.students",
            descriptionKey: "userManagement:sitemap.routes.studentsDesc",
            icon: Users,
        },
    ];

    return (
        <FeatureSiteMap
            featureKey="userManagement"
            titleKey="userManagement:sitemap.title"
            descriptionKey="userManagement:sitemap.description"
            routes={routes}
            homePath="/admin/overview"
        />
    );
}

export default UserManagementSiteMap;
