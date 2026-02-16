/**
 * Auditing Feature - Navigation Module (Admin)
 *
 * Navigation configuration for the auditing feature.
 */

import type { NavItem } from "@/navigation/nav.types";
import { ClipboardCheck } from "lucide-react";
import { auditingPaths } from "./paths";

export const auditingNavItem: NavItem = {
    key: "auditing",
    labelKey: "auditing:title",
    label: "Auditing",
    href: auditingPaths.main,
    icon: ClipboardCheck,
};

export default auditingNavItem;