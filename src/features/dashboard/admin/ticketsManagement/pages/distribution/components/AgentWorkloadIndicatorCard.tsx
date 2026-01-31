/**
 * AgentWorkloadIndicatorCard Component
 *
 * Displays a single agent workload indicator.
 * Matches Figma design node 1264:15443
 */

import type { AgentWorkloadIndicator, WorkloadLevel } from "../types";

interface AgentWorkloadIndicatorCardProps {
    agent: AgentWorkloadIndicator;
}

const levelColors: Record<WorkloadLevel, { dot: string; bar: string }> = {
    low: { dot: "bg-[#2BB673]", bar: "bg-[#00AEED]" },
    medium: { dot: "bg-[#FFA242]", bar: "bg-[#FFA242]" },
    high: { dot: "bg-[#EF4444]", bar: "bg-[#EF4444]" },
};

export function AgentWorkloadIndicatorCard({
    agent,
}: AgentWorkloadIndicatorCardProps) {
    const colors = levelColors[agent.level];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 flex flex-col gap-2">
            {/* Header - Name with status dot */}
            <div className="flex items-center gap-2">
                <div
                    className={`w-2 h-2 rounded-full shrink-0 ${colors.dot}`}
                />
                <span className="text-[12px] font-medium text-gray-900 dark:text-white truncate">
                    {agent.name}
                </span>
            </div>

            {/* Ticket info and percentage */}
            <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#666] dark:text-gray-400">
                    {agent.ticketInfo}
                </span>
                <span className="text-[10px] text-gray-900 dark:text-white">
                    {agent.percentage}%
                </span>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full ${colors.bar}`}
                    style={{ width: `${agent.percentage}%` }}
                />
            </div>
        </div>
    );
}

export default AgentWorkloadIndicatorCard;
