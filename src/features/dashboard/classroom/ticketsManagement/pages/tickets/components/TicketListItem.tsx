/**
 * TicketListItem Component
 *
 * Displays a single ticket item in the list.
 */

import { useTranslation } from "react-i18next";
import type { TicketListItem as TicketListItemType } from "../types";
import { TicketStatusBadge } from "./TicketStatusBadge";
import { TicketPriorityBadge } from "./TicketPriorityBadge";
import { RequesterTypeBadge } from "./RequesterTypeBadge";
import { formatDistanceToNow } from "date-fns";

interface TicketListItemProps {
    ticket: TicketListItemType;
    isSelected?: boolean;
    onClick?: () => void;
}

export function TicketListItem({
    ticket,
    isSelected,
    onClick,
}: TicketListItemProps) {
    const { t } = useTranslation("ticketsManagement");

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const timeAgo = formatDistanceToNow(new Date(ticket.createdAt), {
        addSuffix: true,
    });

    return (
        <button
            onClick={onClick}
            className={`w-full text-left p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                isSelected
                    ? "bg-blue-50 dark:bg-blue-900/20 border-l-2 border-l-brand-500"
                    : ""
            }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    {/* Ticket number and requester type */}
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            #{ticket.ticketNumber}
                        </span>
                        <RequesterTypeBadge type={ticket.requesterType} />
                    </div>

                    {/* Requester name */}
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {ticket.requesterName}
                    </h4>

                    {/* Subject */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                        {ticket.subject}
                    </p>

                    {/* Status and Priority badges */}
                    <div className="flex items-center gap-2">
                        <TicketStatusBadge status={ticket.status} />
                        <TicketPriorityBadge priority={ticket.priority} />
                    </div>
                </div>

                {/* Right side - Avatar and time */}
                <div className="flex flex-col items-end gap-2">
                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-xs font-medium">
                        {ticket.requesterAvatar ? (
                            <img
                                src={ticket.requesterAvatar}
                                alt={ticket.requesterName}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            getInitials(ticket.requesterName)
                        )}
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                        {timeAgo}
                    </span>
                </div>
            </div>
        </button>
    );
}

export default TicketListItem;
