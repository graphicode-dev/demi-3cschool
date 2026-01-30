/**
 * DistributionMethodCard Component
 *
 * Displays the distribution method configuration with toggle.
 */

import { useTranslation } from "react-i18next";
import type { DistributionMethodConfig } from "../types";

interface DistributionMethodCardProps {
    config: DistributionMethodConfig;
    onToggle: (isActive: boolean) => void;
    isLoading?: boolean;
}

export function DistributionMethodCard({
    config,
    onToggle,
    isLoading,
}: DistributionMethodCardProps) {
    const { t } = useTranslation("ticketsManagement");

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="h-6 w-40 bg-gray-100 dark:bg-gray-700 rounded animate-pulse mb-4" />
                <div className="h-16 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
            </div>
        );
    }

    const methodLabels = {
        load_balance: t("distribution.method.loadBalancing", "Load Balancing"),
        round_robin: t("distribution.method.roundRobin", "Round Robin"),
        manual: t("distribution.method.manual", "Manual"),
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                {t("distribution.method.title", "Distribution Method")}
            </h3>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                                {methodLabels[config.method]}
                            </span>
                            {config.isActive && (
                                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium rounded-full">
                                    {t("distribution.method.active", "Active")}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {config.description}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {t("distribution.method.queued", "Queued")}
                    </span>
                    <button
                        onClick={() => onToggle(!config.isActive)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            config.isActive
                                ? "bg-brand-500"
                                : "bg-gray-300 dark:bg-gray-600"
                        }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                config.isActive
                                    ? "translate-x-6"
                                    : "translate-x-1"
                            }`}
                        />
                    </button>
                    <span className="text-sm text-gray-900 dark:text-white">
                        {t("distribution.method.loadBalance", "Load Balance")}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default DistributionMethodCard;
