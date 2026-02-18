import type { NavItem } from "@/navigation/nav.types";
import { permissionPaths } from "./paths";

export const permissionNavItem: NavItem = {
    key: "permissions",
    labelKey: "systemManagements:permissions.title",
    label: "Permissions",
    href: permissionPaths.main,
};
