/**
 * Learning Feature - Routes
 *
 * Route configuration for Standard Learning and Professional Learning.
 * Both use shared page components - the curriculum type is determined from URL path.
 * Uses FeatureRouteModule format for the new routing architecture.
 *
 * Permission-controlled routes using learningPermissions config.
 */

import type { RouteConfig, FeatureRouteModule } from "@/router/routes.types";
import { learningPermissions } from "@/auth";

const { course, level, lesson } = learningPermissions;

// ============================================================================
// Standard Learning Routes
// ============================================================================

const standardLearningRoutes: RouteConfig[] = [
    // Courses
    {
        path: "standard-learning/courses",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/courses/pages/CoursesList"),
        permissions: [course.viewAny],
        meta: { titleKey: "learning:learning.standard.courses" },
        handle: { crumb: "learning:learning.standard.courses" },
    },
    {
        path: "standard-learning/courses/create",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/courses/pages/CoursesCreate"),
        permissions: [course.create],
        meta: { titleKey: "learning:courses.form.create.title" },
        handle: { crumb: "learning:courses.form.create.title" },
    },
    {
        path: "standard-learning/courses/edit/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/courses/pages/CoursesEdit"),
        permissions: [course.update],
        meta: { titleKey: "learning:courses.form.edit.title" },
        handle: { crumb: "learning:courses.form.edit.title" },
    },

    // Levels
    {
        path: "standard-learning/levels",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/levels/pages/LevelsList"),
        permissions: [level.viewAny],
        meta: { titleKey: "learning:learning.standard.levels" },
        handle: { crumb: "learning:learning.standard.levels" },
    },
    {
        path: "standard-learning/levels/create",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/levels/pages/LevelsCreate"),
        permissions: [level.create],
        meta: { titleKey: "learning:levels.form.create.title" },
        handle: { crumb: "learning:levels.form.create.title" },
    },
    {
        path: "standard-learning/levels/edit/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/levels/pages/LevelsEdit"),
        permissions: [level.update],
        meta: { titleKey: "learning:levels.form.edit.title" },
        handle: { crumb: "learning:levels.form.edit.title" },
    },
    {
        path: "standard-learning/levels/view/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/levels/pages/LevelsDetail"),
        permissions: [level.view],
        meta: { titleKey: "learning:levels.detail.title" },
        handle: { crumb: "learning:levels.detail.title" },
    },

    // Lessons
    {
        path: "standard-learning/lessons",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsList"),
        permissions: [lesson.viewAny],
        meta: { titleKey: "learning:learning.standard.lessons" },
        handle: { crumb: "learning:learning.standard.lessons" },
    },
    {
        path: "standard-learning/lessons/create",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsCreate"),
        permissions: [lesson.create],
        meta: { titleKey: "learning:lessons.form.create.title" },
        handle: { crumb: "learning:lessons.form.create.title" },
    },
    {
        path: "standard-learning/lessons/edit/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsEdit"),
        permissions: [lesson.update],
        meta: { titleKey: "learning:lessons.form.edit.title" },
        handle: { crumb: "learning:lessons.form.edit.title" },
    },
    {
        path: "standard-learning/lessons/view/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsDetail"),
        permissions: [lesson.view],
        meta: { titleKey: "learning:lessons.form.view.title" },
        handle: {
            crumb: (params: Record<string, string>) => `Lesson #${params.id}`,
        },
    },
];

// ============================================================================
// Professional Learning Routes (same pages, different paths)
// ============================================================================

const professionalLearningRoutes: RouteConfig[] = [
    // Courses
    {
        path: "professional-learning/courses",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/courses/pages/CoursesList"),
        permissions: [course.viewAny],
        meta: { titleKey: "learning:learning.professional.courses" },
        handle: { crumb: "learning:learning.professional.courses" },
    },
    {
        path: "professional-learning/courses/create",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/courses/pages/CoursesCreate"),
        permissions: [course.create],
        meta: { titleKey: "learning:courses.form.create.title" },
        handle: { crumb: "learning:courses.form.create.title" },
    },
    {
        path: "professional-learning/courses/edit/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/courses/pages/CoursesEdit"),
        permissions: [course.update],
        meta: { titleKey: "learning:courses.form.edit.title" },
        handle: { crumb: "learning:courses.form.edit.title" },
    },
    // Levels
    {
        path: "professional-learning/levels",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/levels/pages/LevelsList"),
        permissions: [level.viewAny],
        meta: { titleKey: "learning:learning.professional.levels" },
        handle: { crumb: "learning:learning.professional.levels" },
    },
    {
        path: "professional-learning/levels/create",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/levels/pages/LevelsCreate"),
        permissions: [level.create],
        meta: { titleKey: "learning:levels.form.create.title" },
        handle: { crumb: "learning:levels.form.create.title" },
    },
    {
        path: "professional-learning/levels/edit/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/levels/pages/LevelsEdit"),
        permissions: [level.update],
        meta: { titleKey: "learning:levels.form.edit.title" },
        handle: { crumb: "learning:levels.form.edit.title" },
    },
    {
        path: "professional-learning/levels/view/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/levels/pages/LevelsDetail"),
        permissions: [level.view],
        meta: { titleKey: "learning:levels.detail.title" },
        handle: { crumb: "learning:levels.detail.title" },
    },

    // Lessons
    {
        path: "professional-learning/lessons",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsList"),
        permissions: [lesson.viewAny],
        meta: { titleKey: "learning:learning.professional.lessons" },
        handle: { crumb: "learning:learning.professional.lessons" },
    },
    {
        path: "professional-learning/lessons/create",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsCreate"),
        permissions: [lesson.create],
        meta: { titleKey: "learning:lessons.form.create.title" },
        handle: { crumb: "learning:lessons.form.create.title" },
    },
    {
        path: "professional-learning/lessons/edit/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsEdit"),
        permissions: [lesson.update],
        meta: { titleKey: "learning:lessons.form.edit.title" },
        handle: { crumb: "learning:lessons.form.edit.title" },
    },
    {
        path: "professional-learning/lessons/view/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsDetail"),
        permissions: [lesson.view],
        meta: { titleKey: "learning:lessons.form.view.title" },
        handle: {
            crumb: (params: Record<string, string>) => `Lesson #${params.id}`,
        },
    },
];

// ============================================================================
// Feature Route Module
// ============================================================================

export const learningRoutes: FeatureRouteModule = {
    id: "learning",
    name: "Learning",
    basePath: "/dashboard",
    layout: "dashboard",
    routes: {
        meta: {
            titleKey: "learning:learning.title",
            requiresAuth: true,
        },
        children: [...standardLearningRoutes, ...professionalLearningRoutes],
    },
};

export default learningRoutes;
