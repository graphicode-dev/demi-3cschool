/**
 * Projects Feature - Navigation Module
 *
 * Navigation configuration for the projects feature.
 * Permission-controlled sidebar items using learningPermissions config.
 */

import type { NavItem } from "@/navigation/nav.types";
import { FolderKanban } from "lucide-react";
import { projectsPaths } from "./paths";

export const projectsNavItem: NavItem = {
    key: "projects",
    labelKey: "projects:title",
    label: "Projects",
    href: projectsPaths.root(),
    icon: FolderKanban,
    order: 30,
};

export default projectsNavItem;
