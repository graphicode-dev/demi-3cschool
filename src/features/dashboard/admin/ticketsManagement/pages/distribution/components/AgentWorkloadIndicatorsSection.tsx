/**
 * AgentWorkloadIndicatorsSection Component
 *
 * Displays the agent workload indicators section with legend.
 * Matches Figma design node 1264:15443
 */

import { useTranslation } from "react-i18next";
import type { AgentWorkloadIndicator } from "../types";
import { AgentWorkloadIndicatorCard } from "./AgentWorkloadIndicatorCard";

interface AgentWorkloadIndicatorsSectionProps {
    agents: AgentWorkloadIndicator[];
    isLoading?: boolean;
}

export function AgentWorkloadIndicatorsSection({
    agents,
    isLoading,
}: AgentWorkloadIndicatorsSectionProps) {
    const { t } = useTranslation("adminTicketsManagement");

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="h-7 w-48 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="flex gap-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-4 w-16 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"
                            />
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                        <div
                            key={i}
                            className="h-[80px] bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-6 shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)]">
            {/* Header with title and legend */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[18px] font-semibold text-gray-900 dark:text-white leading-6">
                    {t(
                        "distribution.agentIndicators.title",
                        "Agent Workload Indicators"
                    )}
                </h3>
                {/* Legend */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#2BB673]" />
                        <span className="text-[12px] text-gray-500 dark:text-gray-400">
                            {t("distribution.agentIndicators.low", "Low")}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#FFA242]" />
                        <span className="text-[12px] text-gray-500 dark:text-gray-400">
                            {t("distribution.agentIndicators.medium", "Medium")}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#EF4444]" />
                        <span className="text-[12px] text-gray-500 dark:text-gray-400">
                            {t("distribution.agentIndicators.high", "High")}
                        </span>
                    </div>
                </div>
            </div>

            {/* Agent cards grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {agents.map((agent) => (
                    <AgentWorkloadIndicatorCard key={agent.id} agent={agent} />
                ))}
            </div>
        </div>
    );
}

export default AgentWorkloadIndicatorsSection;
