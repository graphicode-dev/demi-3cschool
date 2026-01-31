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
// First Term Learning Routes
// ============================================================================

const firstTermLearningRoutes: RouteConfig[] = [
    // Courses
    {
        path: "first-term/courses",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/courses/pages/CoursesList"),
        permissions: [course.viewAny],
        meta: { titleKey: "learning:learning.standard.courses" },
        handle: { crumb: "learning:learning.standard.courses" },
    },
    {
        path: "first-term/courses/create",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/courses/pages/CoursesCreate"),
        permissions: [course.create],
        meta: { titleKey: "learning:courses.form.create.title" },
        handle: { crumb: "learning:courses.form.create.title" },
    },
    {
        path: "first-term/courses/edit/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/courses/pages/CoursesEdit"),
        permissions: [course.update],
        meta: { titleKey: "learning:courses.form.edit.title" },
        handle: { crumb: "learning:courses.form.edit.title" },
    },

    // Levels
    {
        path: "first-term/levels",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/levels/pages/LevelsList"),
        permissions: [level.viewAny],
        meta: { titleKey: "learning:learning.standard.levels" },
        handle: { crumb: "learning:learning.standard.levels" },
    },
    {
        path: "first-term/levels/create",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/levels/pages/LevelsCreate"),
        permissions: [level.create],
        meta: { titleKey: "learning:levels.form.create.title" },
        handle: { crumb: "learning:levels.form.create.title" },
    },
    {
        path: "first-term/levels/edit/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/levels/pages/LevelsEdit"),
        permissions: [level.update],
        meta: { titleKey: "learning:levels.form.edit.title" },
        handle: { crumb: "learning:levels.form.edit.title" },
    },
    {
        path: "first-term/levels/view/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/levels/pages/LevelsDetail"),
        permissions: [level.view],
        meta: { titleKey: "learning:levels.detail.title" },
        handle: { crumb: "learning:levels.detail.title" },
    },

    // Lessons
    {
        path: "first-term/lessons",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsList"),
        permissions: [lesson.viewAny],
        meta: { titleKey: "learning:learning.standard.lessons" },
        handle: { crumb: "learning:learning.standard.lessons" },
    },
    {
        path: "first-term/lessons/create",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsCreate"),
        permissions: [lesson.create],
        meta: { titleKey: "learning:lessons.form.create.title" },
        handle: { crumb: "learning:lessons.form.create.title" },
    },
    {
        path: "first-term/lessons/edit/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsEdit"),
        permissions: [lesson.update],
        meta: { titleKey: "learning:lessons.form.edit.title" },
        handle: { crumb: "learning:lessons.form.edit.title" },
    },
    {
        path: "first-term/lessons/view/:id",
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
// Second Term Learning Routes (same pages, different paths)
// ============================================================================

const secondTermLearningRoutes: RouteConfig[] = [
    // Courses
    {
        path: "second-term/courses",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/courses/pages/CoursesList"),
        permissions: [course.viewAny],
        meta: { titleKey: "learning:learning.professional.courses" },
        handle: { crumb: "learning:learning.professional.courses" },
    },
    {
        path: "second-term/courses/create",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/courses/pages/CoursesCreate"),
        permissions: [course.create],
        meta: { titleKey: "learning:courses.form.create.title" },
        handle: { crumb: "learning:courses.form.create.title" },
    },
    {
        path: "second-term/courses/edit/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/courses/pages/CoursesEdit"),
        permissions: [course.update],
        meta: { titleKey: "learning:courses.form.edit.title" },
        handle: { crumb: "learning:courses.form.edit.title" },
    },
    // Levels
    {
        path: "second-term/levels",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/levels/pages/LevelsList"),
        permissions: [level.viewAny],
        meta: { titleKey: "learning:learning.professional.levels" },
        handle: { crumb: "learning:learning.professional.levels" },
    },
    {
        path: "second-term/levels/create",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/levels/pages/LevelsCreate"),
        permissions: [level.create],
        meta: { titleKey: "learning:levels.form.create.title" },
        handle: { crumb: "learning:levels.form.create.title" },
    },
    {
        path: "second-term/levels/edit/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/levels/pages/LevelsEdit"),
        permissions: [level.update],
        meta: { titleKey: "learning:levels.form.edit.title" },
        handle: { crumb: "learning:levels.form.edit.title" },
    },
    {
        path: "second-term/levels/view/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/levels/pages/LevelsDetail"),
        permissions: [level.view],
        meta: { titleKey: "learning:levels.detail.title" },
        handle: { crumb: "learning:levels.detail.title" },
    },

    // Lessons
    {
        path: "second-term/lessons",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsList"),
        permissions: [lesson.viewAny],
        meta: { titleKey: "learning:learning.professional.lessons" },
        handle: { crumb: "learning:learning.professional.lessons" },
    },
    {
        path: "second-term/lessons/create",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsCreate"),
        permissions: [lesson.create],
        meta: { titleKey: "learning:lessons.form.create.title" },
        handle: { crumb: "learning:lessons.form.create.title" },
    },
    {
        path: "second-term/lessons/edit/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsEdit"),
        permissions: [lesson.update],
        meta: { titleKey: "learning:lessons.form.edit.title" },
        handle: { crumb: "learning:lessons.form.edit.title" },
    },
    {
        path: "second-term/lessons/view/:id",
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
// Summer Camp Learning Routes (same pages, different paths)
// ============================================================================

const summerCampLearningRoutes: RouteConfig[] = [
    // Courses
    {
        path: "summer-camp/courses",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/courses/pages/CoursesList"),
        permissions: [course.viewAny],
        meta: { titleKey: "learning:learning.professional.courses" },
        handle: { crumb: "learning:learning.professional.courses" },
    },
    {
        path: "summer-camp/courses/create",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/courses/pages/CoursesCreate"),
        permissions: [course.create],
        meta: { titleKey: "learning:courses.form.create.title" },
        handle: { crumb: "learning:courses.form.create.title" },
    },
    {
        path: "summer-camp/courses/edit/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/courses/pages/CoursesEdit"),
        permissions: [course.update],
        meta: { titleKey: "learning:courses.form.edit.title" },
        handle: { crumb: "learning:courses.form.edit.title" },
    },
    // Levels
    {
        path: "summer-camp/levels",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/levels/pages/LevelsList"),
        permissions: [level.viewAny],
        meta: { titleKey: "learning:learning.professional.levels" },
        handle: { crumb: "learning:learning.professional.levels" },
    },
    {
        path: "summer-camp/levels/create",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/levels/pages/LevelsCreate"),
        permissions: [level.create],
        meta: { titleKey: "learning:levels.form.create.title" },
        handle: { crumb: "learning:levels.form.create.title" },
    },
    {
        path: "summer-camp/levels/edit/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/levels/pages/LevelsEdit"),
        permissions: [level.update],
        meta: { titleKey: "learning:levels.form.edit.title" },
        handle: { crumb: "learning:levels.form.edit.title" },
    },
    {
        path: "summer-camp/levels/view/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/levels/pages/LevelsDetail"),
        permissions: [level.view],
        meta: { titleKey: "learning:levels.detail.title" },
        handle: { crumb: "learning:levels.detail.title" },
    },

    // Lessons
    {
        path: "summer-camp/lessons",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsList"),
        permissions: [lesson.viewAny],
        meta: { titleKey: "learning:learning.professional.lessons" },
        handle: { crumb: "learning:learning.professional.lessons" },
    },
    {
        path: "summer-camp/lessons/create",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsCreate"),
        permissions: [lesson.create],
        meta: { titleKey: "learning:lessons.form.create.title" },
        handle: { crumb: "learning:lessons.form.create.title" },
    },
    {
        path: "summer-camp/lessons/edit/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsEdit"),
        permissions: [lesson.update],
        meta: { titleKey: "learning:lessons.form.edit.title" },
        handle: { crumb: "learning:lessons.form.edit.title" },
    },
    {
        path: "summer-camp/lessons/view/:id",
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
    basePath: "/admin",
    layout: "dashboard",
    routes: {
        meta: {
            titleKey: "learning:learning.title",
            requiresAuth: true,
        },
        children: [
            ...firstTermLearningRoutes,
            ...secondTermLearningRoutes,
            ...summerCampLearningRoutes,
        ],
    },
};

export default learningRoutes;
