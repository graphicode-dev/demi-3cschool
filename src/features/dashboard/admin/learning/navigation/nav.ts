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
import {
    FirstTermLearningPaths,
    SecondTermLearningPaths,
    SummerCampLearningPaths,
} from "./paths";

const { course, level, lesson } = learningPermissions;

export const learningNav: FeatureNavModule = {
    featureId: "learning",
    section: "Curriculum Management",
    items: [
        {
            key: "first-term-learning",
            labelKey: "learning:learning.standard.title",
            label: "Standard Learning",
            href: FirstTermLearningPaths.courses.list(),
            order: 2,
            permissions: [course.viewAny, level.viewAny, lesson.viewAny],
            children: [
                {
                    key: "first-term-courses",
                    labelKey: "learning:learning.standard.courses",
                    label: "Courses",
                    href: FirstTermLearningPaths.courses.list(),
                    permissions: [course.viewAny],
                },
                {
                    key: "first-term-levels",
                    labelKey: "learning:learning.standard.levels",
                    label: "Levels",
                    href: FirstTermLearningPaths.levels.list(),
                    permissions: [level.viewAny],
                },
                {
                    key: "first-term-lessons",
                    labelKey: "learning:learning.standard.lessons",
                    label: "Lessons",
                    href: FirstTermLearningPaths.lessons.list(),
                    permissions: [lesson.viewAny],
                },
            ],
        },
        {
            key: "second-term-learning",
            labelKey: "learning:learning.professional.title",
            label: "Professional Learning",
            href: SecondTermLearningPaths.courses.list(),
            order: 3,
            permissions: [course.viewAny, level.viewAny, lesson.viewAny],
            children: [
                {
                    key: "second-term-courses",
                    labelKey: "learning:learning.professional.courses",
                    label: "Courses",
                    href: SecondTermLearningPaths.courses.list(),
                    permissions: [course.viewAny],
                },
                {
                    key: "second-term-levels",
                    labelKey: "learning:learning.professional.levels",
                    label: "Levels",
                    href: SecondTermLearningPaths.levels.list(),
                    permissions: [level.viewAny],
                },
                {
                    key: "second-term-lessons",
                    labelKey: "learning:learning.professional.lessons",
                    label: "Lessons",
                    href: SecondTermLearningPaths.lessons.list(),
                    permissions: [lesson.viewAny],
                },
            ],
        },
        {
            key: "summer-camp-learning",
            labelKey: "learning:learning.summer-camp.title",
            label: "Summer Camp",
            href: SummerCampLearningPaths.courses.list(),
            order: 4,
            permissions: [course.viewAny, level.viewAny, lesson.viewAny],
            children: [
                {
                    key: "summer-camp-courses",
                    labelKey: "learning:learning.summer-camp.courses",
                    label: "Courses",
                    href: SummerCampLearningPaths.courses.list(),
                    permissions: [course.viewAny],
                },
                {
                    key: "summer-camp-levels",
                    labelKey: "learning:learning.summer-camp.levels",
                    label: "Levels",
                    href: SummerCampLearningPaths.levels.list(),
                    permissions: [level.viewAny],
                },
                {
                    key: "summer-camp-lessons",
                    labelKey: "learning:learning.summer-camp.lessons",
                    label: "Lessons",
                    href: SummerCampLearningPaths.lessons.list(),
                    permissions: [lesson.viewAny],
                },
            ],
        },
    ],
};

export default learningNav;
