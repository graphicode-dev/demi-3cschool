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
import { adminSharedNavItems } from "@/features/dashboard/shared/navigation";
import { ticketsManagementNavItem } from "../ticketsManagement/navigation/nav";
import { resourcesNavItem } from "../resources/navigation/nav";
import { programsManagementNav } from "../programs/navigation";
import { communityManagementNavItem } from "../communityManagement";
import { groupsAnalyticsNav } from "../groupsAnalytics/navigation";
import { groupsManagementNav } from "../groupsManagement/navigation";
import gradesNav from "../learning/navigation";
import { settingsNavItem } from "../settings/navigation/nav";
import { userManagementNavItem } from "../userManagement/navigation/nav";

export const adminNav: FeatureNavModule = {
    featureId: "admin",
    section: "Admin",
    order: 100,
    items: [
        // Grades (Learning)
        gradesNav,
        // Groups Analytics
        // groupsAnalyticsNav,
        // Groups Management
        groupsManagementNav,
        // Resources
        resourcesNavItem,
        // Tickets Management
        ticketsManagementNavItem,
        // Community Management
        communityManagementNavItem,
        // Settings
        settingsNavItem,
        // User Management
        userManagementNavItem,
        // Programs Management
        programsManagementNav,
        // Shared features (profile, chat, certificates, reports)
        ...adminSharedNavItems,
    ],
};

export default adminNav;
