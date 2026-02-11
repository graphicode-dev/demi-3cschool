/**
 * TicketEmptyState Component
 *
 * Displays empty state when no ticket is selected.
 */

import { useTranslation } from "react-i18next";
import { Ticket } from "lucide-react";

export function TicketEmptyState() {
    const { t } = useTranslation("adminTicketsManagement");

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                <Ticket className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t("tickets.emptyState.title", "Select a ticket")}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                {t(
                    "tickets.emptyState.description",
                    "Choose a ticket from the list to view details"
                )}
            </p>
        </div>
    );
}

export default TicketEmptyState;
