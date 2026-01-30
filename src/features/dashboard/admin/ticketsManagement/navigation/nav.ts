/**
 * Tickets Management Feature - Navigation Config
 *
 * Navigation items for the tickets management feature.
 * Permission-controlled sidebar items using supportPermissions config.
 */

import type { NavItem } from "@/navigation/nav.types";
import { ticketsPaths } from "./paths";

export const ticketsManagementNavItem: NavItem = {
    key: "tickets-management",
    label: "Tickets Management",
    labelKey: "sidebar.sections.ticketsManagement",
    href: ticketsPaths.overview(),
    children: [
        {
            key: "overview",
            label: "Overview",
            labelKey: "ticketsManagement:nav.overview",
            href: ticketsPaths.overview(),
        },
        {
            key: "team-structure",
            label: "Team Structure",
            labelKey: "ticketsManagement:nav.teamStructure",
            href: ticketsPaths.teamStructure(),
        },
        {
            key: "tickets",
            label: "Tickets",
            labelKey: "ticketsManagement:nav.tickets",
            href: ticketsPaths.tickets(),
        },
        {
            key: "distribution",
            label: "Distribution",
            labelKey: "ticketsManagement:nav.distribution",
            href: ticketsPaths.distribution(),
        },
        {
            key: "performance",
            label: "Performance",
            labelKey: "ticketsManagement:nav.performance",
            href: ticketsPaths.performance(),
        },
    ],
};
