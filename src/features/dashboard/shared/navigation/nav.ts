/**
 * Shared Dashboard Features - Navigation Module
 *
 * Creates navigation items for shared features that work with both admin and classroom.
 * Permission-controlled sidebar items using accountPermissions and supportPermissions config.
 */

import type { NavItem } from "@/navigation/nav.types";
import { User, MessageSquare, Award, FileText, Ticket } from "lucide-react";
import { accountPermissions, supportPermissions } from "@/auth";
import { getDashboardBasePath } from "./paths";

const { ticket } = supportPermissions;
const { conversation, certificate, report } = accountPermissions;

/**
 * Create shared navigation items for a specific section
 */
export const createSharedNavItems = (
    section: "admin" | "classroom"
): NavItem[] => {
    const basePath = `${getDashboardBasePath()}`;

    return [
        {
            key: "profile",
            labelKey: `${section}:nav.profile`,
            label: "Profile",
            href: `${basePath}/profile`,
            icon: User,
        },
        {
            key: "chat",
            labelKey: `${section}:nav.chat`,
            label: "Chat",
            href: `${basePath}/chat`,
            icon: MessageSquare,
            permissions: [conversation.viewAny],
        },
        {
            key: "certificates",
            labelKey: `${section}:nav.certificates`,
            label: "Certificates",
            href: `${basePath}/certificates`,
            icon: Award,
            permissions: [certificate.viewAny],
        },
        {
            key: "reports",
            labelKey: `${section}:nav.reports`,
            label: "Reports",
            href: `${basePath}/reports`,
            icon: FileText,
            permissions: [report.viewAny],
        },
    ];
};

// Pre-created nav items for each section
export const classroomSharedNavItems = createSharedNavItems("classroom");
export const adminSharedNavItems = createSharedNavItems("admin");
