/**
 * Acceptance Exams Feature - Navigation
 *
 * Single "Grades" navigation item that leads to grade selection.
 * Flow: Exams -> Grade 4/5/6 -> Terms -> Lessons
 *
 * @example
 * ```ts
 * import { acceptanceExamsNav } from '@/features/dashboard/admin/acceptanceExams/navigation/nav';
 * navRegistry.register(acceptanceExamsNav);
 * ```
 */

import type { NavItem } from "@/navigation/nav.types";
import { acceptanceExamsPaths } from "./paths";

export const examsNav: NavItem = {
    key: "exams",
    labelKey: "acceptanceExams:exams.navTitle",
    label: "Exams",
    href: acceptanceExamsPaths.list(),
    order: 2,
    // permissions: [lesson.viewAny],
};

export default examsNav;
