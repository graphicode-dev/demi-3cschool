/**
 * Admin Feature - Navigation Module
 *
 * Navigation configuration for the admin feature.
 * Uses shared navigation items from dashboard/shared plus admin-only items.
 */

import type { FeatureNavModule } from "@/navigation/nav.types";
import { Settings } from "lucide-react";
import { adminSharedNavItems } from "@/features/dashboard/shared/navigation";

export const adminNav: FeatureNavModule = {
    featureId: "admin",
    section: "Admin",
    order: 100,
    items: [
        // Shared features (profile, chat, certificates, reports)
        ...adminSharedNavItems,
        // Admin-only features
        {
            key: "settings",
            labelKey: "admin:nav.settings",
            label: "Settings",
            href: "/dashboard/admin/settings",
            icon: Settings,
            order: 10,
        },
    ],
};

export default adminNav;
