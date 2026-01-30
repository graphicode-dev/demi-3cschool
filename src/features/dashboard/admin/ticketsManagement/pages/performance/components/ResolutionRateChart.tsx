/**
 * ResolutionRateChart Component
 *
 * Displays a horizontal bar chart showing resolution rate by agent.
 */

import { useTranslation } from "react-i18next";
import type { AgentResolutionRate } from "../types";
import { useChartAnimation } from "../../../hooks";

interface ResolutionRateChartProps {
    data: AgentResolutionRate[];
    isLoading?: boolean;
}

export function ResolutionRateChart({
    data,
    isLoading,
}: ResolutionRateChartProps) {
    const { t } = useTranslation("ticketsManagement");
    const isAnimated = useChartAnimation(isLoading, { dependencies: [data] });

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="h-6 w-44 bg-gray-100 dark:bg-gray-700 rounded animate-pulse mb-4" />
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

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                {t(
                    "performance.charts.resolutionRateByAgent",
                    "Resolution Rate by Agent"
                )}
            </h3>

            <div className="space-y-3">
                {data.map((agent, index) => (
                    <div key={agent.id} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 dark:text-gray-400 w-16">
                            {agent.name}
                        </span>
                        <div className="flex-1 h-5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full"
                                style={{
                                    width: isAnimated ? `${agent.rate}%` : "0%",
                                    backgroundColor: agent.color,
                                    transition: "width 0.8s ease-out",
                                    transitionDelay: `${index * 0.1}s`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between mt-4 ml-[76px] text-xs text-gray-500 dark:text-gray-400">
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
                <span>30</span>
            </div>
        </div>
    );
}

export default ResolutionRateChart;
