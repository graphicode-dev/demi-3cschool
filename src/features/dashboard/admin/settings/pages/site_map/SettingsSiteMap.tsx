/**
 * SettingsSiteMap Page
 *
 * Placeholder page for /admin/settings route.
 * Shows available settings-related routes to help users navigate.
 */

import { Settings, Clock, Building2, GraduationCap, Users } from "lucide-react";
import FeatureSiteMap from "@/shared/pages/FeatureSiteMap";
import type { SiteMapRoute } from "@/shared/pages/FeatureSiteMap";

export function SettingsSiteMap() {
    const routes: SiteMapRoute[] = [
        {
            path: "/admin/settings/slots",
            labelKey: "settings:sitemap.routes.slots",
            descriptionKey: "settings:sitemap.routes.slotsDesc",
            icon: Clock,
        },
        {
            path: "/admin/settings/training-centers",
            labelKey: "settings:sitemap.routes.trainingCenters",
            descriptionKey: "settings:sitemap.routes.trainingCentersDesc",
            icon: Building2,
        },
        {
            path: "/admin/settings/teachers",
            labelKey: "settings:sitemap.routes.teachers",
            descriptionKey: "settings:sitemap.routes.teachersDesc",
            icon: GraduationCap,
        },
        {
            path: "/admin/settings/students",
            labelKey: "settings:sitemap.routes.students",
            descriptionKey: "settings:sitemap.routes.studentsDesc",
            icon: Users,
        },
    ];

    return (
        <FeatureSiteMap
            featureKey="settings"
            titleKey="settings:sitemap.title"
            descriptionKey="settings:sitemap.description"
            routes={routes}
            homePath="/admin/overview"
        />
    );
}

export default SettingsSiteMap;
