import React from "react";
import type { SortConfig } from "@/shared/types";

interface SortableHeaderProps {
    children: React.ReactNode;
    column: string;
    sortable?: boolean;
    sortConfig: SortConfig | null;
    onSort?: (column: string) => void;
}

export const SortableHeader = ({
    children,
    column,
    sortable = true,
    sortConfig,
    onSort,
}: SortableHeaderProps) => {
    if (!sortable || !onSort) {
        return <div>{children}</div>;
    }

    const isActive = sortConfig?.column === column;
    const direction = isActive ? sortConfig?.direction : null;

    return (
        <button
            className="flex items-center gap-1 hover:text-brand-600 dark:hover:text-brand-400 text-gray-500 dark:text-gray-400 focus:outline-none transition-colors"
            onClick={() => onSort(column)}
            type="button"
        >
            <span>{children}</span>
            <span className="flex flex-col h-4">
                {direction === "asc" ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-brand-500 dark:text-brand-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                        />
                    </svg>
                ) : direction === "desc" ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-brand-500 dark:text-brand-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-400 dark:text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                        />
                    </svg>
                )}
            </span>
        </button>
    );
};
