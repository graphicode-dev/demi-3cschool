/**
 * DetailsTab Component
 *
 * Displays ticket details including requester info, ticket info, and manage section.
 */

import { useTranslation } from "react-i18next";
import {
    User,
    Mail,
    Layers,
    Tag,
    Calendar,
    Clock,
    ChevronDown,
} from "lucide-react";
import type { Ticket, TicketStatus, TicketPriority } from "../types";
import { RequesterTypeBadge } from "./RequesterTypeBadge";
import { format } from "date-fns";

interface DetailsTabProps {
    ticket: Ticket;
    agents: { id: string; name: string }[];
    onUpdateTicket: (updates: {
        status?: TicketStatus;
        priority?: TicketPriority;
        assignedAgentId?: string;
    }) => void;
}

export function DetailsTab({
    ticket,
    agents,
    onUpdateTicket,
}: DetailsTabProps) {
    const { t } = useTranslation("adminTicketsManagement");

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="p-4 space-y-6 overflow-y-auto">
            {/* Requester Information */}
            <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    <User className="w-4 h-4" />
                    {t(
                        "tickets.details.requesterInfo",
                        "Requester Information"
                    )}
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white text-sm font-medium">
                            {getInitials(ticket.requester.name)}
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {ticket.requester.name}
                            </p>
                            <RequesterTypeBadge type={ticket.requester.type} />
                        </div>
                    </div>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Mail className="w-4 h-4" />
                            <span>{t("tickets.details.email", "Email")}</span>
                            <span className="text-gray-900 dark:text-white">
                                {ticket.requester.email}
                            </span>
                        </div>
                        {ticket.requester.block && (
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Layers className="w-4 h-4" />
                                <span>
                                    {t("tickets.details.block", "Block")}
                                </span>
                                <span className="text-gray-900 dark:text-white">
                                    {ticket.requester.block}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Ticket Information */}
            <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    <Tag className="w-4 h-4" />
                    {t("tickets.details.ticketInfo", "Ticket Information")}
                </h3>
                <div className="space-y-3 text-sm">
                    {ticket.category && (
                        <div className="flex items-start gap-2">
                            <Tag className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {t("tickets.details.category", "Category")}
                                </p>
                                <p className="text-gray-900 dark:text-white">
                                    {ticket.category}
                                </p>
                            </div>
                        </div>
                    )}
                    <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">
                                {t("tickets.details.created", "Created")}
                            </p>
                            <p className="text-gray-900 dark:text-white">
                                {format(
                                    new Date(ticket.createdAt),
                                    "MMM dd, yyyy h:mm a"
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-gray-500 dark:text-gray-400">
                                {t(
                                    "tickets.details.lastUpdated",
                                    "Last Updated"
                                )}
                            </p>
                            <p className="text-gray-900 dark:text-white">
                                {format(
                                    new Date(ticket.updatedAt),
                                    "MMM dd, yyyy h:mm a"
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Manage Ticket */}
            <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    <Tag className="w-4 h-4" />
                    {t("tickets.details.manageTicket", "Manage Ticket")}
                </h3>
                <div className="space-y-4">
                    {/* Status */}
                    <div>
                        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                            {t("tickets.details.status", "Status")}
                        </label>
                        <div className="relative">
                            <select
                                value={ticket.status}
                                onChange={(e) =>
                                    onUpdateTicket({
                                        status: e.target.value as TicketStatus,
                                    })
                                }
                                className="w-full appearance-none pl-3 pr-8 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent cursor-pointer"
                            >
                                <option value="open">
                                    {t("tickets.status.open", "Open")}
                                </option>
                                <option value="in_progress">
                                    {t(
                                        "tickets.status.inProgress",
                                        "In Progress"
                                    )}
                                </option>
                                <option value="resolved">
                                    {t("tickets.status.resolved", "Resolved")}
                                </option>
                                <option value="closed">
                                    {t("tickets.status.closed", "Closed")}
                                </option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                            {t("tickets.details.priority", "Priority")}
                        </label>
                        <div className="relative">
                            <select
                                value={ticket.priority}
                                onChange={(e) =>
                                    onUpdateTicket({
                                        priority: e.target
                                            .value as TicketPriority,
                                    })
                                }
                                className="w-full appearance-none pl-3 pr-8 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent cursor-pointer"
                            >
                                <option value="low">
                                    {t("tickets.priority.low", "Low")}
                                </option>
                                <option value="medium">
                                    {t("tickets.priority.medium", "Medium")}
                                </option>
                                <option value="high">
                                    {t("tickets.priority.high", "High")}
                                </option>
                                <option value="urgent">
                                    {t("tickets.priority.urgent", "Urgent")}
                                </option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Assigned Agent */}
                    <div>
                        <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                            {t(
                                "tickets.details.assignedAgent",
                                "Assigned Agent"
                            )}
                        </label>
                        <div className="relative">
                            <select
                                value={ticket.assignedAgentId || ""}
                                onChange={(e) =>
                                    onUpdateTicket({
                                        assignedAgentId: e.target.value,
                                    })
                                }
                                className="w-full appearance-none pl-3 pr-8 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent cursor-pointer"
                            >
                                <option value="">
                                    {t(
                                        "tickets.details.unassigned",
                                        "Unassigned"
                                    )}
                                </option>
                                {agents.map((agent) => (
                                    <option key={agent.id} value={agent.id}>
                                        {agent.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailsTab;
