/**
 * Enrollments Group Feature - Navigation Module
 *
 * Navigation configuration for the enrollments group feature.
 */

import type { NavItem } from "@/navigation/nav.types";
import { Users } from "lucide-react";
import { ENROLLMENTS_GROUP_PATH } from "./paths";

export const enrollmentsGroupNavItem: NavItem = {
    key: "enrollmentsGroup",
    labelKey: "enrollmentsGroup:title",
    label: "Enrollments Group",
    href: ENROLLMENTS_GROUP_PATH,
    icon: Users,
    order: 25,
};

export default enrollmentsGroupNavItem;
