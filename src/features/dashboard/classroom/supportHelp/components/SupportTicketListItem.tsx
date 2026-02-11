/**
 * SupportTicketListItem Component
 *
 * Displays a single support ticket item in the list.
 */

import type { SupportTicketListItem as SupportTicketListItemType } from "../types";
import { SupportTicketStatusBadge } from "./SupportTicketStatusBadge";
import { formatDistanceToNow } from "date-fns";

interface SupportTicketListItemProps {
    ticket: SupportTicketListItemType;
    isSelected?: boolean;
    onClick?: () => void;
}

export function SupportTicketListItem({
    ticket,
    isSelected,
    onClick,
}: SupportTicketListItemProps) {
    const timeAgo = formatDistanceToNow(new Date(ticket.createdAt), {
        addSuffix: false,
    });

    return (
        <button
            onClick={onClick}
            className={`w-full text-left p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                isSelected
                    ? "bg-brand-50 dark:bg-brand-900/20 border-l-2 border-l-brand-500"
                    : ""
            }`}
        >
            <div className="flex flex-col gap-1.5">
                {/* Ticket number and time */}
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                        #{ticket.ticketNumber}
                    </span>
                    <span className="text-[10px] text-gray-400">
                        {timeAgo} ago
                    </span>
                </div>

                {/* Subject */}
                <h4 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-1">
                    {ticket.subject}
                </h4>

                {/* Status badge */}
                <div className="flex items-center">
                    <SupportTicketStatusBadge status={ticket.status} />
                </div>
            </div>
        </button>
    );
}

export default SupportTicketListItem;
