/**
 * Learning Feature - Routes
 *
 * Route configuration for Grades navigation.
 * New flow: Grades -> Levels -> Lessons
 * Uses FeatureRouteModule format for the new routing architecture.
 *
 * Permission-controlled routes using learningPermissions config.
 */

import type { RouteConfig, FeatureRouteModule } from "@/router/routes.types";
import { learningPermissions } from "@/auth";

const { course, level, lesson } = learningPermissions;

// ============================================================================
// Grades Navigation Routes (New Structure)
// ============================================================================

const gradesRoutes: RouteConfig[] = [
    // Grades List
    {
        path: "grades",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/grades/pages/GradesList"),
        permissions: [lesson.viewAny],
        meta: { titleKey: "learning:grades.title" },
        handle: { crumb: "learning:grades.title" },
    },
    // Levels List for a Grade
    {
        path: "grades/:gradeId/levels",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/grades/pages/LevelsList"),
        permissions: [lesson.viewAny],
        meta: { titleKey: "learning:levels.title" },
        handle: { crumb: "learning:levels.title" },
    },
    // Lessons List for a Level
    {
        path: "grades/:gradeId/levels/:levelId/lessons",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsList"),
        permissions: [lesson.viewAny],
        meta: { titleKey: "learning:lessons.title" },
        handle: { crumb: "learning:lessons.title" },
    },
    // Create Lesson
    {
        path: "grades/:gradeId/levels/:levelId/lessons/create",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsCreate"),
        permissions: [lesson.create],
        meta: { titleKey: "learning:lessons.form.create.title" },
        handle: { crumb: "learning:lessons.form.create.title" },
    },
    // Edit Lesson
    {
        path: "grades/:gradeId/levels/:levelId/lessons/edit/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsEdit"),
        permissions: [lesson.update],
        meta: { titleKey: "learning:lessons.form.edit.title" },
        handle: { crumb: "learning:lessons.form.edit.title" },
    },
    // View Lesson
    {
        path: "grades/:gradeId/levels/:levelId/lessons/view/:id",
        lazy: () =>
            import("@/features/dashboard/admin/learning/pages/lessons/pages/LessonsDetail"),
        permissions: [lesson.view],
        meta: { titleKey: "learning:lessons.form.view.title" },
        handle: { crumb: "learning:lessons.form.view.title" },
    },
];

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
        children: [...gradesRoutes],
    },
};

export default learningRoutes;
