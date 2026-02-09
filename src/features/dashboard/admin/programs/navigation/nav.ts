/**
 * Programs Management - Navigation
 *
 * Navigation metadata for the programs management feature.
 * Includes Programs navigation items.
 * Permission-controlled sidebar items using learningPermissions config.
 *
 * @example
 * ```ts
 * import { programsManagementNav } from '@/features/programs/nav';
 * navRegistry.register(programsManagementNav);
 * ```
 */

import { BookOpen } from "lucide-react";
import type { NavItem } from "@/navigation/nav.types";
import { programsPaths } from "./paths";

export const programsManagementNav: NavItem = {
    order: 0,
    key: "programs-management",
    labelKey: "programs:programs.breadcrumb",
    label: "Programs Management",
    href: programsPaths.main(),
    icon: BookOpen,
};

export default programsManagementNav;
