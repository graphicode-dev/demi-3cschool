import { ActiveFilter, TableMetadata } from "@/shared/types";
import React from "react";
import { useTranslation } from "react-i18next";

interface ActiveFiltersDisplayProps {
    filters: ActiveFilter[];
    metadata: TableMetadata;
    onRemoveFilter: (filterId: string) => void;
    onClearAll: () => void;
}

export const ActiveFiltersDisplay: React.FC<ActiveFiltersDisplayProps> = ({
    filters,
    metadata,
    onRemoveFilter,
    onClearAll,
}) => {
    const { t } = useTranslation();

    if (filters.length === 0) return null;

    const getFilterLabel = (filter: ActiveFilter): string => {
        const columnMeta = metadata.filters.find(
            (f) => f.column === filter.column
        );
        const operatorLabel =
            metadata.operators[filter.operator] || filter.operator;

        let valueLabel: string;

        if (filter.operator === "isNull" || filter.operator === "isNotNull") {
            valueLabel = "";
        } else if (Array.isArray(filter.value)) {
            // Map values to labels if available
            const mappedValues = filter.value.map((val) => {
                const optionsLabels = (columnMeta as any)?.optionsLabels;
                return optionsLabels?.[val] || val;
            });
            valueLabel = mappedValues.join(", ");
        } else {
            // Use label if available, otherwise use raw value
            const optionsLabels = (columnMeta as any)?.optionsLabels;
            const stringValue = String(filter.value);
            valueLabel = optionsLabels?.[stringValue] || stringValue;
        }

        return `${columnMeta?.label || filter.column} ${operatorLabel}${
            valueLabel ? ` ${valueLabel}` : ""
        }`;
    };

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {t("designSystem:designSystem.table.activeFilters")}
            </span>
            {filters.map((filter) => (
                <div
                    key={filter.id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 rounded-full text-sm text-brand-700 dark:text-brand-400"
                >
                    <span>{getFilterLabel(filter)}</span>
                    <button
                        type="button"
                        onClick={() => onRemoveFilter(filter.id)}
                        className="hover:text-error-500 dark:hover:text-error-400 transition-colors"
                        aria-label="Remove filter"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                        <span className="sr-only">
                            {t("designSystem:designSystem.table.removeFilter")}
                        </span>
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={onClearAll}
                className="text-sm text-error-500 hover:text-error-600 dark:text-error-400 dark:hover:text-error-300 font-medium underline transition-colors"
            >
                {t("designSystem:designSystem.table.clearAll")}
            </button>
        </div>
    );
};
