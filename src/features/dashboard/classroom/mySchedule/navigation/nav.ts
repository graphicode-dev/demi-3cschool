/**
 * My Schedule Feature - Navigation Module
 *
 * Navigation configuration for the my schedule feature.
 * Permission-controlled sidebar items using groupsPermissions config.
 */

import type { NavItem } from "@/navigation/nav.types";
import { CalendarDays } from "lucide-react";
import { groupsPermissions } from "@/auth";
import { MY_SCHEDULE_PATH } from "./paths";

const { groupSession } = groupsPermissions;

export const myScheduleNavItem: NavItem = {
    key: "my-schedule",
    labelKey: "mySchedule:title",
    label: "My Schedule",
    href: MY_SCHEDULE_PATH,
    icon: CalendarDays,
    order: 50,
    permissions: [groupSession.viewAny],
};

export default myScheduleNavItem;
