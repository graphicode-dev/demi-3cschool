/**
 * Learning Feature - Navigation
 *
 * Navigation metadata for Standard Learning and Professional Learning.
 * Each has Courses, Levels, and Lessons as sub-items.
 * Permission-controlled sidebar items using learningPermissions config.
 *
 * @example
 * ```ts
 * import { learningNav } from '@/features/learning/navigation/nav';
 * navRegistry.register(learningNav);
 * ```
 */

import type { FeatureNavModule } from "@/navigation/nav.types";
import { learningPermissions } from "@/auth";
import { standardLearningPaths, professionalLearningPaths } from "./paths";

const { course, level, lesson } = learningPermissions;

export const learningNav: FeatureNavModule = {
    featureId: "learning",
    section: "Curriculum Management",
    items: [
        {
            key: "standard-learning",
            labelKey: "learning:learning.standard.title",
            label: "Standard Learning",
            href: standardLearningPaths.courses.list(),
            order: 2,
            permissions: [course.viewAny, level.viewAny, lesson.viewAny],
            children: [
                {
                    key: "standard-courses",
                    labelKey: "learning:learning.standard.courses",
                    label: "Courses",
                    href: standardLearningPaths.courses.list(),
                    permissions: [course.viewAny],
                },
                {
                    key: "standard-levels",
                    labelKey: "learning:learning.standard.levels",
                    label: "Levels",
                    href: standardLearningPaths.levels.list(),
                    permissions: [level.viewAny],
                },
                {
                    key: "standard-lessons",
                    labelKey: "learning:learning.standard.lessons",
                    label: "Lessons",
                    href: standardLearningPaths.lessons.list(),
                    permissions: [lesson.viewAny],
                },
            ],
        },
        {
            key: "professional-learning",
            labelKey: "learning:learning.professional.title",
            label: "Professional Learning",
            href: professionalLearningPaths.courses.list(),
            order: 3,
            permissions: [course.viewAny, level.viewAny, lesson.viewAny],
            children: [
                {
                    key: "professional-courses",
                    labelKey: "learning:learning.professional.courses",
                    label: "Courses",
                    href: professionalLearningPaths.courses.list(),
                    permissions: [course.viewAny],
                },
                {
                    key: "professional-levels",
                    labelKey: "learning:learning.professional.levels",
                    label: "Levels",
                    href: professionalLearningPaths.levels.list(),
                    permissions: [level.viewAny],
                },
                {
                    key: "professional-lessons",
                    labelKey: "learning:learning.professional.lessons",
                    label: "Lessons",
                    href: professionalLearningPaths.lessons.list(),
                    permissions: [lesson.viewAny],
                },
            ],
        },
    ],
};

export default learningNav;
