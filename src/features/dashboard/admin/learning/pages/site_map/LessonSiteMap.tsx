/**
 * LessonSiteMap Page
 *
 * Placeholder page for lesson intermediate routes like:
 * - /admin/grades/:gradeId/levels/:levelId/lessons/edit
 * - /admin/grades/:gradeId/levels/:levelId/lessons/view
 * - /admin/grades/:gradeId/levels/:levelId/lessons/quiz
 *
 * Shows available lesson-related routes to help users navigate.
 */

import { useParams, useLocation } from "react-router-dom";
import { BookOpen, Eye, Pencil, ClipboardList, Plus, List } from "lucide-react";
import FeatureSiteMap from "@/shared/pages/FeatureSiteMap";
import type { SiteMapRoute } from "@/shared/pages/FeatureSiteMap";

export function LessonSiteMap() {
    const { gradeId, levelId } = useParams<{
        gradeId: string;
        levelId: string;
    }>();
    const { pathname } = useLocation();

    const isEditPath = pathname.includes("/edit");
    const isViewPath = pathname.includes("/view");
    const isQuizPath = pathname.includes("/quiz");

    const routes: SiteMapRoute[] = [
        {
            path: `/admin/grades/${gradeId}/levels/${levelId}/lessons`,
            labelKey: "learning:sitemap.routes.lessonsList",
            descriptionKey: "learning:sitemap.routes.lessonsListDesc",
            icon: List,
        },
        {
            path: `/admin/grades/${gradeId}/levels/${levelId}/lessons/create`,
            labelKey: "learning:sitemap.routes.createLesson",
            descriptionKey: "learning:sitemap.routes.createLessonDesc",
            icon: Plus,
        },
    ];

    let titleKey = "learning:sitemap.lesson.title";
    let descriptionKey = "learning:sitemap.lesson.description";

    if (isEditPath) {
        titleKey = "learning:sitemap.lesson.editTitle";
        descriptionKey = "learning:sitemap.lesson.editDescription";
    } else if (isViewPath) {
        titleKey = "learning:sitemap.lesson.viewTitle";
        descriptionKey = "learning:sitemap.lesson.viewDescription";
    } else if (isQuizPath) {
        titleKey = "learning:sitemap.lesson.quizTitle";
        descriptionKey = "learning:sitemap.lesson.quizDescription";
    }

    return (
        <FeatureSiteMap
            featureKey="learning"
            titleKey={titleKey}
            descriptionKey={descriptionKey}
            routes={routes}
            homePath={`/admin/grades/${gradeId}/levels/${levelId}/lessons`}
        />
    );
}

export default LessonSiteMap;
