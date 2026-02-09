/**
 * Overview Management - Navigation
 *
 * Navigation metadata for the overview management feature.
 * Includes Overview navigation items.
 * Permission-controlled sidebar items using dashboardPermissions config.
 *
 * @example
 * ```ts
 * import { overviewManagementNav } from '@/features/overview/nav';
 * navRegistry.register(overviewManagementNav);
 * ```
 */

import type { NavItem } from "@/navigation/nav.types";
import { dashboardPermissions } from "@/auth/permission.config";
import { overviewPaths } from "./paths";

export const overviewManagementNav: NavItem = {
    order: 1,
    key: "overview",
    labelKey: "overview:overview.breadcrumb",
    label: "Overview",
    href: overviewPaths.list(),
    hidden: true,
    permissions: [dashboardPermissions.view],
};

export default overviewManagementNav;
