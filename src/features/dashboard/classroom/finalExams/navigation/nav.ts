/**
 * Final Exams Feature - Navigation Module
 *
 * Navigation configuration for the final exams feature.
 * Permission-controlled sidebar items using learningPermissions config.
 */

import type { NavItem } from "@/navigation/nav.types";
import { GraduationCap } from "lucide-react";
import { learningPermissions } from "@/auth";
import { FINAL_EXAMS_PATH } from "./paths";

const { levelQuiz } = learningPermissions;

export const finalExamsNavItem: NavItem = {
    key: "final-exams",
    labelKey: "finalExams:title",
    label: "Final Exams",
    href: FINAL_EXAMS_PATH,
    icon: GraduationCap,
    order: 40,
    permissions: [levelQuiz.viewAny],
};

export default finalExamsNavItem;
