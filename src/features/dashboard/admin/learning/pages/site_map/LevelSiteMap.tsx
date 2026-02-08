/**
 * LevelSiteMap Page
 *
 * Placeholder page for /admin/grades/:gradeId/levels/:levelId route.
 * Shows available level-related routes to help users navigate.
 */

import { useParams } from "react-router-dom";
import { Layers, BookOpen, ClipboardList, Plus } from "lucide-react";
import FeatureSiteMap from "@/shared/pages/FeatureSiteMap";
import type { SiteMapRoute } from "@/shared/pages/FeatureSiteMap";

export function LevelSiteMap() {
    const { gradeId, levelId } = useParams<{
        gradeId: string;
        levelId: string;
    }>();

    const routes: SiteMapRoute[] = [
        {
            path: "/admin/grades",
            labelKey: "learning:sitemap.routes.gradesList",
            descriptionKey: "learning:sitemap.routes.gradesListDesc",
            icon: Layers,
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

    if (gradeId && levelId) {
        routes.push(
            {
                path: `/admin/grades/${gradeId}/levels/${levelId}/lessons`,
                labelKey: "learning:sitemap.routes.lessonsList",
                descriptionKey: "learning:sitemap.routes.lessonsListDesc",
                icon: BookOpen,
            },
            {
                path: `/admin/grades/${gradeId}/levels/${levelId}/lessons/create`,
                labelKey: "learning:sitemap.routes.createLesson",
                descriptionKey: "learning:sitemap.routes.createLessonDesc",
                icon: Plus,
            },
            {
                path: `/admin/grades/${gradeId}/levels/${levelId}/quiz`,
                labelKey: "learning:sitemap.routes.levelQuiz",
                descriptionKey: "learning:sitemap.routes.levelQuizDesc",
                icon: ClipboardList,
            }
        );
    }

    return (
        <FeatureSiteMap
            featureKey="learning"
            titleKey="learning:sitemap.level.title"
            descriptionKey="learning:sitemap.level.description"
            routes={routes}
            homePath={
                gradeId ? `/admin/grades/${gradeId}/levels` : "/admin/grades"
            }
        />
    );
}

export default LevelSiteMap;
