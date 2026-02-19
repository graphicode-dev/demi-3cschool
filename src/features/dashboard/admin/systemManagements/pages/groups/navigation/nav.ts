import type { NavItem } from "@/navigation/nav.types";
import { groupsPaths } from "./paths";

export const groupsNavItem: NavItem = {
    key: "groups",
    labelKey: "systemManagements:groups.title",
    label: "Groups",
    href: groupsPaths.main,
};
