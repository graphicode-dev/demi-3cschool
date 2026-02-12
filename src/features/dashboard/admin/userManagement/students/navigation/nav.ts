import type { NavItem } from "@/navigation/nav.types";
import { studentsPaths } from "./paths";

export const studentsNavItem: NavItem = {
    key: "students",
    labelKey: "admin:nav.students",
    label: "Students",
    href: studentsPaths.list,
};
