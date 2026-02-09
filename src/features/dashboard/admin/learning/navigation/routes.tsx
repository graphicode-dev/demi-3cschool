/**
 * Learning Feature - Routes
 *
 * Route configuration for Grades navigation.
 * New flow: Grades -> Levels -> Lessons
 * Uses FeatureRouteModule format for the new routing architecture.
 *
 * Permission-controlled routes using learningPermissions config.
 */

import type { RouteConfig } from "@/router/routes.types";

// ============================================================================
// Grades Navigation Routes (New Structure)
// ============================================================================

export const gradesRoutes: RouteConfig[] = [
    // Grades List
    {
        path: "grades",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/grades/pages/GradesList"),
        // permissions: [lesson.viewAny],
        meta: { titleKey: "learning:grades.title" },
        handle: { crumb: "learning:grades.title" },
    },
    // Grade SiteMap (placeholder for /grades/:gradeId)
    {
        path: "grades/:gradeId",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/site_map/GradeSiteMap"),
        meta: { titleKey: "learning:sitemap.grade.title" },
        handle: { crumb: "learning:breadcrumb.grade" },
    },
    // Levels List for a Grade
    {
        path: "grades/:gradeId/levels",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/grades/pages/LevelsList"),
        // permissions: [lesson.viewAny],
        meta: { titleKey: "learning:levels.title" },
        handle: { crumb: "learning:levels.title" },
    },
    // Level SiteMap (placeholder for /grades/:gradeId/levels/:levelId)
    {
        path: "grades/:gradeId/levels/:levelId",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/site_map/LevelSiteMap"),
        meta: { titleKey: "learning:sitemap.level.title" },
        handle: { crumb: "learning:breadcrumb.level" },
    },
    // Lessons List for a Level
    {
        path: "grades/:gradeId/levels/:levelId/lessons",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsList"),
        // permissions: [lesson.viewAny],
        meta: { titleKey: "learning:lessons.title" },
        handle: { crumb: "learning:lessons.title" },
    },
    // Create Lesson
    {
        path: "grades/:gradeId/levels/:levelId/lessons/create",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsCreate"),
        // permissions: [lesson.create],
        meta: { titleKey: "learning:lessons.form.create.title" },
        handle: { crumb: "learning:lessons.form.create.title" },
    },
    // Lesson Edit SiteMap (placeholder for /grades/:gradeId/levels/:levelId/lessons/edit)
    {
        path: "grades/:gradeId/levels/:levelId/lessons/edit",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/site_map/LessonSiteMap"),
        meta: { titleKey: "learning:sitemap.lesson.editTitle" },
        handle: { crumb: "learning:lessons.form.edit.title" },
    },
    // Edit Lesson
    {
        path: "grades/:gradeId/levels/:levelId/lessons/edit/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsEdit"),
        // permissions: [lesson.update],
        meta: { titleKey: "learning:lessons.form.edit.title" },
        handle: { crumb: "learning:lessons.form.edit.title" },
    },
    // Lesson View SiteMap (placeholder for /grades/:gradeId/levels/:levelId/lessons/view)
    {
        path: "grades/:gradeId/levels/:levelId/lessons/view",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/site_map/LessonSiteMap"),
        meta: { titleKey: "learning:sitemap.lesson.viewTitle" },
        handle: { crumb: "learning:lessons.form.view.title" },
    },
    // View Lesson
    {
        path: "grades/:gradeId/levels/:levelId/lessons/view/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsDetail"),
        // permissions: [lesson.view],
        meta: { titleKey: "learning:lessons.form.view.title" },
        handle: { crumb: "learning:lessons.form.view.title" },
    },
    // Lesson Quiz SiteMap (placeholder for /grades/:gradeId/levels/:levelId/lessons/quiz)
    {
        path: "grades/:gradeId/levels/:levelId/lessons/quiz",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/site_map/LessonSiteMap"),
        meta: { titleKey: "learning:sitemap.lesson.quizTitle" },
        handle: { crumb: "learning:lessons.quiz.title" },
    },
    // Lesson Quizzes
    {
        path: "grades/:gradeId/levels/:levelId/lessons/quiz/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsQuizDetail"),
        // permissions: [lesson.view],
        meta: { titleKey: "learning:lessons.quiz.title" },
        handle: { crumb: "learning:lessons.quiz.title" },
    },
    // Level Quizzes
    {
        path: "grades/:gradeId/levels/:levelId/quiz",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/levels/pages/LevelsDetail"),
        // permissions: [lesson.view],
        meta: { titleKey: "learning:levels.quiz.title" },
        handle: { crumb: "learning:levels.quiz.title" },
    },
];
