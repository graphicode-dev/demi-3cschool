/**
 * Self Study Feature - Navigation Module
 *
 * Navigation configuration for the self study feature.
 * Permission-controlled sidebar items using learningPermissions config.
 */

import type { NavItem } from "@/navigation/nav.types";
import { BookOpen } from "lucide-react";
import { learningPermissions } from "@/auth";
import { selfStudy } from "./paths";

const { lesson } = learningPermissions;

export const selfStudyNavItem: NavItem = {
    key: "self-study",
    labelKey: "selfStudy:title",
    label: "Self Study",
    href: selfStudy.main(),
    icon: BookOpen,
    order: 0,
    // permissions: [lesson.viewAny],
};

export default selfStudyNavItem;
