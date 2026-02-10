import type { RouteConfig } from "@/router";
import { Navigate } from "react-router-dom";
import { supportBlock } from "./paths";

/**
 * Support Block feature routes
 *
 * These are imported and spread into the main ticketsManagement routes.
 */
export const supportBlockRoutes: RouteConfig[] = [
    {
        path: "support-block",
        lazy: () =>
            import("../pages/SupportBlockPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Support Block",
            titleKey: "ticketsManagement:supportBlock.pageTitle",
            requiresAuth: true,
        },
    },
    {
        path: "support-block/manage",
        lazy: () =>
            import("../pages/ManageTeamPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Manage Team",
            titleKey: "ticketsManagement:manageTeam.pageTitle",
            requiresAuth: true,
        },
    },
    {
        path: "support-block/manage/lead/add",
        lazy: () =>
            import("../pages/lead/AddLeadPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Add Lead",
            titleKey: "ticketsManagement:manageTeam.addLead.pageTitle",
            requiresAuth: true,
        },
    },
    {
        path: "support-block/manage/lead/:id/edit",
        lazy: () =>
            import("../pages/lead/EditLeadPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Edit Lead",
            titleKey: "ticketsManagement:manageTeam.editLead.pageTitle",
            requiresAuth: true,
        },
    },
    {
        path: "support-block/manage/lead/:id/change-block",
        lazy: () =>
            import("../pages/lead/ChangeBlockPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Change Block",
            titleKey: "ticketsManagement:manageTeam.changeBlock.pageTitle",
            requiresAuth: true,
        },
    },
    {
        path: "support-block/manage/lead/:id/convert",
        lazy: () =>
            import("../pages/lead/ConvertLeadToAgentPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Convert Lead to Agent",
            titleKey: "ticketsManagement:manageTeam.convertLead.pageTitle",
            requiresAuth: true,
        },
    },
    // Lead redirect routes (for breadcrumb navigation)
    {
        path: "support-block/manage/lead",
        element: <Navigate to={supportBlock.manageTeam()} replace />,
        meta: {
            title: "Lead",
            requiresAuth: true,
        },
    },
    {
        path: "support-block/manage/lead/:id",
        element: <Navigate to={supportBlock.manageTeam()} replace />,
        meta: {
            title: "Lead",
            requiresAuth: true,
        },
    },
    // Agent routes
    {
        path: "support-block/manage/agent/add",
        lazy: () =>
            import("../pages/agent/AddAgentPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Add Agent",
            titleKey: "ticketsManagement:manageTeam.addAgent.pageTitle",
            requiresAuth: true,
        },
    },
    {
        path: "support-block/manage/agent/:id/edit",
        lazy: () =>
            import("../pages/agent/EditAgentPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Edit Agent",
            titleKey: "ticketsManagement:manageTeam.editAgent.pageTitle",
            requiresAuth: true,
        },
    },
    {
        path: "support-block/manage/agent/:id/promote",
        lazy: () =>
            import("../pages/agent/PromoteAgentToLeadPage").then((m) => ({
                default: m.default,
            })),
        meta: {
            title: "Promote Agent to Lead",
            titleKey: "ticketsManagement:manageTeam.promoteAgent.pageTitle",
            requiresAuth: true,
        },
    },
    // Agent redirect routes (for breadcrumb navigation)
    {
        path: "support-block/manage/agent",
        element: <Navigate to={supportBlock.manageTeam()} replace />,
        meta: {
            title: "Agent",
            requiresAuth: true,
        },
    },
    {
        path: "support-block/manage/agent/:id",
        element: <Navigate to={supportBlock.manageTeam()} replace />,
        meta: {
            title: "Agent",
            requiresAuth: true,
        },
    },
];
