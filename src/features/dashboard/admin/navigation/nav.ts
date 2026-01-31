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
import {
    standardLearningPaths,
    professionalLearningPaths,
} from "../learning/navigation/paths";
import { programsPaths } from "../programs/navigation/paths";
import { groupsPaths } from "../groupsManagement/navigation/paths";
import { groupsAnalyticsPaths } from "../groupsAnalytics/navigation/paths";
import { salesPaths } from "../sales_subscription/navigation/paths";

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
        // Standard Learning
        {
            key: "standard-learning",
            labelKey: "learning:learning.standard.title",
            label: "Standard Learning",
            href: standardLearningPaths.courses.list(),
            order: 2,
            permissions: [course.viewAny, level.viewAny, lesson.viewAny],
            children: [
                {
                    key: "standard-courses",
                    labelKey: "learning:learning.standard.courses",
                    label: "Courses",
                    href: standardLearningPaths.courses.list(),
                    permissions: [course.viewAny],
                },
                {
                    key: "standard-levels",
                    labelKey: "learning:learning.standard.levels",
                    label: "Levels",
                    href: standardLearningPaths.levels.list(),
                    permissions: [level.viewAny],
                },
                {
                    key: "standard-lessons",
                    labelKey: "learning:learning.standard.lessons",
                    label: "Lessons",
                    href: standardLearningPaths.lessons.list(),
                    permissions: [lesson.viewAny],
                },
            ],
        },
        // Professional Learning
        {
            key: "professional-learning",
            labelKey: "learning:learning.professional.title",
            label: "Professional Learning",
            href: professionalLearningPaths.courses.list(),
            order: 3,
            permissions: [course.viewAny, level.viewAny, lesson.viewAny],
            children: [
                {
                    key: "professional-courses",
                    labelKey: "learning:learning.professional.courses",
                    label: "Courses",
                    href: professionalLearningPaths.courses.list(),
                    permissions: [course.viewAny],
                },
                {
                    key: "professional-levels",
                    labelKey: "learning:learning.professional.levels",
                    label: "Levels",
                    href: professionalLearningPaths.levels.list(),
                    permissions: [level.viewAny],
                },
                {
                    key: "professional-lessons",
                    labelKey: "learning:learning.professional.lessons",
                    label: "Lessons",
                    href: professionalLearningPaths.lessons.list(),
                    permissions: [lesson.viewAny],
                },
            ],
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
            href: groupsPaths.regularList(),
            order: 5,
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
                {
                    key: "eligible-students",
                    labelKey: "groupsManagement:eligibleStudents.title",
                    label: "Eligible Students",
                    href: groupsPaths.eligibleStudents.list(),
                    permissions: [eligibleStudentsPermissions.viewAny],
                },
            ],
        },
        // Sales Subscription
        {
            key: "sales",
            labelKey: "sales_subscription:salesAnalysis.title",
            label: "Sales",
            href: salesPaths.coupons.list(),
            order: 6,
            permissions: [
                coupon.viewAny,
                levelPrice.viewAny,
                subscription.viewAny,
                installmentPayment.viewAny,
            ],
            children: [
                {
                    key: "coupons",
                    labelKey: "sales_subscription:coupons.title",
                    label: "Coupons",
                    href: salesPaths.coupons.list(),
                    order: 1,
                    permissions: [coupon.viewAny],
                },
                {
                    key: "price-lists",
                    labelKey: "sales_subscription:priceLists.title",
                    label: "Price Lists",
                    href: salesPaths.priceLists.list(),
                    order: 2,
                    permissions: [levelPrice.viewAny],
                },
                {
                    key: "purchases",
                    labelKey: "sales_subscription:purchases.title",
                    label: "Purchases",
                    href: salesPaths.purchases.list(),
                    order: 3,
                    permissions: [subscription.viewAny],
                },
                {
                    key: "installments",
                    labelKey: "sales_subscription:installments.title",
                    label: "Installments",
                    href: salesPaths.payments.list(),
                    order: 4,
                    permissions: [installmentPayment.viewAny],
                },
            ],
        },
        // Tickets Management
        ticketsManagementNavItem,
        // Settings
        {
            key: "settings",
            labelKey: "admin:nav.settings",
            label: "Settings",
            href: "/dashboard/admin/settings",
            icon: Settings,
            order: 100,
        },
        // Shared features (profile, chat, certificates, reports)
        ...adminSharedNavItems,
    ],
};

export default adminNav;
