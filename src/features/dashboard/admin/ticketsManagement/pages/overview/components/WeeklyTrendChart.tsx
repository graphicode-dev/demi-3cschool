/**
 * WeeklyTrendChart Component
 *
 * Displays a bar chart showing weekly ticket trends (open vs resolved).
 * Matches Figma design node 1256:18298
 */

import { useTranslation } from "react-i18next";
import type { WeeklyTrendItem } from "../types";
import { useChartAnimation } from "../../../hooks";

interface WeeklyTrendChartProps {
    data: WeeklyTrendItem[];
    isLoading?: boolean;
}

export function WeeklyTrendChart({ data, isLoading }: WeeklyTrendChartProps) {
    const { t } = useTranslation("ticketsManagement");
    const isAnimated = useChartAnimation(isLoading, { dependencies: [data] });

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)]">
                <div className="h-7 w-44 bg-gray-100 dark:bg-gray-700 rounded animate-pulse mb-4" />
                <div className="h-[180px] bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
            </div>
        );
    }

    // Fixed max value for consistent Y-axis (36 as shown in Figma)
    const maxValue = 36;
    const chartHeight = 156;
    const yAxisLabels = [36, 18, 9, 0];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)] flex flex-col gap-4">
            {/* Title */}
            <div className="h-[29px] flex items-center">
                <h3 className="text-[18px] font-semibold text-gray-900 dark:text-white leading-6">
                    {t(
                        "overview.charts.weeklyTicketTrend",
                        "Weekly Ticket Trend"
                    )}
                </h3>
            </div>

            {/* Chart Container */}
            <div className="flex gap-4 py-4">
                {/* Y-axis labels */}
                <div className="flex flex-col justify-between h-[156px] text-[12px] text-gray-400 dark:text-gray-500 text-right">
                    {yAxisLabels.map((label) => (
                        <span key={label} className="leading-4">
                            {label}
                        </span>
                    ))}
                </div>

                {/* Chart area */}
                <div className="flex-1">
                    <div
                        className="flex items-end justify-between"
                        style={{ height: chartHeight }}
                    >
                        {data.map((item, index) => {
                            const openHeight =
                                (item.open / maxValue) * chartHeight;
                            const resolvedHeight =
                                (item.resolved / maxValue) * chartHeight;

                            return (
                                <div
                                    key={item.day}
                                    className="flex items-end justify-center gap-[6px]"
                                >
                                    <div
                                        className="w-[12px] bg-[#F97316] rounded-t-sm"
                                        style={{
                                            height: isAnimated ? openHeight : 0,
                                            transition: "height 0.8s ease-out",
                                            transitionDelay: `${index * 0.1}s`,
                                        }}
                                        title={`${t("overview.status.open", "Open")}: ${item.open}`}
                                    />
                                    <div
                                        className="w-[12px] bg-[#22C55E] rounded-t-sm"
                                        style={{
                                            height: isAnimated
                                                ? resolvedHeight
                                                : 0,
                                            transition: "height 0.8s ease-out",
                                            transitionDelay: `${index * 0.1 + 0.05}s`,
                                        }}
                                        title={`${t("overview.status.resolved", "Resolved")}: ${item.resolved}`}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* X-axis labels */}
                    <div className="flex justify-between mt-3">
                        {data.map((item) => (
                            <span
                                key={item.day}
                                className="text-[12px] text-gray-400 dark:text-gray-500 text-center opacity-50"
                            >
                                {t(`overview.days.${item.day}`, item.day)}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#F97316]" />
                    <span className="text-xs text-gray-900 dark:text-gray-400">
                        {t("overview.status.open", "Open")}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
                    <span className="text-xs text-gray-900 dark:text-gray-400">
                        {t("overview.status.resolved", "Resolved")}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default WeeklyTrendChart;
