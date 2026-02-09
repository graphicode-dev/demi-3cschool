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

import type { NavItem } from "@/navigation/nav.types";
import { gradesPaths } from "./paths";
import { GraduationCap } from "lucide-react";

export const gradesNav: NavItem = {
    key: "grades",
    labelKey: "learning:grades.navTitle",
    label: "Grades",
    href: gradesPaths.list(),
    icon: GraduationCap,
    order: 2,
    // permissions: [lesson.viewAny],
};

export default gradesNav;
