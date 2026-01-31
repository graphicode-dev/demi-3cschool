/**
 * Groups Management - Navigation
 *
 * Navigation metadata for the groups management feature.
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
import { groupsPermissions, eligibleStudentsPermissions } from "@/auth";
import { groupsPaths } from "./paths";

const { group, groupSession } = groupsPermissions;

export const groupsManagementNav: FeatureNavModule = {
    featureId: "groupsManagement",
    section: "Groups Management",
    items: [
        {
            key: "groups",
            labelKey: "groupsManagement:groups.title",
            label: "Groups Management",
            href: groupsPaths.gradesList(),
            order: 1,
            permissions: [group.viewAny],
        },
    ],
};

export default groupsManagementNav;
