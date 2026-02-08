/**
 * LessonSiteMap Page
 *
 * Placeholder page for /classroom/self-study/lesson route.
 * Shows available lesson-related routes to help users navigate.
 */

import { BookOpen, List } from "lucide-react";
import FeatureSiteMap from "@/shared/pages/FeatureSiteMap";
import type { SiteMapRoute } from "@/shared/pages/FeatureSiteMap";

export function LessonSiteMap() {
    const routes: SiteMapRoute[] = [
        {
            path: "/classroom/self-study",
            labelKey: "selfStudy:sitemap.routes.selfStudyList",
            descriptionKey: "selfStudy:sitemap.routes.selfStudyListDesc",
            icon: List,
        },
    ];

    return (
        <FeatureSiteMap
            featureKey="selfStudy"
            titleKey="selfStudy:sitemap.lesson.title"
            descriptionKey="selfStudy:sitemap.lesson.description"
            routes={routes}
            homePath="/classroom/self-study"
        />
    );
}

export default LessonSiteMap;
