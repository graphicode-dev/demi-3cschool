import type { NavItem } from "@/navigation/nav.types";
import { studentsPaths } from "./paths";
import { Users } from "lucide-react";

export const studentsNavItem: NavItem = {
    key: "students",
    labelKey: "admin:nav.students",
    label: "Students",
    href: studentsPaths.list,
    icon: Users,
};
