import type { NavItem } from "@/navigation/nav.types";
import { Building2 } from "lucide-react";
import { trainingCentersPaths } from "./paths";

export const trainingCentersNavItem: NavItem = {
    key: "training-centers",
    labelKey: "admin:nav.trainingCenters",
    label: "Training Centers",
    href: trainingCentersPaths.list,
    icon: Building2,
    order: 102,
};
