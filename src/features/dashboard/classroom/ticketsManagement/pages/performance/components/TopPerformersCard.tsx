/**
 * TopPerformersCard Component
 *
 * Displays the top performers list with rankings.
 * Matches Figma design node 1268:17526
 */

import { useTranslation } from "react-i18next";
import { Trophy } from "lucide-react";
import type { TopPerformer } from "../types";

interface TopPerformersCardProps {
    performers: TopPerformer[];
    isLoading?: boolean;
}

export function TopPerformersCard({
    performers,
    isLoading,
}: TopPerformersCardProps) {
    const { t } = useTranslation("ticketsManagement");

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)]">
                <div className="h-6 w-36 bg-gray-100 dark:bg-gray-700 rounded animate-pulse mb-4" />
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            className="h-12 bg-gray-100 dark:bg-gray-700 rounded animate-pulse my-2"
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)]">
            <h3 className="text-[16px] font-semibold text-gray-900 dark:text-white mb-4">
                {t("performance.topPerformers.title", "Top Performers")}
            </h3>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {performers.map((performer) => {
                    const isFirst = performer.rank === 1;
                    return (
                        <div
                            key={performer.id}
                            className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                        >
                            <div className="flex items-center gap-3">
                                {/* Rank badge */}
                                <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold ${
                                        isFirst
                                            ? "bg-brand-500 text-white"
                                            : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                                    }`}
                                >
                                    {performer.rank}
                                </div>
                                {/* Name */}
                                <span className="text-[14px] text-gray-900 dark:text-white">
                                    {performer.name}
                                </span>
                            </div>
                            {/* Score and trophy */}
                            <div className="flex items-center gap-2">
                                <span className="text-[14px] font-medium text-brand-500">
                                    {performer.score}%
                                </span>
                                {isFirst && (
                                    <Trophy className="w-4 h-4 text-brand-500" />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default TopPerformersCard;
