/**
 * SupportTicketsList Component
 *
 * Displays the list of support tickets with count header.
 */

import { useTranslation } from "react-i18next";
import type { SupportTicketListItem as SupportTicketListItemType } from "../types";
import { SupportTicketListItem } from "./SupportTicketListItem";

interface SupportTicketsListProps {
    tickets: SupportTicketListItemType[];
    total: number;
    selectedTicketId?: string | null;
    onSelectTicket: (ticketId: string) => void;
    isLoading?: boolean;
}

export function SupportTicketsList({
    tickets,
    total,
    selectedTicketId,
    onSelectTicket,
    isLoading,
}: SupportTicketsListProps) {
    const { t } = useTranslation("supportHelp");

    if (isLoading) {
        return (
            <div className="flex-1 overflow-y-auto">
                <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                    <div className="h-4 w-20 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                </div>
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="p-3 border-b border-gray-100 dark:border-gray-700"
                    >
                        <div className="space-y-1.5">
                            <div className="h-3 w-16 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                            <div className="h-4 w-40 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                            <div className="h-4 w-14 bg-gray-100 dark:bg-gray-700 rounded-full animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            {/* Header with count */}
            <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-1.5">
                    <span className="font-medium text-sm text-gray-900 dark:text-white">
                        {t("supportHelp.tickets.title", "Tickets")}
                    </span>
                    <span className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400">
                        {total}
                    </span>
                </div>
            </div>

            {/* Tickets list */}
            {tickets.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    {t("supportHelp.tickets.empty", "No tickets found")}
                </div>
            ) : (
                tickets.map((ticket) => (
                    <SupportTicketListItem
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

export default SupportTicketsList;
