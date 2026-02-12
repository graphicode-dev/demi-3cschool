/**
 * TicketsPage Component
 *
 * Main tickets page with split view - list on left, detail on right.
 */

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    TicketFilters,
    TicketsList,
    TicketEmptyState,
    TicketDetailPanel,
} from "../components";
import {
    useTicketsList,
    useTicket,
    useFilterOptions,
    useSendMessage,
    useAddNote,
    useUpdateTicketStatus,
    useUpdateTicketPriority,
} from "../api";
import type {
    TicketFilters as TicketFiltersType,
    TicketStatus,
    TicketPriority,
} from "../types";
import { PageWrapper, useServerTableSearch } from "@/design-system";
import { useSearchParams } from "react-router-dom";
import Pagination from "@/design-system/components/table/Pagination";

export function TicketsPage() {
    const { t } = useTranslation("adminTicketsManagement");
    const [filters, setFilters] = useState<TicketFiltersType>({});
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
        null
    );
    const [searchParams, setSearchParams] = useSearchParams();

    const currentPage = Number(searchParams.get("page")) || 1;

    const { searchQuery, setSearchQuery, debouncedSearchQuery } =
        useServerTableSearch({
            delayMs: 400,
        });

    const { data: ticketsData, isLoading: isLoadingTickets } = useTicketsList(
        {
            page: currentPage,
            ...(debouncedSearchQuery ? { search: debouncedSearchQuery } : {}),
        },
        filters
    );
    const { data: selectedTicket, isLoading: isLoadingTicket } =
        useTicket(selectedTicketId);
    const { data: filterOptions } = useFilterOptions();

    // Mutations
    const sendMessageMutation = useSendMessage();
    const addNoteMutation = useAddNote();
    const updateStatusMutation = useUpdateTicketStatus();
    const updatePriorityMutation = useUpdateTicketPriority();

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
            message: content,
        });
    };

    const handleAddNote = (content: string) => {
        if (!selectedTicketId) return;
        addNoteMutation.mutate({
            ticketId: selectedTicketId,
            note: content,
        });
    };

    const handleUpdateTicket = (updates: {
        status?: TicketStatus;
        priority?: TicketPriority;
        assignedAgentId?: string;
    }) => {
        if (!selectedTicketId) return;

        if (updates.status) {
            updateStatusMutation.mutate({
                id: selectedTicketId,
                payload: { status: updates.status },
            });
        }

        if (updates.priority) {
            updatePriorityMutation.mutate({
                id: selectedTicketId,
                payload: { priority: updates.priority },
            });
        }
    };

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("tickets.pageTitle", "Tickets"),
                subtitle: t(
                    "tickets.pageSubtitle",
                    "Manage and resolve support tickets"
                ),
            }}
        >
            {/* Filters */}
            <TicketFilters
                filters={filters}
                onFiltersChange={setFilters}
                agents={filterOptions?.agents || []}
                blocks={filterOptions?.blocks || []}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            {/* Main content - split view */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left panel - Tickets list */}
                <div className="w-full md:w-[350px] lg:w-[400px] flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                    <TicketsList
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

                {/* Right panel - Ticket detail or empty state */}
                <div className="hidden md:flex flex-1 flex-col">
                    {selectedTicket ? (
                        <TicketDetailPanel
                            ticket={selectedTicket}
                            agents={filterOptions?.agents || []}
                            onClose={() => setSelectedTicketId(null)}
                            onSendMessage={handleSendMessage}
                            onAddNote={handleAddNote}
                            onUpdateTicket={handleUpdateTicket}
                            isLoading={isLoadingTicket}
                        />
                    ) : (
                        <TicketEmptyState />
                    )}
                </div>
            </div>
        </PageWrapper>
    );
}

export default TicketsPage;
