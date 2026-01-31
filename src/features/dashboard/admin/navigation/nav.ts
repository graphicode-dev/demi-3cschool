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
    FirstTermLearningPaths,
    SecondTermLearningPaths,
    SummerCampLearningPaths,
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
        // First Term Learning
        {
            key: "first-term-learning",
            labelKey: "learning:learning.firstTerm.title",
            label: "First Term Learning",
            href: FirstTermLearningPaths.courses.list(),
            order: 2,
            permissions: [course.viewAny, level.viewAny, lesson.viewAny],
            children: [
                {
                    key: "first-term-courses",
                    labelKey: "learning:learning.firstTerm.courses",
                    label: "Courses",
                    href: FirstTermLearningPaths.courses.list(),
                    permissions: [course.viewAny],
                },
                {
                    key: "first-term-levels",
                    labelKey: "learning:learning.firstTerm.levels",
                    label: "Levels",
                    href: FirstTermLearningPaths.levels.list(),
                    permissions: [level.viewAny],
                },
                {
                    key: "first-term-lessons",
                    labelKey: "learning:learning.firstTerm.lessons",
                    label: "Lessons",
                    href: FirstTermLearningPaths.lessons.list(),
                    permissions: [lesson.viewAny],
                },
            ],
        },
        // Second Term Learning
        {
            key: "second-term-learning",
            labelKey: "learning:learning.secondTerm.title",
            label: "Second Term Learning",
            href: SecondTermLearningPaths.courses.list(),
            order: 3,
            permissions: [course.viewAny, level.viewAny, lesson.viewAny],
            children: [
                {
                    key: "second-term-courses",
                    labelKey: "learning:learning.secondTerm.courses",
                    label: "Courses",
                    href: SecondTermLearningPaths.courses.list(),
                    permissions: [course.viewAny],
                },
                {
                    key: "second-term-levels",
                    labelKey: "learning:learning.secondTerm.levels",
                    label: "Levels",
                    href: SecondTermLearningPaths.levels.list(),
                    permissions: [level.viewAny],
                },
                {
                    key: "second-term-lessons",
                    labelKey: "learning:learning.secondTerm.lessons",
                    label: "Lessons",
                    href: SecondTermLearningPaths.lessons.list(),
                    permissions: [lesson.viewAny],
                },
            ],
        },
        // Summer Camp Learning
        {
            key: "summer-camp-learning",
            labelKey: "learning:learning.summerCamp.title",
            label: "Summer Camp Learning",
            href: SummerCampLearningPaths.courses.list(),
            order: 3,
            permissions: [course.viewAny, level.viewAny, lesson.viewAny],
            children: [
                {
                    key: "summer-camp-courses",
                    labelKey: "learning:learning.summerCamp.courses",
                    label: "Courses",
                    href: SummerCampLearningPaths.courses.list(),
                    permissions: [course.viewAny],
                },
                {
                    key: "summer-camp-levels",
                    labelKey: "learning:learning.summerCamp.levels",
                    label: "Levels",
                    href: SummerCampLearningPaths.levels.list(),
                    permissions: [level.viewAny],
                },
                {
                    key: "summer-camp-lessons",
                    labelKey: "learning:learning.summerCamp.lessons",
                    label: "Lessons",
                    href: SummerCampLearningPaths.lessons.list(),
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
            href: "/admin/settings",
            icon: Settings,
            order: 100,
        },
        // Shared features (profile, chat, certificates, reports)
        ...adminSharedNavItems,
    ],
};

export default adminNav;
