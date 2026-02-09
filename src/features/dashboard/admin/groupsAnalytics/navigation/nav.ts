/**
 * Groups Analytics - Navigation
 *
 * Navigation metadata for the groups analytics feature.
 * Includes Groups navigation items.
 * Permission-controlled sidebar items using groupsPermissions config.
 *
 * @example
 * ```ts
 * import { groupsManagementNav } from '@/features/groups/nav';
 * navRegistry.register(groupsManagementNav);
 * ```
 */

import { groupsAnalyticsPaths } from "./paths";
import { ChartColumnIcon } from "lucide-react";
import type { NavItem } from "@/navigation/nav.types";

export const groupsAnalyticsNav: NavItem = {
    order: 4,
    key: "groups-analytics",
    labelKey: "groupsAnalytics:groupsAnalytics.title",
    label: "Groups Analytics",
    href: groupsAnalyticsPaths.List(),
    icon: ChartColumnIcon,
    // permissions: [group.viewAny],
};

export default groupsAnalyticsNav;
