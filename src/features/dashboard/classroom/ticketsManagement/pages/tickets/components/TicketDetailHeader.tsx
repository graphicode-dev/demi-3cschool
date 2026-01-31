/**
 * TicketDetailHeader Component
 *
 * Header for ticket detail panel with ticket info and close button.
 */

import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import type { Ticket } from "../types";
import { TicketStatusBadge } from "./TicketStatusBadge";
import { TicketPriorityBadge } from "./TicketPriorityBadge";

interface TicketDetailHeaderProps {
    ticket: Ticket;
    onClose: () => void;
}

export function TicketDetailHeader({
    ticket,
    onClose,
}: TicketDetailHeaderProps) {
    const { t } = useTranslation("ticketsManagement");

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    {/* Ticket number and badges */}
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            #{ticket.ticketNumber}
                        </span>
                        <TicketStatusBadge status={ticket.status} />
                        <TicketPriorityBadge priority={ticket.priority} />
                    </div>

                    {/* Subject */}
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {ticket.subject}
                    </h2>
                </div>

                {/* Assigned agent and close button */}
                <div className="flex items-center gap-3">
                    {ticket.assignedAgentName && (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-xs font-medium">
                                {getInitials(ticket.assignedAgentName)}
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {ticket.assignedAgentName}
                            </span>
                        </div>
                    )}
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TicketDetailHeader;
