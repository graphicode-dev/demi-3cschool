/**
 * GradeSiteMap Page
 *
 * Placeholder page for /admin/grades/:gradeId route.
 * Shows available grade-related routes to help users navigate.
 */

import { useParams } from "react-router-dom";
import { GraduationCap, Layers, BookOpen } from "lucide-react";
import FeatureSiteMap from "@/shared/pages/FeatureSiteMap";
import type { SiteMapRoute } from "@/shared/pages/FeatureSiteMap";

export function GradeSiteMap() {
    const { gradeId } = useParams<{ gradeId: string }>();

    const routes: SiteMapRoute[] = [
        {
            path: "/admin/grades",
            labelKey: "learning:sitemap.routes.gradesList",
            descriptionKey: "learning:sitemap.routes.gradesListDesc",
            icon: GraduationCap,
        },
    ];

    if (gradeId) {
        routes.push({
            path: `/admin/grades/${gradeId}/levels`,
            labelKey: "learning:sitemap.routes.levelsList",
            descriptionKey: "learning:sitemap.routes.levelsListDesc",
            icon: Layers,
        });
    }

    return (
        <FeatureSiteMap
            featureKey="learning"
            titleKey="learning:sitemap.grade.title"
            descriptionKey="learning:sitemap.grade.description"
            routes={routes}
            homePath="/admin/grades"
        />
    );
}

export default GradeSiteMap;
