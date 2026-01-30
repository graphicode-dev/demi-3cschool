/**
 * BlocksList Component
 *
 * Displays a list of block cards.
 */

import { useTranslation } from "react-i18next";
import type { Block } from "../types";
import { BlockCard } from "./BlockCard";

interface BlocksListProps {
    blocks: Block[];
    isLoading?: boolean;
}

export function BlocksList({ blocks, isLoading }: BlocksListProps) {
    const { t } = useTranslation("ticketsManagement");

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"
                    />
                ))}
            </div>
        );
    }

    if (blocks.length === 0) {
        return (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">
                    {t("teamStructure.noBlocks", "No blocks found")}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {blocks.map((block, index) => (
                <BlockCard
                    key={block.id}
                    block={block}
                    defaultExpanded={index < 2}
                />
            ))}
        </div>
    );
}

export default BlocksList;
