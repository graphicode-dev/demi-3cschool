/**
 * WorkloadByBlockChart Component
 *
 * Displays horizontal bar chart showing workload by block/department.
 * Matches Figma design node 1254:16371
 */

import { useTranslation } from "react-i18next";
import type { WorkloadByBlock } from "../types";
import { useChartAnimation } from "../../../hooks";

interface WorkloadByBlockChartProps {
    data: WorkloadByBlock[];
    isLoading?: boolean;
}

export function WorkloadByBlockChart({
    data,
    isLoading,
}: WorkloadByBlockChartProps) {
    const { t } = useTranslation("ticketsManagement");
    const isAnimated = useChartAnimation(isLoading, { dependencies: [data] });

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)]">
                <div className="h-7 w-40 bg-gray-100 dark:bg-gray-700 rounded animate-pulse mb-4" />
                <div className="flex gap-3">
                    <div className="flex flex-col gap-6 w-[100px]">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-4 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"
                            />
                        ))}
                    </div>
                    <div className="flex-1 flex flex-col gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full animate-pulse"
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Max value for scaling (use 28 as shown in Figma)
    const maxValue = 28;
    const xAxisLabels = [0, 4, 7, 14, 21, 28];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-[0px_4px_8px_0px_rgba(0,0,0,0.1)] flex flex-col gap-4">
            {/* Title */}
            <div className="h-[29px] flex items-center">
                <h3 className="text-[18px] font-semibold text-gray-900 dark:text-white leading-6">
                    {t("overview.charts.workloadByBlock", "Workload by Block")}
                </h3>
            </div>

            {/* Chart Container */}
            <div className="flex gap-3">
                {/* Left Labels */}
                <div className="flex flex-col justify-between py-1">
                    {data.map((item) => (
                        <div
                            key={item.name}
                            className="h-[15px] flex items-center justify-end"
                        >
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 text-right whitespace-nowrap">
                                {t(`overview.blocks.${item.name}`, item.name)}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Bars Container */}
                <div className="flex-1 flex flex-col justify-between py-1 space-y-10">
                    {data.map((item, index) => {
                        const percentage = (item.value / maxValue) * 100;
                        return (
                            <div
                                key={item.name}
                                className="h-[15px] flex items-center"
                            >
                                <div
                                    className="h-[15px] rounded-full"
                                    style={{
                                        width: isAnimated
                                            ? `${percentage}%`
                                            : "0%",
                                        backgroundColor: item.color,
                                        transition: "width 0.8s ease-out",
                                        transitionDelay: `${index * 0.15}s`,
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between pl-[110px] text-[10px] text-gray-400 dark:text-gray-500">
                {xAxisLabels.map((label) => (
                    <span key={label}>{label}</span>
                ))}
            </div>
        </div>
    );
}

export default WorkloadByBlockChart;
