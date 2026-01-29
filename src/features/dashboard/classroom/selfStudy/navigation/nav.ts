/**
 * Self Study Feature - Navigation Module
 *
 * Navigation configuration for the self study feature.
 */

import type { NavItem } from "@/navigation/nav.types";
import { BookOpen } from "lucide-react";
import { selfStudy } from "./paths";

export const selfStudyNavItem: NavItem = {
    key: "self-study",
    labelKey: "selfStudy:title",
    label: "Self Study",
    href: selfStudy.main(),
    icon: BookOpen,
    order: 10,
};

export default selfStudyNavItem;
