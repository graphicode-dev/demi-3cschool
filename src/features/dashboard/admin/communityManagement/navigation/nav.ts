/**
 * Community Management Feature - Navigation Module (Admin)
 *
 * Navigation configuration for the community management feature.
 */

import type { NavItem } from "@/navigation/nav.types";
import { ShieldCheck } from "lucide-react";
import { communityManagementPaths } from "./paths";

export const communityManagementNavItem: NavItem = {
    key: "community-management",
    labelKey: "communityManagement:title",
    label: "Community Management",
    href: communityManagementPaths.main,
    icon: ShieldCheck,
    order: 60,
};

export default communityManagementNavItem;
