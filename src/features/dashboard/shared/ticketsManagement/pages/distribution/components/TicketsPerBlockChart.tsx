/**
 * TicketsPerBlockChart Component
 *
 * Displays a vertical bar chart showing tickets per block.
 */

import { useTranslation } from "react-i18next";
import type { BlockTicketCount } from "../types";
import { useChartAnimation } from "../../../hooks";

interface TicketsPerBlockChartProps {
    data: BlockTicketCount[];
    isLoading?: boolean;
}

export function TicketsPerBlockChart({
    data,
    isLoading,
}: TicketsPerBlockChartProps) {
    const { t } = useTranslation("ticketsManagement");
    const isAnimated = useChartAnimation(isLoading, { dependencies: [data] });

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="h-6 w-36 bg-gray-100 dark:bg-gray-700 rounded animate-pulse mb-4" />
                <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
            </div>
        );
    }

    const maxValue = Math.max(...data.map((item) => item.ticketCount));
    const chartHeight = 160;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                {t("distribution.charts.ticketsPerBlock", "Tickets per Block")}
            </h3>

            <div className="relative">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 pr-2">
                    <span>21</span>
                    <span>14</span>
                    <span>7</span>
                    <span>0</span>
                </div>

                {/* Chart area */}
                <div className="ml-8">
                    <div
                        className="flex items-end justify-around gap-4"
                        style={{ height: chartHeight }}
                    >
                        {data.map((item, index) => {
                            const barHeight =
                                (item.ticketCount / maxValue) * chartHeight;
                            return (
                                <div
                                    key={item.id}
                                    className="flex flex-col items-center gap-2"
                                >
                                    <div
                                        className="w-12 rounded-t"
                                        style={{
                                            height: isAnimated ? barHeight : 0,
                                            backgroundColor: item.color,
                                            transition: "height 0.8s ease-out",
                                            transitionDelay: `${index * 0.1}s`,
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* X-axis labels */}
                    <div className="flex justify-around mt-2">
                        {data.map((item) => (
                            <span
                                key={item.id}
                                className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-landing-section-x truncate"
                            >
                                {item.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TicketsPerBlockChart;
