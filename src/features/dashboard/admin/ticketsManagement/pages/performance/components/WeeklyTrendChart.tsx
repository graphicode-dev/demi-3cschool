/**
 * WeeklyTrendChart Component
 *
 * Displays a line chart showing weekly ticket trend (opened vs resolved).
 */

import { useTranslation } from "react-i18next";
import type { WeeklyTrendDataPoint } from "../types";
import { useChartAnimation } from "../../../hooks";

interface WeeklyTrendChartProps {
    data: WeeklyTrendDataPoint[];
    isLoading?: boolean;
}

export function WeeklyTrendChart({ data, isLoading }: WeeklyTrendChartProps) {
    const { t } = useTranslation("ticketsManagement");
    const isAnimated = useChartAnimation(isLoading, { dependencies: [data] });

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="h-6 w-40 bg-gray-100 dark:bg-gray-700 rounded animate-pulse mb-4" />
                <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
            </div>
        );
    }

    const maxValue = Math.max(...data.flatMap((d) => [d.opened, d.resolved]));
    const chartHeight = 160;
    const chartWidth = 280;

    const getY = (value: number) =>
        chartHeight - (value / maxValue) * chartHeight;

    const openedPoints = data.map((d, i) => ({
        x: (i / (data.length - 1)) * chartWidth,
        y: getY(d.opened),
    }));

    const resolvedPoints = data.map((d, i) => ({
        x: (i / (data.length - 1)) * chartWidth,
        y: getY(d.resolved),
    }));

    const createPath = (points: { x: number; y: number }[]) => {
        return points
            .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
            .join(" ");
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                {t("performance.charts.weeklyTrend", "Weekly Ticket Trend")}
            </h3>

            <div className="relative">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-40 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 pr-2">
                    <span>18</span>
                    <span>12</span>
                    <span>6</span>
                    <span>0</span>
                </div>

                {/* Chart area */}
                <div className="ml-8">
                    <svg
                        width={chartWidth}
                        height={chartHeight}
                        className="overflow-visible"
                    >
                        {/* Opened line */}
                        <path
                            d={createPath(openedPoints)}
                            fill="none"
                            stroke="#F97316"
                            strokeWidth={2}
                            strokeDasharray="500"
                            strokeDashoffset={isAnimated ? 0 : 500}
                            style={{
                                transition: "stroke-dashoffset 1.2s ease-out",
                            }}
                        />
                        {/* Resolved line */}
                        <path
                            d={createPath(resolvedPoints)}
                            fill="none"
                            stroke="#22C55E"
                            strokeWidth={2}
                            strokeDasharray="500"
                            strokeDashoffset={isAnimated ? 0 : 500}
                            style={{
                                transition:
                                    "stroke-dashoffset 1.2s ease-out 0.2s",
                            }}
                        />
                        {/* Opened dots */}
                        {openedPoints.map((p, i) => (
                            <circle
                                key={`opened-${i}`}
                                cx={p.x}
                                cy={p.y}
                                r={isAnimated ? 4 : 0}
                                fill="#F97316"
                                style={{
                                    transition: "r 0.3s ease-out",
                                    transitionDelay: `${0.8 + i * 0.1}s`,
                                }}
                            />
                        ))}
                        {/* Resolved dots */}
                        {resolvedPoints.map((p, i) => (
                            <circle
                                key={`resolved-${i}`}
                                cx={p.x}
                                cy={p.y}
                                r={isAnimated ? 4 : 0}
                                fill="#22C55E"
                                style={{
                                    transition: "r 0.3s ease-out",
                                    transitionDelay: `${1 + i * 0.1}s`,
                                }}
                            />
                        ))}
                    </svg>

                    {/* X-axis labels */}
                    <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {data.map((d) => (
                            <span key={d.day}>{d.day}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {t("performance.charts.opened", "Opened")}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {t("performance.charts.resolved", "Resolved")}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default WeeklyTrendChart;
