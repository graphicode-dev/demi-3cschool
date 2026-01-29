/**
 * Projects Feature - Navigation Module
 *
 * Navigation configuration for the projects feature.
 */

import type { NavItem } from "@/navigation/nav.types";
import { FolderKanban } from "lucide-react";
import { PROJECTS_PATH } from "./paths";

export const projectsNavItem: NavItem = {
    key: "projects",
    labelKey: "projects:title",
    label: "Projects",
    href: PROJECTS_PATH,
    icon: FolderKanban,
    order: 30,
};

export default projectsNavItem;
