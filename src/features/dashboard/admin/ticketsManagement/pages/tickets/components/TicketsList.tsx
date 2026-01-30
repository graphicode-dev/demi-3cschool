/**
 * TicketsList Component
 *
 * Displays the list of tickets with count header.
 */

import { useTranslation } from "react-i18next";
import type { TicketListItem as TicketListItemType } from "../types";
import { TicketListItem } from "./TicketListItem";

interface TicketsListProps {
    tickets: TicketListItemType[];
    total: number;
    selectedTicketId?: string | null;
    onSelectTicket: (ticketId: string) => void;
    isLoading?: boolean;
}

export function TicketsList({
    tickets,
    total,
    selectedTicketId,
    onSelectTicket,
    isLoading,
}: TicketsListProps) {
    const { t } = useTranslation("ticketsManagement");

    if (isLoading) {
        return (
            <div className="flex-1 overflow-y-auto">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="h-6 w-24 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                </div>
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="p-4 border-b border-gray-100 dark:border-gray-700"
                    >
                        <div className="space-y-2">
                            <div className="h-4 w-20 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                            <div className="h-5 w-32 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                            <div className="h-4 w-full bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                            <div className="flex gap-2">
                                <div className="h-5 w-16 bg-gray-100 dark:bg-gray-700 rounded-full animate-pulse" />
                                <div className="h-5 w-16 bg-gray-100 dark:bg-gray-700 rounded-full animate-pulse" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            {/* Header with count */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                        {t("tickets.list.title", "Tickets")}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400">
                        {total}
                    </span>
                </div>
            </div>

            {/* Tickets list */}
            {tickets.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    {t("tickets.list.empty", "No tickets found")}
                </div>
            ) : (
                tickets.map((ticket) => (
                    <TicketListItem
                        key={ticket.id}
                        ticket={ticket}
                        isSelected={selectedTicketId === ticket.id}
                        onClick={() => onSelectTicket(ticket.id)}
                    />
                ))
            )}
        </div>
    );
}

export default TicketsList;
