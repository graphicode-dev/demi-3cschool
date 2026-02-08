/**
 * GradeGroupSiteMap Page
 *
 * Placeholder page for /admin/groups/grades/:gradeId route.
 * Shows available grade-related routes in groups management.
 */

import { useParams } from "react-router-dom";
import { GraduationCap, Layers, Users } from "lucide-react";
import FeatureSiteMap from "@/shared/pages/FeatureSiteMap";
import type { SiteMapRoute } from "@/shared/pages/FeatureSiteMap";

export function GradeGroupSiteMap() {
    const { gradeId } = useParams<{ gradeId: string }>();

    const routes: SiteMapRoute[] = [
        {
            path: "/admin/groups/grades",
            labelKey: "groupsManagement:sitemap.routes.gradesList",
            descriptionKey: "groupsManagement:sitemap.routes.gradesListDesc",
            icon: GraduationCap,
        },
    ];

    if (gradeId) {
        routes.push({
            path: `/admin/groups/grades/${gradeId}/levels`,
            labelKey: "groupsManagement:sitemap.routes.levelsList",
            descriptionKey: "groupsManagement:sitemap.routes.levelsListDesc",
            icon: Layers,
        });
    }

    return (
        <FeatureSiteMap
            featureKey="groupsManagement"
            titleKey="groupsManagement:sitemap.grade.title"
            descriptionKey="groupsManagement:sitemap.grade.description"
            routes={routes}
            homePath="/admin/groups/grades"
        />
    );
}

export default GradeGroupSiteMap;
