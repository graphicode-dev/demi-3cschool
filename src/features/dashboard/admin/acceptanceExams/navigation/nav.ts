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
import { acceptanceExamsManagementPaths } from "./paths";
import { LucideBook } from "lucide-react";
import { examsNav } from "../pages/exams/navigation/nav";
import { submissionsNav } from "../pages/submissions/navigation/nav";

export const acceptanceExamsNav: NavItem = {
    key: "acceptanceExams",
    labelKey: "acceptanceExams:title",
    label: "Acceptance Exams",
    href: acceptanceExamsManagementPaths.examsList(),
    order: 1,
    icon: LucideBook,
    // permissions: [lesson.viewAny],
    children: [submissionsNav, examsNav],
};

export default acceptanceExamsNav;
