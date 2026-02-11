/**
 * TicketsPerAgentChart Component
 *
 * Displays a horizontal bar chart showing tickets per agent.
 */

import { useTranslation } from "react-i18next";
import type { AgentTicketCount } from "../types";
import { useChartAnimation } from "../../../hooks";

interface TicketsPerAgentChartProps {
    data: AgentTicketCount[];
    isLoading?: boolean;
}

export function TicketsPerAgentChart({
    data,
    isLoading,
}: TicketsPerAgentChartProps) {
    const { t } = useTranslation("adminTicketsManagement");
    const isAnimated = useChartAnimation(isLoading, { dependencies: [data] });

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="h-6 w-36 bg-gray-100 dark:bg-gray-700 rounded animate-pulse mb-4" />
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="h-6 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    const maxValue = Math.max(...data.map((item) => item.ticketCount));

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                {t("distribution.charts.ticketsPerAgent", "Tickets per Agent")}
            </h3>

            <div className="space-y-3">
                {data.map((item, index) => {
                    const percentage = (item.ticketCount / maxValue) * 100;
                    return (
                        <div key={item.id} className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 dark:text-gray-400 w-16">
                                {item.name}
                            </span>
                            <div className="flex-1 h-5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full"
                                    style={{
                                        width: isAnimated
                                            ? `${percentage}%`
                                            : "0%",
                                        backgroundColor: item.color,
                                        transition: "width 0.8s ease-out",
                                        transitionDelay: `${index * 0.1}s`,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between mt-4 ml-[76px] text-xs text-gray-500 dark:text-gray-400">
                <span>0</span>
                <span>4</span>
                <span>8</span>
                <span>12</span>
                <span>16</span>
                <span>20</span>
            </div>
        </div>
    );
}

export default TicketsPerAgentChart;
