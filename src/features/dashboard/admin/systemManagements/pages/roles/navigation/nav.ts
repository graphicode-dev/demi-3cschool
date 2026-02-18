import type { NavItem } from "@/navigation/nav.types";
import { rolesPaths } from "./paths";

export const rolesNavItem: NavItem = {
    key: "roles",
    labelKey: "systemManagements:roles.title",
    label: "Roles",
    href: rolesPaths.main,
};
