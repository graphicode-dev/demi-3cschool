/**
 * SupportTicketEmptyState Component
 *
 * Displays empty state when no ticket is selected.
 */

import { useTranslation } from "react-i18next";
import { Ticket } from "lucide-react";

export function SupportTicketEmptyState() {
    const { t } = useTranslation("ticketsManagement");

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="w-24 h-24 flex items-center justify-center mb-3">
                <Ticket
                    className="w-24 h-24 text-gray-300 dark:text-gray-600"
                    strokeWidth={1}
                />
            </div>
            <h3 className="text-lg font-semibold text-gray-400 dark:text-gray-500 mb-1">
                {t("supportHelp.emptyState.title", "Select a ticket")}
            </h3>
            <p className="text-sm text-gray-400 dark:text-gray-500">
                {t(
                    "supportHelp.emptyState.description",
                    "Choose a ticket from the list to view details"
                )}
            </p>
        </div>
    );
}

export default SupportTicketEmptyState;
