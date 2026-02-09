/**
 * Groups Management - Navigation
 *
 * Navigation metadata for the groups management feature.
 * Includes Groups navigation items.
 * Permission-controlled sidebar items using groupsPermissions config.
 *
 * @example
 * ```ts
 * import { groupsManagementNav } from '@/features/groups/nav';
 * navRegistry.register(groupsManagementNav);
 * ```
 */

import type { NavItem } from "@/navigation/nav.types";
import { groupsPaths } from "./paths";
import { Users } from "lucide-react";

export const groupsManagementNav: NavItem = {
    key: "groups",
    labelKey: "groupsManagement:groups.title",
    label: "Groups Management",
    href: groupsPaths.gradesList(),
    icon: Users,
    order: 5,
    // permissions: [group.viewAny],
};

export default groupsManagementNav;
