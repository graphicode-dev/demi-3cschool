/**
 * SystemHealthCard Component
 *
 * Displays system health metrics with status indicators.
 * Matches Figma design node 1255:18217
 */

import { useTranslation } from "react-i18next";
import type { SystemHealth } from "../types";

interface SystemHealthCardProps {
    data: SystemHealth;
    isLoading?: boolean;
}

type StatusType = "excellent" | "good" | "warning" | "critical";

const statusStyles: Record<StatusType, { text: string; bg: string }> = {
    excellent: {
        text: "text-[#2BB673]",
        bg: "bg-[rgba(43,182,115,0.1)]",
    },
    good: {
        text: "text-[#2BB673]",
        bg: "bg-[rgba(43,182,115,0.1)]",
    },
    warning: {
        text: "text-[#FFA242]",
        bg: "bg-[rgba(255,162,66,0.1)]",
    },
    critical: {
        text: "text-[#EF4444]",
        bg: "bg-[rgba(239,68,68,0.1)]",
    },
};

export function SystemHealthCard({ data, isLoading }: SystemHealthCardProps) {
    const { t } = useTranslation("adminTicketsManagement");

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)]">
                <div className="h-7 w-32 bg-gray-100 dark:bg-gray-700 rounded animate-pulse mb-8" />
                <div className="flex flex-col gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="h-10 flex justify-between items-center"
                        >
                            <div className="h-4 w-28 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
                            <div className="h-[22px] w-16 bg-gray-100 dark:bg-gray-700 rounded-full animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const metrics = [
        {
            key: "responseTime",
            label: t("overview.systemHealth.responseTime", "Response Time"),
            ...data.responseTime,
        },
        {
            key: "resolutionRate",
            label: t("overview.systemHealth.resolutionRate", "Resolution Rate"),
            ...data.resolutionRate,
        },
        {
            key: "queueLength",
            label: t("overview.systemHealth.queueLength", "Queue Length"),
            ...data.queueLength,
        },
        {
            key: "agentAvailability",
            label: t(
                "overview.systemHealth.agentAvailability",
                "Agent Availability"
            ),
            ...data.agentAvailability,
        },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)] flex flex-col gap-8">
            {/* Title */}
            <div className="h-[29px] flex items-center">
                <h3 className="text-[18px] font-semibold text-gray-900 dark:text-white leading-6">
                    {t("overview.systemHealth.title", "System Health")}
                </h3>
            </div>

            {/* Metrics List */}
            <div className="flex flex-col gap-4">
                {metrics.map((metric) => {
                    const style =
                        statusStyles[metric.status as StatusType] ||
                        statusStyles.good;
                    // Check if value is a percentage or a status key
                    const displayValue = metric.value.includes("%")
                        ? metric.value
                        : t(
                              `overview.systemHealth.statusValues.${metric.value}`,
                              metric.value
                          );
                    return (
                        <div
                            key={metric.key}
                            className="h-10 flex justify-between items-center"
                        >
                            <span className="text-[14px] text-[#666] dark:text-gray-400 capitalize leading-4">
                                {metric.label}
                            </span>
                            <div
                                className={`h-[22px] px-3 flex items-center justify-center rounded-full ${style.bg}`}
                            >
                                <span
                                    className={`text-[11px] font-semibold ${style.text} leading-5`}
                                >
                                    {displayValue}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default SystemHealthCard;
