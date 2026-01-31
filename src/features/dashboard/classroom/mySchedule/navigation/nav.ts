/**
 * My Schedule Feature - Navigation Module
 *
 * Navigation configuration for the my schedule feature.
 * Permission-controlled sidebar items using groupsPermissions config.
 */

import type { NavItem } from "@/navigation/nav.types";
import { CalendarDays } from "lucide-react";
import { MY_SCHEDULE_PATH } from "./paths";

export const myScheduleNavItem: NavItem = {
    key: "my-schedule",
    labelKey: "mySchedule:title",
    label: "My Schedule",
    href: MY_SCHEDULE_PATH,
    icon: CalendarDays,
    order: 50,
};

export default myScheduleNavItem;
