/**
 * Physical Sessions Feature - Navigation Module
 *
 * Navigation configuration for the physical sessions feature.
 * Permission-controlled sidebar items using groupsPermissions config.
 */

import type { NavItem } from "@/navigation/nav.types";
import { Building2 } from "lucide-react";
import { physicalSessions } from "./paths";

export const physicalSessionsNavItem: NavItem = {
    key: "physical-sessions",
    labelKey: "physicalSessions:title",
    label: "Physical Sessions",
    href: physicalSessions.main(),
    icon: Building2,
    order: 1,
};

export default physicalSessionsNavItem;
