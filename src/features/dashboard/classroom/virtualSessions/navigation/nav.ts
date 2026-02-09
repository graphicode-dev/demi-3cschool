/**
 * Virtual Sessions Feature - Navigation Module
 *
 * Navigation configuration for the virtual sessions feature.
 * Permission-controlled sidebar items using groupsPermissions config.
 */

import type { NavItem } from "@/navigation/nav.types";
import { Video } from "lucide-react";
import { virtualSessionsPaths } from "./paths";

export const virtualSessionsNavItem: NavItem = {
    key: "virtual-sessions",
    labelKey: "virtualSessions:title",
    label: "Virtual Sessions",
    href: virtualSessionsPaths.main(),
    icon: Video,
    order: 2,
};

export default virtualSessionsNavItem;
