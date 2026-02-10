/**
 * SupportBlockPage Component
 *
 * Main support block page for tickets management.
 * Displays stats and collapsible block cards with leads.
 */

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { TeamStatsRow, BlocksList } from "../components";
import { useSupportBlocks } from "../api";
import type { SupportBlockStats } from "../types";
import { PageWrapper } from "@/design-system";
import Pagination from "@/design-system/components/table/Pagination";
import { Plus } from "lucide-react";
import { supportBlock } from "../navigation/paths";

export function SupportBlockPage() {
    const { t } = useTranslation("ticketsManagement");
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);

    const { data, isLoading } = useSupportBlocks(currentPage);

    const handleCreateBlock = () => {
        navigate(supportBlock.addBlock());
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Compute stats from the blocks list
    const items = data?.items;
    const stats: SupportBlockStats = useMemo(() => {
        if (!items) {
            return {
                totalBlocks: 0,
                totalLeads: 0,
                totalAgents: 0,
                totalOpenTickets: 0,
            };
        }

        return {
            totalBlocks: data?.lastPage
                ? data.lastPage * data.perPage
                : items.length,
            totalLeads: items.reduce(
                (acc, block) =>
                    acc + block.members.filter((m) => m.isLead).length,
                0
            ),
            totalAgents: items.reduce(
                (acc, block) => acc + block.totalAgents,
                0
            ),
            totalOpenTickets: items.reduce(
                (acc, block) => acc + block.openTickets,
                0
            ),
        };
    }, [items, data?.lastPage, data?.perPage]);

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("supportBlock.pageTitle", "Support Block"),
                subtitle: t(
                    "supportBlock.pageSubtitle",
                    "Understand support block hierarchy and organization"
                ),
                actions: (
                    <button
                        onClick={handleCreateBlock}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50"
                    >
                        <Plus className="w-4 h-4" />
                        {t("supportBlock.createBlock", "Create Support Block")}
                    </button>
                ),
            }}
        >
            {/* Stats Row */}
            <TeamStatsRow stats={stats} isLoading={isLoading} />

            {/* Blocks List */}
            <BlocksList blocks={data?.items || []} isLoading={isLoading} />

            {/* Pagination */}
            {data && data.lastPage > 1 && (
                <div className="mt-6">
                    <Pagination
                        currentPage={data.currentPage}
                        totalPages={data.lastPage}
                        goToNextPage={() => handlePageChange(currentPage + 1)}
                        goToPreviousPage={() =>
                            handlePageChange(currentPage - 1)
                        }
                        setPage={handlePageChange}
                        itemsPerPage={data.perPage}
                        totalItems={data.lastPage * data.perPage}
                    />
                </div>
            )}
        </PageWrapper>
    );
}

export default SupportBlockPage;
