/**
 * BlockWorkloadOverviewSection Component
 *
 * Displays the block workload overview section with multiple cards.
 * Matches Figma design node 1264:14954
 */

import { useTranslation } from "react-i18next";
import type { BlockWorkloadOverview } from "../types";
import { BlockWorkloadOverviewCard } from "./BlockWorkloadOverviewCard";

interface BlockWorkloadOverviewSectionProps {
    blocks: BlockWorkloadOverview[];
    isLoading?: boolean;
}

export function BlockWorkloadOverviewSection({
    blocks,
    isLoading,
}: BlockWorkloadOverviewSectionProps) {
    const { t } = useTranslation("adminTicketsManagement");

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)]">
                <div className="h-7 w-48 bg-gray-100 dark:bg-gray-700 rounded animate-pulse mb-4" />
                <div className="flex flex-wrap gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            className="h-[123px] w-[310px] bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-6 shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)]">
            {/* Title */}
            <div className="h-[29px] flex items-center mb-4">
                <h3 className="text-[18px] font-semibold text-gray-900 dark:text-white leading-6">
                    {t(
                        "distribution.blockOverview.title",
                        "Block Workload Overview"
                    )}
                </h3>
            </div>

            {/* Cards grid - wrapping flex layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {blocks.map((block) => (
                    <div key={block.id} className="w-full ">
                        <BlockWorkloadOverviewCard block={block} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BlockWorkloadOverviewSection;
