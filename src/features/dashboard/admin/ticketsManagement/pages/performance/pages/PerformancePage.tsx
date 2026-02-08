/**
 * PerformancePage Component
 *
 * Main performance page for tickets management.
 * Displays analytics and monitoring for decision-making.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    PerformanceStatsRow,
    PeriodFilter,
    WeeklyTrendChart,
    ResolutionRateChart,
    AgentPerformanceTable,
    PeriodSummaryCard,
    TopPerformersCard,
} from "../components";
import { usePerformanceData } from "../api";
import type { PeriodFilter as PeriodFilterType } from "../types";
import { PageWrapper } from "@/design-system";

export function PerformancePage() {
    const { t } = useTranslation("ticketsManagement");
    const [period, setPeriod] = useState<PeriodFilterType>("weekly");
    const { data, isLoading } = usePerformanceData(period);

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("performance.pageTitle", "Performance"),
                subtitle: t(
                    "performance.pageSubtitle",
                    "Analytics and monitoring for decision-making"
                ),
                actions: <PeriodFilter value={period} onChange={setPeriod} />,
            }}
        >
            {/* Stats Row */}
            <PerformanceStatsRow
                stats={
                    data?.stats || {
                        avgResponseTime: "0 min",
                        responseTimeTrend: 0,
                        resolutionRate: 0,
                        resolutionRateTrend: 0,
                        topPerformer: "-",
                        topPerformerTrend: 0,
                        needsAttention: 0,
                    }
                }
                isLoading={isLoading}
            />

            {/* Charts Row - Weekly Trend & Resolution Rate */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WeeklyTrendChart
                    data={data?.weeklyTrend || []}
                    isLoading={isLoading}
                />
                <ResolutionRateChart
                    data={data?.resolutionRateByAgent || []}
                    isLoading={isLoading}
                />
            </div>

            {/* Agent Performance Table */}
            <AgentPerformanceTable
                data={data?.agentPerformanceTable || []}
                isLoading={isLoading}
            />

            {/* Bottom Row - Period Summary & Top Performers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PeriodSummaryCard
                    summary={
                        data?.periodSummary || {
                            totalTicketsAssigned: 0,
                            totalTicketsClosed: 0,
                            overallClosureRate: 0,
                        }
                    }
                    isLoading={isLoading}
                />
                <TopPerformersCard
                    performers={data?.topPerformers || []}
                    isLoading={isLoading}
                />
            </div>
        </PageWrapper>
    );
}

export default PerformancePage;
