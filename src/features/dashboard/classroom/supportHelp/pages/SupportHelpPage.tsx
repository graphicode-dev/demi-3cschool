/**
 * SupportHelpPage Component
 *
 * Main support & help page for students with split view - list on left, detail on right.
 */

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    SupportFilterTabs,
    SupportTicketsList,
    SupportTicketEmptyState,
    SupportTicketDetailPanel,
} from "../components";
import { mockSupportTickets, mockSupportTicketDetail } from "../mockData";
import type { SupportTicketFilter } from "../types";
import { supportHelp } from "../navigation";

export function SupportHelpPage() {
    const { t } = useTranslation("supportHelp");
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] =
        useState<SupportTicketFilter>("all");
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
        null
    );

    // Filter tickets based on search and filter
    const filteredTickets = useMemo(() => {
        let tickets = [...mockSupportTickets];

        // Apply status filter
        if (activeFilter !== "all") {
            tickets = tickets.filter(
                (ticket) => ticket.status === activeFilter
            );
        }

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            tickets = tickets.filter(
                (ticket) =>
                    ticket.subject.toLowerCase().includes(query) ||
                    ticket.ticketNumber.toLowerCase().includes(query)
            );
        }

        return tickets;
    }, [activeFilter, searchQuery]);

    // Get selected ticket detail (mock)
    const selectedTicket = selectedTicketId ? mockSupportTicketDetail : null;

    const handleSendMessage = (content: string) => {
        console.log("Send message:", content);
        // TODO: Implement API call
    };

    const handleCreateTicket = () => {
        navigate(supportHelp.create());
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header Section */}
            <div className="p-4 pb-0">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {t("supportHelp.pageTitle", "Support & Help")}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t(
                            "supportHelp.pageSubtitle",
                            "Need help? Ask our support team."
                        )}
                    </p>
                </div>

                {/* Search Input */}
                <div className="mb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t(
                                "supportHelp.searchPlaceholder",
                                "Search your problem..."
                            )}
                            className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center justify-between mb-4">
                    <SupportFilterTabs
                        activeFilter={activeFilter}
                        onFilterChange={setActiveFilter}
                    />
                    <button
                        onClick={handleCreateTicket}
                        className="flex items-center gap-1.5 px-4 py-2 bg-brand-500 text-white rounded-full font-medium text-sm shadow-md hover:bg-brand-600 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        {t("supportHelp.createTicket.button", "New Ticket")}
                    </button>
                </div>
            </div>

            {/* Main Content - Split View */}
            <div className="flex-1 flex gap-4 p-4 pt-0 overflow-hidden">
                {/* Left Panel - Tickets List */}
                <div className="w-full md:w-[320px] flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                    <SupportTicketsList
                        tickets={filteredTickets}
                        total={filteredTickets.length}
                        selectedTicketId={selectedTicketId}
                        onSelectTicket={setSelectedTicketId}
                        isLoading={false}
                    />
                </div>

                {/* Right Panel - Ticket Detail or Empty State */}
                <div className="hidden md:flex flex-1 flex-col overflow-hidden">
                    {selectedTicket ? (
                        <SupportTicketDetailPanel
                            ticket={selectedTicket}
                            onSendMessage={handleSendMessage}
                            isLoading={false}
                        />
                    ) : (
                        <SupportTicketEmptyState />
                    )}
                </div>
            </div>
        </div>
    );
}

export default SupportHelpPage;
