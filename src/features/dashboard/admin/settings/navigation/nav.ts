import { Settings } from "lucide-react";
import type { NavItem } from "@/navigation/nav.types";
import { slotsNavItem } from "../slots/navigation/nav";
import { trainingCentersNavItem } from "../trainingCenters/navigation/nav";
import { teachersNavItem } from "../teachers/navigation/nav";
import { studentsNavItem } from "../students/navigation/nav";

export const settingsNavItem: NavItem = {
    key: "settings",
    labelKey: "admin:nav.settings",
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    order: 100,
    children: [
        slotsNavItem,
        trainingCentersNavItem,
        teachersNavItem,
        studentsNavItem,
    ],
};
