/**
 * PeriodSummaryCard Component
 *
 * Displays the period summary statistics.
 */

import { useTranslation } from "react-i18next";
import type { PeriodSummary } from "../types";

interface PeriodSummaryCardProps {
    summary: PeriodSummary;
    isLoading?: boolean;
}

export function PeriodSummaryCard({
    summary,
    isLoading,
}: PeriodSummaryCardProps) {
    const { t } = useTranslation("ticketsManagement");

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="h-6 w-36 bg-gray-100 dark:bg-gray-700 rounded animate-pulse mb-4" />
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-8 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                {t("performance.summary.title", "Period Summary")}
            </h3>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {t(
                            "performance.summary.totalAssigned",
                            "Total Tickets Assigned"
                        )}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {summary.totalTicketsAssigned}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {t(
                            "performance.summary.totalClosed",
                            "Total Tickets Closed"
                        )}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {summary.totalTicketsClosed}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {t(
                            "performance.summary.closureRate",
                            "Overall Closure Rate"
                        )}
                    </span>
                    <span className="text-sm font-semibold text-green-500">
                        {summary.overallClosureRate}%
                    </span>
                </div>
            </div>
        </div>
    );
}

export default PeriodSummaryCard;
