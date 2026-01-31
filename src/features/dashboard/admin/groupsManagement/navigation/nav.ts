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
            href: groupsPaths.regularList(),
            order: 1,
            permissions: [group.viewAny],
            children: [
                {
                    key: "regular-groups",
                    labelKey: "groupsManagement:groups.regularListBreadcrumb",
                    label: "Regular Groups",
                    href: groupsPaths.regularList(),
                    permissions: [group.viewAny],
                },
                {
                    key: "semi-private-groups",
                    labelKey:
                        "groupsManagement:groups.semiPrivateListBreadcrumb",
                    label: "Semi Private Groups",
                    href: groupsPaths.semiPrivateList(),
                    permissions: [group.viewAny],
                },
                {
                    key: "private-groups",
                    labelKey: "groupsManagement:groups.privateListBreadcrumb",
                    label: "Private Groups",
                    href: groupsPaths.privateList(),
                    permissions: [group.viewAny],
                },
                {
                    key: "sessions-groups",
                    labelKey: "groupsManagement:groups.sessionsListBreadcrumb",
                    label: "Sessions Groups",
                    href: groupsPaths.sessionsList(),
                    permissions: [groupSession.viewAny],
                },
            ],
        },
    ],
};

export default groupsManagementNav;
