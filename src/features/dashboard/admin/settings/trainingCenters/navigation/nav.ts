import type { NavItem } from "@/navigation/nav.types";
import { trainingCentersPaths } from "./paths";

export const trainingCentersNavItem: NavItem = {
    key: "training-centers",
    labelKey: "admin:nav.trainingCenters",
    label: "Training Centers",
    href: trainingCentersPaths.list,
    order: 102,
};
