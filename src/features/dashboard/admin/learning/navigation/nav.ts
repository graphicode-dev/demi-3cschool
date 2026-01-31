/**
 * Learning Feature - Navigation
 *
 * Single "Grades" navigation item that leads to grade selection.
 * Flow: Grades -> Grade 4/5/6 -> Terms -> Lessons
 *
 * @example
 * ```ts
 * import { learningNav } from '@/features/learning/navigation/nav';
 * navRegistry.register(learningNav);
 * ```
 */

import type { FeatureNavModule } from "@/navigation/nav.types";
import { learningPermissions } from "@/auth";
import { gradesPaths } from "./paths";

const { lesson } = learningPermissions;

export const learningNav: FeatureNavModule = {
    featureId: "learning",
    section: "Curriculum Management",
    items: [
        {
            key: "grades",
            labelKey: "learning:grades.navTitle",
            label: "Grades",
            href: gradesPaths.list(),
            order: 2,
            permissions: [lesson.viewAny],
        },
    ],
};

export default learningNav;
