/**
 * BlockWorkloadOverviewCard Component
 *
 * Displays a single block workload overview card.
 * Matches Figma design node 1264:14954
 */

import { useTranslation } from "react-i18next";
import type { BlockWorkloadOverview, WorkloadLevel } from "../types";

interface BlockWorkloadOverviewCardProps {
    block: BlockWorkloadOverview;
}

const statusStyles: Record<
    WorkloadLevel,
    { bg: string; text: string; bar: string; label: string }
> = {
    low: {
        bg: "bg-[rgba(43,182,115,0.1)]",
        text: "text-[#2BB673]",
        bar: "bg-[#00AEED]",
        label: "Low",
    },
    medium: {
        bg: "bg-[rgba(255,162,66,0.1)]",
        text: "text-[#FFA242]",
        bar: "bg-[#FFA242]",
        label: "Medium",
    },
    high: {
        bg: "bg-[rgba(239,68,68,0.1)]",
        text: "text-[#EF4444]",
        bar: "bg-[#EF4444]",
        label: "High",
    },
};

export function BlockWorkloadOverviewCard({
    block,
}: BlockWorkloadOverviewCardProps) {
    const { t } = useTranslation("ticketsManagement");
    const style = statusStyles[block.status];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
            {/* Header with name and status badge */}
            <div className="flex items-start justify-between mb-2.5">
                <h4 className="font-semibold text-gray-900 dark:text-white text-[10px] leading-4">
                    {block.name}
                </h4>
                <span
                    className={`px-2 py-0.5 rounded-full text-[6px] ${style.bg} ${style.text}`}
                >
                    {t(
                        `distribution.blockOverview.status.${block.status}`,
                        style.label
                    )}
                </span>
            </div>

            {/* Stats rows */}
            <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                    <span className="text-[10px] text-[#666] dark:text-gray-400">
                        {t("distribution.blockOverview.tickets", "Tickets")}
                    </span>
                    <span className="text-[10px] font-semibold text-gray-900 dark:text-white">
                        {block.tickets}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[10px] text-[#666] dark:text-gray-400">
                        {t("distribution.blockOverview.agents", "Agents")}
                    </span>
                    <span className="text-[10px] font-semibold text-gray-900 dark:text-white">
                        {block.agents}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[10px] text-[#666] dark:text-gray-400">
                        {t(
                            "distribution.blockOverview.utilization",
                            "Utilization"
                        )}
                    </span>
                    <span className="text-[10px] font-semibold text-gray-900 dark:text-white">
                        {block.utilization}%
                    </span>
                </div>
            </div>

            {/* Progress bar */}
            <div className="mt-2.5 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full ${style.bar}`}
                    style={{ width: `${block.utilization}%` }}
                />
            </div>
        </div>
    );
}

export default BlockWorkloadOverviewCard;
