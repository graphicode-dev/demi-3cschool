/**
 * DistributionPage Component
 *
 * Main distribution page for tickets management.
 * Displays workload organization and balancing.
 */

import { useTranslation } from "react-i18next";
import {
    DistributionStatsRow,
    DistributionMethodCard,
    TicketsPerBlockChart,
    TicketsPerAgentChart,
    BlockWorkloadOverviewSection,
    AgentWorkloadIndicatorsSection,
    HighWorkloadAlert,
} from "../components";
import { useDistributionData } from "../api";
import PageWrapper from "@/design-system/components/PageWrapper";

export function DistributionPage() {
    const { t } = useTranslation("ticketsManagement");
    const { data, isLoading } = useDistributionData();

    const handleToggleMethod = (isActive: boolean) => {
        // TODO: Implement with mutation
        console.log("Toggle method:", isActive);
    };

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("distribution.pageTitle", "Distribution"),
                subtitle: t(
                    "distribution.pageSubtitle",
                    "Workload organization and balancing"
                ),
            }}
        >
            {/* Stats Row */}
            <DistributionStatsRow
                stats={
                    data?.stats || {
                        totalActiveTickets: 0,
                        availableAgents: 0,
                        avgTicketsPerAgent: 0,
                    }
                }
                isLoading={isLoading}
            />

            {/* Distribution Method */}
            <DistributionMethodCard
                config={
                    data?.methodConfig || {
                        method: "load_balance",
                        isActive: true,
                        description: "",
                    }
                }
                onToggle={handleToggleMethod}
                isLoading={isLoading}
            />

            {/* Charts Row - Tickets per Block & Tickets per Agent */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TicketsPerBlockChart
                    data={data?.ticketsPerBlock || []}
                    isLoading={isLoading}
                />
                <TicketsPerAgentChart
                    data={data?.ticketsPerAgent || []}
                    isLoading={isLoading}
                />
            </div>

            {/* Block Workload Overview */}
            <BlockWorkloadOverviewSection
                blocks={data?.blockWorkloadOverview || []}
                isLoading={isLoading}
            />

            {/* Agent Workload Indicators */}
            <AgentWorkloadIndicatorsSection
                agents={data?.agentWorkloadIndicators || []}
                isLoading={isLoading}
            />

            {/* High Workload Alert */}
            <HighWorkloadAlert
                isVisible={data?.hasHighWorkloadAlert || false}
            />
        </PageWrapper>
    );
}

export default DistributionPage;
