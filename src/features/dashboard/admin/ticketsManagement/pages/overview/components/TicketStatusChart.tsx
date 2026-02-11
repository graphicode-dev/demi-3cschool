/**
 * TicketStatusChart Component
 *
 * Displays a donut/pie chart showing ticket status distribution.
 * Matches Figma design node 1252:14868
 */

import { useTranslation } from "react-i18next";
import type { TicketStatusDistribution } from "../types";
import { useChartAnimation } from "../../../hooks";

interface TicketStatusChartProps {
    data: TicketStatusDistribution;
    isLoading?: boolean;
}

export function TicketStatusChart({ data, isLoading }: TicketStatusChartProps) {
    const { t } = useTranslation("adminTicketsManagement");
    const isAnimated = useChartAnimation(isLoading, { dependencies: [data] });

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)]">
                <div className="h-7 w-48 bg-gray-100 dark:bg-gray-700 rounded animate-pulse mb-4" />
                <div className="flex flex-col items-center justify-center gap-10 px-5">
                    <div className="w-[120px] h-[120px] bg-gray-100 dark:bg-gray-700 rounded-full animate-pulse" />
                    <div className="flex gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full" />
                                <div className="w-12 h-3 bg-gray-100 dark:bg-gray-700 rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const total = data.open + data.inProgress + data.resolved + data.closed;

    // Order segments by size (largest first) to match Figma visual
    // Colors from Figma: Orange (open/largest), Blue (in progress), Green (resolved), Gray (closed)
    const segments = [
        {
            key: "open",
            value: data.open,
            color: "#F97316", // Orange - largest segment
            label: t("overview.status.open", "Open"),
        },
        {
            key: "inProgress",
            value: data.inProgress,
            color: "#00AEED", // Blue
            label: t("overview.status.inProgress", "In Progress"),
        },
        {
            key: "resolved",
            value: data.resolved,
            color: "#22C55E", // Green
            label: t("overview.status.resolved", "Resolved"),
        },
        {
            key: "closed",
            value: data.closed,
            color: "#6B7280", // Gray
            label: t("overview.status.closed", "Closed"),
        },
    ];

    // Calculate stroke-dasharray and stroke-dashoffset for each segment
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    let cumulativeOffset = 0;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)] flex flex-col gap-4">
            {/* Title */}
            <div className="h-[29px] flex items-center">
                <h3 className="text-[18px] font-semibold text-gray-900 dark:text-white leading-6">
                    {t(
                        "overview.charts.ticketStatusDistribution",
                        "Ticket Status Distribution"
                    )}
                </h3>
            </div>

            {/* Chart and Legend Container */}
            <div className="flex flex-col items-center justify-center gap-10 px-5">
                {/* Donut Chart */}
                <div className="flex items-center justify-center w-[120px] h-[120px]">
                    <svg width="120" height="120" viewBox="0 0 120 120">
                        {segments.map((segment) => {
                            const percentage = (segment.value / total) * 100;
                            const dashArray =
                                (percentage / 100) * circumference;
                            const dashOffset = -cumulativeOffset;
                            cumulativeOffset += dashArray;

                            return (
                                <circle
                                    key={segment.key}
                                    cx="60"
                                    cy="60"
                                    r={radius}
                                    fill="none"
                                    stroke={segment.color}
                                    strokeWidth="15"
                                    strokeDasharray={
                                        isAnimated
                                            ? `${dashArray} ${circumference - dashArray}`
                                            : `0 ${circumference}`
                                    }
                                    strokeDashoffset={dashOffset}
                                    transform="rotate(-90 60 60)"
                                    style={{
                                        transition:
                                            "stroke-dasharray 1s ease-out",
                                        transitionDelay: `${0.1 * segments.indexOf(segment)}s`,
                                    }}
                                />
                            );
                        })}
                        {/* Inner white circle for donut hole */}
                        <circle
                            cx="60"
                            cy="60"
                            r="30"
                            fill="white"
                            className="dark:fill-gray-800"
                        />
                    </svg>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-4 w-full">
                    {segments.map((segment) => (
                        <div
                            key={segment.key}
                            className="flex items-center gap-2"
                        >
                            <div
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: segment.color }}
                            />
                            <span className="text-xs text-gray-900 dark:text-gray-400">
                                {segment.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TicketStatusChart;
