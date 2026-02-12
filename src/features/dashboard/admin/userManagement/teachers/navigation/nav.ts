import type { NavItem } from "@/navigation/nav.types";
import { teachersPaths } from "./paths";

export const teachersNavItem: NavItem = {
    key: "teachers",
    labelKey: "admin:nav.teachers",
    label: "Teachers",
    href: teachersPaths.list,
};
