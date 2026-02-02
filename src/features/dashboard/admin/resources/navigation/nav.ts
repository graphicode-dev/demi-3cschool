import { FolderOpen } from "lucide-react";
import type { NavItem } from "@/navigation/nav.types";

export const resourcesNavItem: NavItem = {
    key: "resources",
    labelKey: "adminResources:resources",
    label: "Resources",
    href: "/admin/resources",
    icon: FolderOpen,
    order: 6,
};
