import type { NavItem } from "@/navigation/nav.types";
import { teachersPaths } from "./paths";
import { Users } from "lucide-react";

export const teachersNavItem: NavItem = {
    key: "teachers",
    labelKey: "admin:nav.teachers",
    label: "Teachers",
    href: teachersPaths.list,
    icon: Users,
};
