/**
 * PerformanceStatsRow Component
 *
 * Displays a row of stat cards for the performance page.
 * Matches Figma design node 1268:16916
 */

import { useTranslation } from "react-i18next";
import type { PerformanceStats } from "../types";
import {
    Clock,
    CheckSquare,
    User,
    AlertCircle,
    ArrowUp,
    ArrowDown,
} from "lucide-react";
import type { ReactNode } from "react";

interface PerformanceStatsRowProps {
    stats: PerformanceStats;
    isLoading?: boolean;
}

interface PerformanceStatCardProps {
    icon: ReactNode;
    value: string | number;
    label: string;
    trend?: number;
    trendLabel?: string;
}

function PerformanceStatCard({
    icon,
    value,
    label,
    trend,
    trendLabel,
}: PerformanceStatCardProps) {
    const isPositive = trend !== undefined && trend >= 0;
    const hasTrend = trend !== undefined;

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]">
            {/* Header with icon and trend */}
            <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-md bg-[rgba(0,174,237,0.1)] flex items-center justify-center">
                    <div className="text-brand-500">{icon}</div>
                </div>
                {hasTrend && (
                    <div
                        className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] ${
                            isPositive
                                ? "bg-[rgba(43,182,115,0.1)] text-[#2BB673]"
                                : "bg-[rgba(239,68,68,0.1)] text-[#EF4444]"
                        }`}
                    >
                        {isPositive ? (
                            <ArrowUp className="w-3 h-3" />
                        ) : (
                            <ArrowDown className="w-3 h-3" />
                        )}
                        <span>{Math.abs(trend)}%</span>
                    </div>
                )}
                {trendLabel && !hasTrend && (
                    <span className="text-[10px] text-[#EF4444]">
                        {trendLabel}
                    </span>
                )}
            </div>

            {/* Value and label */}
            <div className="flex flex-col gap-0.5">
                <span className="text-[22px] font-bold text-gray-900 dark:text-white leading-7">
                    {value}
                </span>
                <span className="text-[12px] text-gray-900/80 dark:text-gray-300">
                    {label}
                </span>
            </div>
        </div>
    );
}

export function PerformanceStatsRow({
    stats,
    isLoading,
}: PerformanceStatsRowProps) {
    const { t } = useTranslation("ticketsManagement");

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="h-[100px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg animate-pulse"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <PerformanceStatCard
                icon={<Clock className="w-[18px] h-[18px]" />}
                value={stats.avgResponseTime}
                label={t(
                    "performance.stats.avgResponseTime",
                    "Avg Response Time"
                )}
                trend={stats.responseTimeTrend}
            />
            <PerformanceStatCard
                icon={<CheckSquare className="w-[18px] h-[18px]" />}
                value={`${stats.resolutionRate}%`}
                label={t("performance.stats.resolutionRate", "Resolution Rate")}
                trend={stats.resolutionRateTrend}
            />
            <PerformanceStatCard
                icon={<User className="w-[18px] h-[18px]" />}
                value={stats.topPerformer}
                label={t("performance.stats.topPerformer", "Top Performer")}
                trend={stats.topPerformerTrend}
            />
            <PerformanceStatCard
                icon={<AlertCircle className="w-[18px] h-[18px]" />}
                value={stats.needsAttention}
                label={t("performance.stats.needsAttention", "Needs Attention")}
                trendLabel={t("performance.stats.review", "Review")}
            />
        </div>
    );
}

export default PerformanceStatsRow;
