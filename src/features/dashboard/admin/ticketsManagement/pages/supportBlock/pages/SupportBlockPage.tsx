/**
 * SupportBlockPage Component
 *
 * Main support block page for tickets management.
 * Displays stats and collapsible block cards with agents.
 */

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { TeamStatsRow, BlocksList } from "../components";
import { useSupportBlockData } from "../api";
import { PageWrapper } from "@/design-system";
import { Edit } from "lucide-react";
import { supportBlock } from "../navigation/paths";

export function SupportBlockPage() {
    const { t } = useTranslation("ticketsManagement");
    const navigate = useNavigate();
    const { data, isLoading } = useSupportBlockData();

    const handleManageTeam = () => {
        navigate(supportBlock.manageTeam());
    };

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
                        onClick={handleManageTeam}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50"
                    >
                        <Edit />
                        {t("supportBlock.manageTeam", "Manage Team")}
                    </button>
                ),
            }}
        >
            {/* Stats Row */}
            <TeamStatsRow
                stats={
                    data?.stats || {
                        totalBlocks: 0,
                        blockLeads: 0,
                        totalAgents: 0,
                    }
                }
                isLoading={isLoading}
            />

            {/* Blocks List */}
            <BlocksList blocks={data?.blocks || []} isLoading={isLoading} />
        </PageWrapper>
    );
}

export default SupportBlockPage;
