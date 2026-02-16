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
import { submissionsManagementPaths } from "./paths";

export const submissionsNav: NavItem = {
    key: "submissions",
    labelKey: "acceptanceExams:submissions.navTitle",
    label: "Exams",
    href: submissionsManagementPaths.submissionsList(),
    order: 1,
    // permissions: [lesson.viewAny],
};

export default submissionsNav;
