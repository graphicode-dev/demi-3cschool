import type { NavItem } from "@/navigation/nav.types";
import { slotsPaths } from "./paths";
import { Clock } from "lucide-react";

export const slotsNavItem: NavItem = {
    key: "slots",
    labelKey: "admin:nav.slots",
    label: "Slots",
    href: slotsPaths.main,
    icon: Clock,
    order: 101,
};
