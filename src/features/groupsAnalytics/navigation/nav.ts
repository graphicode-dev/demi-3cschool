/**
 * Groups Analytics - Navigation
 *
 * Navigation metadata for the groups analytics feature.
 * Includes Groups navigation items.
 * Permission-controlled sidebar items using groupsPermissions config.
 *
 * @example
 * ```ts
 * import { groupsManagementNav } from '@/features/groups/nav';
 * navRegistry.register(groupsManagementNav);
 * ```
 */

import type { FeatureNavModule } from "@/navigation/nav.types";
import { groupsPermissions } from "@/auth";
import { groupsAnalyticsPaths } from "./paths";
import { ChartColumnIcon } from "lucide-react";

const { group } = groupsPermissions;

export const groupsAnalyticsNav: FeatureNavModule = {
    featureId: "groupsAnalytics",
    section: "Groups Management",
    items: [
        {
            order: 1,
            key: "groups-analytics",
            labelKey: "groupsAnalytics:groupsAnalytics.title",
            label: "Groups Analytics",
            href: groupsAnalyticsPaths.List(),
            icon: ChartColumnIcon,
            permissions: [group.viewAny],
        },
    ],
};

export default groupsAnalyticsNav;
