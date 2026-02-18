import { Settings } from "lucide-react";
import type { NavItem } from "@/navigation/nav.types";
import { permissionNavItem } from "../pages/permissions/navigation";

export const managementNavItem: NavItem = {
    key: "system-management",
    labelKey: "systemManagements:title",
    label: "System Management",
    href: "/admin/system-management",
    icon: Settings,
    children: [permissionNavItem],
};
