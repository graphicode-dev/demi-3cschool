/**
 * AgentPerformanceTable Component
 *
 * Displays a table of agent performance metrics using the design-system DynamicTable.
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DynamicTable } from "@/design-system";
import type { TableData, TableColumn } from "@/shared/types";
import type { AgentPerformanceRow, RatingLevel } from "../types";

interface AgentPerformanceTableProps {
    data: AgentPerformanceRow[];
    isLoading?: boolean;
}

const ratingStyles: Record<RatingLevel, { bg: string; text: string }> = {
    good: {
        bg: "bg-[rgba(43,182,115,0.1)]",
        text: "text-[#2BB673]",
    },
    average: {
        bg: "bg-[rgba(255,162,66,0.1)]",
        text: "text-[#FFA242]",
    },
    excellent: {
        bg: "bg-[rgba(0,174,237,0.1)]",
        text: "text-brand-500",
    },
};

export function AgentPerformanceTable({
    data,
    isLoading,
}: AgentPerformanceTableProps) {
    const { t } = useTranslation("adminTicketsManagement");

    const ratingLabels: Record<RatingLevel, string> = useMemo(
        () => ({
            good: t("performance.table.rating.good", "Good"),
            average: t("performance.table.rating.average", "Average"),
            excellent: t("performance.table.rating.excellent", "Excellent"),
        }),
        [t]
    );

    const columns: TableColumn[] = useMemo(
        () => [
            {
                id: "name",
                header: t("performance.table.agent", "Agent"),
                accessorKey: "name",
                sortable: true,
            },
            {
                id: "assigned",
                header: t("performance.table.assigned", "Assigned"),
                accessorKey: "assigned",
                sortable: true,
            },
            {
                id: "closed",
                header: t("performance.table.closed", "Closed"),
                accessorKey: "closed",
                sortable: true,
            },
            {
                id: "avgResponse",
                header: t("performance.table.avgResponse", "Avg Response"),
                accessorKey: "avgResponse",
                sortable: true,
            },
            {
                id: "resolutionRate",
                header: t(
                    "performance.table.resolutionRate",
                    "Resolution Rate"
                ),
                accessorKey: "resolutionRate",
                sortable: true,
                cell: ({ row }) => <span>{row.columns.resolutionRate}%</span>,
            },
            {
                id: "rating",
                header: t("performance.table.rating", "Rating"),
                accessorKey: "rating",
                sortable: false,
                cell: ({ row }) => {
                    const rating = row.columns.rating as RatingLevel;
                    const style = ratingStyles[rating];
                    return (
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
                        >
                            {ratingLabels[rating]}
                        </span>
                    );
                },
            },
        ],
        [t, ratingLabels]
    );

    const tableData: TableData[] = useMemo(
        () =>
            data.map((row) => ({
                id: row.id,
                columns: {
                    name: row.name,
                    assigned: row.assigned,
                    closed: row.closed,
                    avgResponse: row.avgResponse,
                    resolutionRate: row.resolutionRate,
                    rating: row.rating,
                },
            })),
        [data]
    );

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="h-6 w-48 bg-gray-100 dark:bg-gray-700 rounded animate-pulse mb-4" />
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="h-12 bg-gray-100 dark:bg-gray-700 rounded animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <DynamicTable
            title={t("performance.table.title", "Agent Performance Table")}
            data={tableData}
            columns={columns}
            initialView="grid"
            hideToolbar
            hidePagination
            hideActionButtons
            disableRowClick
        />
    );
}

export default AgentPerformanceTable;
