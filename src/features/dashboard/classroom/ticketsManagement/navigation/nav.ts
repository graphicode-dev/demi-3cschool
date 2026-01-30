/**
 * Tickets Management Feature - Navigation Config
 *
 * Navigation items for the tickets management feature.
 * Permission-controlled sidebar items using supportPermissions config.
 */

import { FeatureNavModule } from "@/navigation";
import { supportPermissions } from "@/auth";
import { ticketsPaths } from "./paths";

const { ticket } = supportPermissions;

export const ticketsManagementNav: FeatureNavModule = {
    featureId: "tickets-management",
    section: "Tickets Management",
    items: [
        {
            key: "overview",
            label: "Overview",
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
        },
    ],
};
