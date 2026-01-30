/**
 * OverviewPage Component
 *
 * Main overview page for tickets management.
 * Displays stats, charts, system health, and quick navigation.
 */

import { useTranslation } from "react-i18next";
import {
    OverviewStatsRow,
    TicketStatusChart,
    WorkloadByBlockChart,
    SystemHealthCard,
    WeeklyTrendChart,
    QuickNavigation,
} from "../components";
import { useOverviewData } from "../api";
import PageWrapper from "@/design-system/components/PageWrapper";

export function OverviewPage() {
    const { t } = useTranslation("ticketsManagement");
    const { data, isLoading } = useOverviewData();

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("overview.pageTitle", "Overview"),
                subtitle: t(
                    "overview.pageSubtitle",
                    "Quick system monitoring at a glance"
                ),
            }}
        >
            {/* Stats Row */}
            <OverviewStatsRow
                stats={
                    data?.stats || {
                        newTicketsToday: 0,
                        openTickets: 0,
                        resolvedTickets: 0,
                        activeAgents: 0,
                    }
                }
                isLoading={isLoading}
            />

            {/* Charts Row - Status Distribution & Workload */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TicketStatusChart
                    data={
                        data?.statusDistribution || {
                            open: 0,
                            inProgress: 0,
                            resolved: 0,
                            closed: 0,
                        }
                    }
                    isLoading={isLoading}
                />
                <WorkloadByBlockChart
                    data={data?.workloadByBlock || []}
                    isLoading={isLoading}
                />
            </div>

            {/* System Health & Weekly Trend Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SystemHealthCard
                    data={
                        data?.systemHealth || {
                            responseTime: { value: "-", status: "good" },
                            resolutionRate: { value: "-", status: "good" },
                            queueLength: { value: "-", status: "good" },
                            agentAvailability: {
                                value: "-",
                                status: "good",
                            },
                        }
                    }
                    isLoading={isLoading}
                />
                <WeeklyTrendChart
                    data={data?.weeklyTrend || []}
                    isLoading={isLoading}
                />
            </div>

            {/* Quick Navigation */}
            <QuickNavigation isLoading={isLoading} />
        </PageWrapper>
    );
}

export default OverviewPage;
