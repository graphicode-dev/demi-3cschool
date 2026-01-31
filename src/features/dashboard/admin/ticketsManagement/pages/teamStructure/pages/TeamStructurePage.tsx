/**
 * TeamStructurePage Component
 *
 * Main team structure page for tickets management.
 * Displays stats and collapsible block cards with agents.
 */

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { TeamStatsRow, BlocksList } from "../components";
import { useTeamStructureData } from "../api";
import PageWrapper from "@/design-system/components/PageWrapper";
import { Edit } from "lucide-react";
import { teamStructure } from "../navigation/paths";

export function TeamStructurePage() {
    const { t } = useTranslation("ticketsManagement");
    const navigate = useNavigate();
    const { data, isLoading } = useTeamStructureData();

    const handleManageTeam = () => {
        navigate(teamStructure.manageTeam());
    };

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("teamStructure.pageTitle", "Team Structure"),
                subtitle: t(
                    "teamStructure.pageSubtitle",
                    "Understand team hierarchy and organization"
                ),
                actions: (
                    <button
                        onClick={handleManageTeam}
                        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50"
                    >
                        <Edit />
                        {t("teamStructure.manageTeam", "Manage Team")}
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

export default TeamStructurePage;
