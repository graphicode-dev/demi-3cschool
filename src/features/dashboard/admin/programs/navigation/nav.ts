/**
 * Programs Management - Navigation
 *
 * Navigation metadata for the programs management feature.
 * Includes Programs navigation items.
 * Permission-controlled sidebar items using learningPermissions config.
 *
 * @example
 * ```ts
 * import { programsManagementNav } from '@/features/programs/nav';
 * navRegistry.register(programsManagementNav);
 * ```
 */

import { BookOpen } from "lucide-react";
import type { FeatureNavModule } from "@/navigation/nav.types";
import { learningPermissions } from "@/auth";
import { programsPaths } from "./paths";

const { course } = learningPermissions;

export const programsManagementNav: FeatureNavModule = {
    featureId: "programsManagement",
    section: "Curriculum Management",
    items: [
        {
            order: 1,
            key: "programs-management",
            labelKey: "programs:programs.breadcrumb",
            label: "Programs Management",
            href: programsPaths.list(),
            icon: BookOpen,
            permissions: [course.viewAny],
        },
    ],
};

export default programsManagementNav;
