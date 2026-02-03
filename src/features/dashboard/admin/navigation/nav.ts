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
import {
    Settings,
    BookOpen,
    ChartColumnIcon,
    ShieldCheck,
    GraduationCap,
    Users,
    FolderOpen,
    Clock,
} from "lucide-react";
import { adminSharedNavItems } from "@/features/dashboard/shared/navigation";
import { ticketsManagementNavItem } from "../ticketsManagement/navigation/nav";
import { communityManagementPaths } from "../communityManagement/navigation/paths";
import {
    learningPermissions,
    groupsPermissions,
    salesPermissions,
    eligibleStudentsPermissions,
} from "@/auth";
import { gradesPaths } from "../learning/navigation/paths";
import { groupsPaths } from "../groupsManagement/navigation/paths";
import { groupsAnalyticsPaths } from "../groupsAnalytics/navigation/paths";
import { slotsPaths } from "../settings/slots/navigation/paths";
import { slotsNavItem } from "../settings/slots/navigation/nav";
import { trainingCentersNavItem } from "../settings/trainingCenters/navigation/nav";
import { resourcesNavItem } from "../resources/navigation/nav";
import { teachersNavItem } from "../settings/teachers/navigation/nav";

const { course, level, lesson } = learningPermissions;
const { group, groupSession } = groupsPermissions;
const { coupon, levelPrice, subscription, installmentPayment } =
    salesPermissions;

export const adminNav: FeatureNavModule = {
    featureId: "admin",
    section: "Admin",
    order: 100,
    items: [
        // Grades (Learning)
        {
            key: "grades",
            labelKey: "learning:grades.navTitle",
            label: "Grades",
            href: gradesPaths.list(),
            icon: GraduationCap,
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
            icon: Users,
            order: 5,
            permissions: [group.viewAny],
        },
        // Resources
        resourcesNavItem,
        // Tickets Management
        ticketsManagementNavItem,
        // Community Management
        {
            key: "community-management",
            labelKey: "communityManagement:title",
            label: "Community Management",
            href: communityManagementPaths.main,
            icon: ShieldCheck,
            order: 60,
        },
        // Settings
        {
            key: "settings",
            labelKey: "admin:nav.settings",
            label: "Settings",
            href: "/admin/settings",
            icon: Settings,
            order: 100,
            children: [slotsNavItem, trainingCentersNavItem, teachersNavItem],
        },
        // Shared features (profile, chat, certificates, reports)
        ...adminSharedNavItems,
    ],
};

export default adminNav;
