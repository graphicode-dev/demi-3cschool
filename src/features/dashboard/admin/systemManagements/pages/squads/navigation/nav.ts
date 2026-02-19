import type { NavItem } from "@/navigation/nav.types";
import { squadsPaths } from "./paths";

export const squadsNavItem: NavItem = {
    key: "squads",
    labelKey: "systemManagements:squads.title",
    label: "Squads",
    href: squadsPaths.main,
};
