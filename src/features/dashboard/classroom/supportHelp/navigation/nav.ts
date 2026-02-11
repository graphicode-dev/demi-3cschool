/**
 * Support Help Feature - Navigation Module
 *
 * Navigation configuration for the support help feature (student-facing).
 */

import type { NavItem } from "@/navigation/nav.types";
import { HelpCircle } from "lucide-react";
import { supportHelp } from "./paths";

export const supportHelpNavItem: NavItem = {
    key: "support-help",
    labelKey: "supportHelp:supportHelp.pageTitle",
    label: "Support & Help",
    href: supportHelp.root(),
    icon: HelpCircle,
    order: 100,
};

export default supportHelpNavItem;
