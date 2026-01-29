/**
 * Shared Dashboard Features - Navigation Module
 *
 * Creates navigation items for shared features that work with both admin and classroom.
 */

import type { NavItem } from "@/navigation/nav.types";
import { User, MessageSquare, Award, FileText, Ticket } from "lucide-react";
import { ticketsPaths } from "../ticketsManagement/navigation/paths";
import { supportPermissions } from "@/auth";

const { ticket } = supportPermissions;

/**
 * Create shared navigation items for a specific section
 */
export const createSharedNavItems = (
    section: "admin" | "classroom"
): NavItem[] => {
    const basePath = `/dashboard/${section}`;

    return [
        {
            key: "profile",
            labelKey: `${section}:nav.profile`,
            label: "Profile",
            href: `${basePath}/profile`,
            icon: User,
            order: 0,
        },
        {
            key: "chat",
            labelKey: `${section}:nav.chat`,
            label: "Chat",
            href: `${basePath}/chat`,
            icon: MessageSquare,
            order: 1,
        },
        {
            key: "certificates",
            labelKey: `${section}:nav.certificates`,
            label: "Certificates",
            href: `${basePath}/certificates`,
            icon: Award,
            order: 2,
        },
        {
            key: "reports",
            labelKey: `${section}:nav.reports`,
            label: "Reports",
            href: `${basePath}/reports`,
            icon: FileText,
            order: 3,
        },
        {
            key: "tickets-management",
            labelKey: "sidebar.sections.ticketsManagement",
            label: "Tickets Management",
            href: ticketsPaths.overview(),
            icon: Ticket,
            order: 4,
            permissions: [ticket.viewAny],
            children: [
                {
                    key: "overview",
                    label: "Overview",
                    labelKey: "ticketsManagement:nav.overview",
                    href: ticketsPaths.overview(),
                    permissions: [ticket.viewAny],
                },
                {
                    key: "team-structure",
                    label: "Team Structure",
                    labelKey: "ticketsManagement:nav.teamStructure",
                    href: ticketsPaths.teamStructure(),
                    permissions: [ticket.viewAny],
                },
                {
                    key: "tickets",
                    label: "Tickets",
                    labelKey: "ticketsManagement:nav.tickets",
                    href: ticketsPaths.tickets(),
                    permissions: [ticket.viewAny],
                },
                {
                    key: "distribution",
                    label: "Distribution",
                    labelKey: "ticketsManagement:nav.distribution",
                    href: ticketsPaths.distribution(),
                    permissions: [ticket.viewAny],
                },
                {
                    key: "performance",
                    label: "Performance",
                    labelKey: "ticketsManagement:nav.performance",
                    href: ticketsPaths.performance(),
                    permissions: [ticket.viewAny],
                },
            ],
        },
    ];
};

// Pre-created nav items for each section
export const classroomSharedNavItems = createSharedNavItems("classroom");
export const adminSharedNavItems = createSharedNavItems("admin");
