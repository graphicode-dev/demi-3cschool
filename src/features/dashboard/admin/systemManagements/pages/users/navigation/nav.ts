import type { NavItem } from "@/navigation/nav.types";
import { usersPaths } from "./paths";

export const usersNavItem: NavItem = {
    key: "users",
    labelKey: "systemManagements:users.title",
    label: "Permissions",
    href: usersPaths.main,
};
