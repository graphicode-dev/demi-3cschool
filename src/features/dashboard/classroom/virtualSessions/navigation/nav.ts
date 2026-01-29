/**
 * Virtual Sessions Feature - Navigation Module
 *
 * Navigation configuration for the virtual sessions feature.
 */

import type { NavItem } from "@/navigation/nav.types";
import { Video } from "lucide-react";
import { virtualSessions } from "./paths";

export const virtualSessionsNavItem: NavItem = {
    key: "virtual-sessions",
    labelKey: "virtualSessions:title",
    label: "Virtual Sessions",
    href: virtualSessions.main(),
    icon: Video,
    order: 2,
};

export default virtualSessionsNavItem;
