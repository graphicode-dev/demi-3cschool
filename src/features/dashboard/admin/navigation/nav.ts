/**
 * Admin Feature - Navigation Module
 *
 * Navigation configuration for the admin feature.
 * Consolidates ALL admin features:
 * - Learning (standard & professional)
 * - Programs
 * - Groups Management
 * - Groups Analytics
 * - Sales Subscription
 * - Tickets Management
 * - Settings
 * - Shared features (profile, chat, certificates, reports)
 */

import type { FeatureNavModule } from "@/navigation/nav.types";
import { Settings, BookOpen, ChartColumnIcon } from "lucide-react";
import { adminSharedNavItems } from "@/features/dashboard/shared/navigation";
import { ticketsManagementNavItem } from "../ticketsManagement/navigation/nav";
import {
    learningPermissions,
    groupsPermissions,
    salesPermissions,
    eligibleStudentsPermissions,
} from "@/auth";
import { gradesPaths } from "../learning/navigation/paths";
import { programsPaths } from "../programs/navigation/paths";
import { groupsPaths } from "../groupsManagement/navigation/paths";
import { groupsAnalyticsPaths } from "../groupsAnalytics/navigation/paths";

const { course, level, lesson } = learningPermissions;
const { group, groupSession } = groupsPermissions;
const { coupon, levelPrice, subscription, installmentPayment } =
    salesPermissions;

export const adminNav: FeatureNavModule = {
    featureId: "admin",
    section: "Admin",
    order: 100,
    items: [
        // Programs Management
        {
            order: 1,
            key: "programs-management",
            labelKey: "programs:programs.breadcrumb",
            label: "Programs Management",
            href: programsPaths.list(),
            icon: BookOpen,
            permissions: [course.viewAny],
        },
        // Grades (Learning)
        {
            key: "grades",
            labelKey: "learning:grades.navTitle",
            label: "Grades",
            href: gradesPaths.list(),
            order: 2,
            permissions: [lesson.viewAny],
        },
        // Groups Analytics
        {
            order: 4,
            key: "groups-analytics",
            labelKey: "groupsAnalytics:groupsAnalytics.title",
            label: "Groups Analytics",
            href: groupsAnalyticsPaths.List(),
            icon: ChartColumnIcon,
            permissions: [group.viewAny],
        },
        // Groups Management
        {
            key: "groups",
            labelKey: "groupsManagement:groups.title",
            label: "Groups Management",
            href: groupsPaths.gradesList(),
            order: 5,
            permissions: [group.viewAny],
        },
        // Tickets Management
        ticketsManagementNavItem,
        // Settings
        {
            key: "settings",
            labelKey: "admin:nav.settings",
            label: "Settings",
            href: "/admin/settings",
            icon: Settings,
            order: 100,
        },
        // Shared features (profile, chat, certificates, reports)
        ...adminSharedNavItems,
    ],
};

export default adminNav;
