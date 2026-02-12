/**
 * SupportHelpPage Component
 *
 * Main support & help page for students with split view - list on left, detail on right.
 */

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Search, Plus } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    SupportFilterTabs,
    SupportTicketsList,
    SupportTicketEmptyState,
    SupportTicketDetailPanel,
} from "../components";
import {
    useSupportTicketsList,
    useSupportTicket,
    useSendSupportMessage,
} from "../api";
import type { SupportTicketFilter } from "../types";
import { supportHelp } from "../navigation";
import { PageWrapper, useServerTableSearch } from "@/design-system";
import Pagination from "@/design-system/components/table/Pagination";

export function SupportHelpPage() {
    const { t } = useTranslation("supportHelp");
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] =
        useState<SupportTicketFilter>("all");
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
        null
    );
    const [searchParams, setSearchParams] = useSearchParams();

    const currentPage = Number(searchParams.get("page")) || 1;

    const { searchQuery, setSearchQuery, debouncedSearchQuery } =
        useServerTableSearch({
            delayMs: 400,
        });

    // Fetch tickets list from API
    const { data: ticketsData, isLoading: isLoadingTickets } =
        useSupportTicketsList(
            {
                page: currentPage,
                ...(debouncedSearchQuery
                    ? { search: debouncedSearchQuery }
                    : {}),
            },
            activeFilter
        );

    // Fetch selected ticket detail
    const { data: selectedTicket, isLoading: isLoadingTicket } =
        useSupportTicket(selectedTicketId);

    // Send message mutation
    const sendMessageMutation = useSendSupportMessage();

    const totalCount = useMemo(() => {
        if (!ticketsData) return;
        return ticketsData.lastPage > 1
            ? (ticketsData.lastPage - 1) * ticketsData.perPage +
                  ticketsData.items.length
            : ticketsData.items.length;
    }, [ticketsData]);

    const handlePageChange = (page: number) => {
        setSearchParams({ page: String(page) });
    };

    const handleSendMessage = (content: string) => {
        if (!selectedTicketId) return;
        sendMessageMutation.mutate({
            ticketId: selectedTicketId,
            content,
        });
    };

    const handleCreateTicket = () => {
        navigate(supportHelp.create());
    };

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("supportHelp.pageTitle", "Support & Help"),
                subtitle: t(
                    "supportHelp.pageSubtitle",
                    "Need help? Ask our support team."
                ),
            }}
        >
            {/* Header Section */}
            <div className="p-4 pb-0">
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
                        tickets={ticketsData?.items ?? []}
                        total={totalCount!}
                        selectedTicketId={selectedTicketId}
                        onSelectTicket={setSelectedTicketId}
                        isLoading={isLoadingTickets}
                    />

                    {/* Pagination */}
                    {ticketsData && (
                        <div className="mt-6">
                            <Pagination
                                currentPage={ticketsData.currentPage}
                                totalPages={ticketsData.lastPage}
                                goToNextPage={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                goToPreviousPage={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                setPage={handlePageChange}
                                itemsPerPage={ticketsData.perPage}
                                totalItems={
                                    ticketsData.lastPage * ticketsData.perPage
                                }
                            />
                        </div>
                    )}
                </div>

                {/* Right Panel - Ticket Detail or Empty State */}
                <div className="hidden md:flex flex-1 flex-col overflow-hidden">
                    {selectedTicket ? (
                        <SupportTicketDetailPanel
                            ticket={selectedTicket}
                            onSendMessage={handleSendMessage}
                            isLoading={isLoadingTicket}
                        />
                    ) : (
                        <SupportTicketEmptyState />
                    )}
                </div>
            </div>
        </PageWrapper>
    );
}

export default SupportHelpPage;
