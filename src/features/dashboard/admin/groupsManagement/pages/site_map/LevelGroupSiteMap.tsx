/**
 * LevelGroupSiteMap Page
 *
 * Placeholder page for /admin/groups/grades/:gradeId/levels/:levelId route.
 * Shows available level-related routes in groups management.
 */

import { useParams } from "react-router-dom";
import { Layers, Users, Plus } from "lucide-react";
import FeatureSiteMap from "@/shared/pages/FeatureSiteMap";
import type { SiteMapRoute } from "@/shared/pages/FeatureSiteMap";

export function LevelGroupSiteMap() {
    const { gradeId, levelId } = useParams<{
        gradeId: string;
        levelId: string;
    }>();

    const routes: SiteMapRoute[] = [
        {
            path: "/admin/groups/grades",
            labelKey: "groupsManagement:sitemap.routes.gradesList",
            descriptionKey: "groupsManagement:sitemap.routes.gradesListDesc",
            icon: Layers,
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

    if (gradeId && levelId) {
        routes.push(
            {
                path: `/admin/groups/grades/${gradeId}/levels/${levelId}/group`,
                labelKey: "groupsManagement:sitemap.routes.groupsList",
                descriptionKey: "groupsManagement:sitemap.routes.groupsListDesc",
                icon: Users,
            },
            {
                path: `/admin/groups/grades/${gradeId}/levels/${levelId}/group/create`,
                labelKey: "groupsManagement:sitemap.routes.createGroup",
                descriptionKey: "groupsManagement:sitemap.routes.createGroupDesc",
                icon: Plus,
            }
        );
    }

    return (
        <FeatureSiteMap
            featureKey="groupsManagement"
            titleKey="groupsManagement:sitemap.level.title"
            descriptionKey="groupsManagement:sitemap.level.description"
            routes={routes}
            homePath={
                gradeId
                    ? `/admin/groups/grades/${gradeId}/levels`
                    : "/admin/groups/grades"
            }
        />
    );
}

export default LevelGroupSiteMap;
