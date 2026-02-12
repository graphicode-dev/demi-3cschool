import {  UserCog } from "lucide-react";
import type { NavItem } from "@/navigation/nav.types";
import { teachersNavItem } from "../teachers/navigation/nav";
import { studentsNavItem } from "../students/navigation/nav";

export const userManagementNavItem: NavItem = {
    key: "userManagement",
    labelKey: "admin:nav.userManagement",
    label: "User Management",
    href: "/admin/userManagement",
    icon: UserCog,
    order: 100,
    children: [
        teachersNavItem,
        studentsNavItem,
    ],
};
