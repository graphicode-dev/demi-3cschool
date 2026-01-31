/**
 * Virtual Sessions Feature - Navigation Module
 *
 * Navigation configuration for the virtual sessions feature.
 * Permission-controlled sidebar items using groupsPermissions config.
 */

import type { NavItem } from "@/navigation/nav.types";
import { Video } from "lucide-react";
import { groupsPermissions } from "@/auth";
import { virtualSessions } from "./paths";

const { groupSession } = groupsPermissions;

export const virtualSessionsNavItem: NavItem = {
    key: "virtual-sessions",
    labelKey: "virtualSessions:title",
    label: "Virtual Sessions",
    href: virtualSessions.main(),
    icon: Video,
    order: 2,
    permissions: [groupSession.viewAny],
};

export default virtualSessionsNavItem;
