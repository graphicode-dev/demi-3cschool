/**
 * Tickets Management Feature - Navigation Config
 *
 * Navigation items for the tickets management feature.
 * Permission-controlled sidebar items using supportPermissions config.
 */

import type { NavItem } from "@/navigation/nav.types";
import { ticketsPaths } from "./paths";
import { Ticket } from "lucide-react";

export const ticketsManagementNavItem: NavItem = {
    key: "tickets-management",
    label: "Tickets Management",
    labelKey: "sidebar.sections.ticketsManagement",
    href: ticketsPaths.overview(),
    icon: Ticket,
    order: 6,
    children: [
        {
            key: "overview",
            label: "Overview",
            labelKey: "ticketsManagement:nav.overview",
            href: ticketsPaths.overview(),
        },
        {
            key: "support-block",
            label: "Support Block",
            labelKey: "ticketsManagement:nav.supportBlock",
            href: ticketsPaths.supportBlock(),
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
