import type { NavItem } from "@/navigation/nav.types";
import { slotsPaths } from "./paths";

export const slotsNavItem: NavItem = {
    key: "slots",
    labelKey: "admin:nav.slots",
    label: "Slots",
    href: slotsPaths.main,
    order: 101,
};
