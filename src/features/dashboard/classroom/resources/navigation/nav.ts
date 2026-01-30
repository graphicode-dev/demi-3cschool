/**
 * Learning Resources Feature - Navigation Item
 *
 * Sidebar navigation item for the resources feature.
 */

import type { NavItem } from "@/navigation/nav.types";
import { resourcesPaths } from "./paths";
import { Files } from "lucide-react";

export const resourcesNavItem: NavItem = {
    key: "resources",
    label: "Resources",
    labelKey: "resources:nav.resources",
    href: resourcesPaths.root(),
    order: 30,
    icon: Files,
};

export default resourcesNavItem;
