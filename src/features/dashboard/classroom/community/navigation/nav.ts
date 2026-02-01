/**
 * Community Feature - Navigation Module
 *
 * Navigation configuration for the community feature.
 */

import type { NavItem } from "@/navigation/nav.types";
import { Users } from "lucide-react";
import { communityPaths } from "./paths";

export const communityNavItem: NavItem = {
    key: "community",
    labelKey: "community:title",
    label: "Community",
    href: communityPaths.main,
    icon: Users,
    order: 50,
};

export default communityNavItem;
