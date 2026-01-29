/**
 * OverviewStatsRow Component
 *
 * Displays a row of stat cards for the overview page.
 * Shows: Total Tickets Today, Open Tickets, Resolved Tickets, Active Agents
 * Matches Figma design node 1252:14155
 */

import { useTranslation } from "react-i18next";
import type { OverviewStats } from "../types";
import { Ticket, Info, CheckSquare, Users } from "lucide-react";
import { StatCard } from "../../../components";

interface OverviewStatsRowProps {
    stats: OverviewStats;
    isLoading?: boolean;
}

export function OverviewStatsRow({ stats, isLoading }: OverviewStatsRowProps) {
    const { t } = useTranslation("ticketsManagement");

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="h-[110px] bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
                title={t(
                    "overview.stats.totalTicketsToday",
                    "Total Tickets Today"
                )}
                value={stats.newTicketsToday}
                icon={<Ticket className="w-[15px] h-[15px]" />}
                trend={{
                    value: stats.newTicketsTodayTrend || 0,
                }}
                variant="blue"
            />
            <StatCard
                title={t("overview.stats.openTickets", "Open Tickets")}
                value={stats.openTickets}
                icon={<Info className="w-[15px] h-[15px]" />}
                trend={{
                    value: stats.openTicketsTrend || 0,
                }}
                variant="orange"
            />
            <StatCard
                title={t("overview.stats.resolvedTickets", "Resolved Tickets")}
                value={stats.resolvedTickets}
                icon={<CheckSquare className="w-[15px] h-[15px]" />}
                trend={{
                    value: stats.resolvedTicketsTrend || 0,
                }}
                variant="green"
            />
            <StatCard
                title={t("overview.stats.activeAgents", "Active Agents")}
                value={stats.activeAgents}
                icon={<Users className="w-[15px] h-[15px]" />}
                trend={{
                    value: stats.activeAgentsTrend || 0,
                }}
                variant="purple"
            />
        </div>
    );
}

export default OverviewStatsRow;
