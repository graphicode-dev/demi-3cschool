/**
 * StatsCard Component
 *
 * Displays a single statistic with icon, value, label, and trend indicator.
 */

import { useTranslation } from "react-i18next";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
    icon: LucideIcon;
    iconBgColor: string;
    iconColor: string;
    value: string | number;
    labelKey: string;
    label: string;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    trendIcon?: LucideIcon;
}

export function StatsCard({
    icon: Icon,
    iconBgColor,
    iconColor,
    value,
    labelKey,
    label,
    trend,
    trendIcon: TrendIcon,
}: StatsCardProps) {
    const { t } = useTranslation();

    return (
        <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800">
            <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBgColor}`}
            >
                <Icon className={`h-6 w-6 ${iconColor}`} />
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {value}
                    </span>
                    {trend && TrendIcon && (
                        <div
                            className={`flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium ${
                                trend.isPositive
                                    ? "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400"
                                    : "bg-error-50 text-error-600 dark:bg-error-500/10 dark:text-error-400"
                            }`}
                        >
                            <TrendIcon className="h-3 w-3" />
                            <span>{trend.value}</span>
                        </div>
                    )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t(labelKey, label)}
                </p>
            </div>
        </div>
    );
}

export default StatsCard;
