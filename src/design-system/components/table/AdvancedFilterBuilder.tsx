import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import type {
    FilterMetadata,
    ActiveFilter,
    FilterOperator,
    TableMetadata,
} from "@/shared/types";
import { ErrorComponent } from "@/design-system";
import { X, Trash2, Plus, Filter } from "lucide-react";
import { Button } from "../button";

interface AdvancedFilterBuilderProps {
    metadata: TableMetadata;
    activeFilters: ActiveFilter[];
    onFiltersChange: (filters: ActiveFilter[]) => void;
    onClose: () => void;
}

export const AdvancedFilterBuilder: React.FC<AdvancedFilterBuilderProps> = ({
    metadata,
    activeFilters,
    onFiltersChange,
    onClose,
}) => {
    const { t } = useTranslation();
    const [filters, setFilters] = useState<ActiveFilter[]>(
        activeFilters.length > 0
            ? activeFilters
            : [
                  {
                      id: crypto.randomUUID(),
                      column: metadata?.filters?.[0]?.column || "",
                      operator: metadata?.filters?.[0]?.operators?.[0] || "=",
                      value: "",
                  },
              ]
    );

    const addFilter = () => {
        setFilters([
            ...filters,
            {
                id: crypto.randomUUID(),
                column: metadata?.filters?.[0]?.column || "",
                operator: metadata?.filters?.[0]?.operators?.[0] || "=",
                value: "",
            },
        ]);
    };

    const removeFilter = (id: string) => {
        setFilters(filters.filter((f) => f.id !== id));
    };

    const updateFilter = (
        id: string,
        field: keyof ActiveFilter,
        value: any
    ) => {
        setFilters(
            filters.map((f) => {
                if (f.id === id) {
                    const updated = { ...f, [field]: value };

                    // If column changed, reset operator and value
                    if (field === "column") {
                        const columnMeta = metadata?.filters.find(
                            (fm) => fm.column === value
                        );
                        updated.operator = columnMeta?.operators[0] || "=";
                        updated.value = "";
                    }

                    return updated;
                }
                return f;
            })
        );
    };

    const applyFilters = () => {
        // Filter out empty values
        const validFilters = filters.filter(
            (f) => f.column && f.value !== "" && f.value !== null
        );
        onFiltersChange(validFilters);
        onClose();
    };

    const clearFilters = () => {
        onFiltersChange([]);
        onClose();
    };

    const getColumnMetadata = (column: string): FilterMetadata | undefined => {
        return metadata?.filters.find((f) => f.column === column);
    };

    const renderValueInput = (filter: ActiveFilter) => {
        const columnMeta = getColumnMetadata(filter.column);
        if (!columnMeta) return null;

        const baseInputClass =
            "flex-1 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white bg-white text-gray-900 transition-all text-sm";

        // Handle null operators
        if (filter.operator === "isNull" || filter.operator === "isNotNull") {
            return (
                <input
                    type="text"
                    value={t("designSystem:designSystem.table.noValueNeeded")}
                    disabled
                    className={`${baseInputClass} opacity-50`}
                />
            );
        }

        switch (columnMeta.type) {
            case "select":
                if (filter.operator === "in" || filter.operator === "notIn") {
                    // Multi-select for 'in' operators
                    return (
                        <select
                            multiple
                            value={
                                Array.isArray(filter.value)
                                    ? filter.value.map(String)
                                    : []
                            }
                            onChange={(e) => {
                                const selected = Array.from(
                                    e.target.selectedOptions,
                                    (option) => option.value
                                );

                                updateFilter(filter.id, "value", selected);
                            }}
                            className={`${baseInputClass} min-h-[100px]`}
                        >
                            {columnMeta.options?.map((opt) => (
                                <option key={opt} value={opt}>
                                    {(columnMeta as any).optionsLabels?.[opt] ||
                                        opt}
                                </option>
                            ))}
                        </select>
                    );
                }
                // Single select
                return (
                    <select
                        value={String(filter.value)}
                        onChange={(e) =>
                            updateFilter(filter.id, "value", e.target.value)
                        }
                        className={baseInputClass}
                    >
                        <option value="">
                            {t("designSystem:designSystem.table.select")}
                        </option>
                        {columnMeta.options?.map((opt) => (
                            <option key={opt} value={opt}>
                                {(columnMeta as any).optionsLabels?.[opt] ||
                                    opt}
                            </option>
                        ))}
                    </select>
                );

            case "date":
                if (filter.operator === "between") {
                    // Date range
                    const [start, end] = Array.isArray(filter.value)
                        ? filter.value
                        : ["", ""];
                    return (
                        <div className="flex gap-2 flex-1">
                            <input
                                type="date"
                                value={String(start)}
                                onChange={(e) =>
                                    updateFilter(filter.id, "value", [
                                        e.target.value,
                                        end,
                                    ])
                                }
                                className={baseInputClass}
                            />
                            <span className="self-center text-gray-500 dark:text-gray-400 text-sm">
                                to
                            </span>
                            <input
                                type="date"
                                value={String(end)}
                                onChange={(e) =>
                                    updateFilter(filter.id, "value", [
                                        start,
                                        e.target.value,
                                    ])
                                }
                                className={baseInputClass}
                            />
                        </div>
                    );
                }
                return (
                    <input
                        type="date"
                        value={String(filter.value)}
                        onChange={(e) =>
                            updateFilter(filter.id, "value", e.target.value)
                        }
                        className={baseInputClass}
                    />
                );

            case "number":
                if (filter.operator === "between") {
                    const [start, end] = Array.isArray(filter.value)
                        ? filter.value
                        : ["", ""];
                    return (
                        <div className="flex gap-2 flex-1">
                            <input
                                type="number"
                                value={String(start)}
                                onChange={(e) =>
                                    updateFilter(filter.id, "value", [
                                        e.target.value,
                                        end,
                                    ])
                                }
                                className={baseInputClass}
                                placeholder={t(
                                    "designSystem:designSystem.table.min"
                                )}
                            />
                            <span className="self-center text-gray-500 dark:text-gray-400 text-sm">
                                to
                            </span>
                            <input
                                type="number"
                                value={String(end)}
                                onChange={(e) =>
                                    updateFilter(filter.id, "value", [
                                        start,
                                        e.target.value,
                                    ])
                                }
                                className={baseInputClass}
                                placeholder={t(
                                    "designSystem:designSystem.table.max"
                                )}
                            />
                        </div>
                    );
                }
                return (
                    <input
                        type="number"
                        value={String(filter.value)}
                        onChange={(e) =>
                            updateFilter(filter.id, "value", e.target.value)
                        }
                        className={baseInputClass}
                        placeholder={t(
                            "designSystem:designSystem.table.enterNumber"
                        )}
                    />
                );

            case "boolean":
                return (
                    <select
                        value={String(filter.value)}
                        onChange={(e) =>
                            updateFilter(filter.id, "value", e.target.value)
                        }
                        className={baseInputClass}
                    >
                        <option value="">Select...</option>
                        <option value="true">
                            {t("designSystem:designSystem.table.yes")}
                        </option>
                        <option value="false">
                            {t("designSystem:designSystem.table.no")}
                        </option>
                    </select>
                );

            case "text":
            default:
                return (
                    <input
                        type="text"
                        value={String(filter.value)}
                        onChange={(e) =>
                            updateFilter(filter.id, "value", e.target.value)
                        }
                        className={baseInputClass}
                        placeholder={t(
                            "designSystem:designSystem.table.enterValue"
                        )}
                    />
                );
        }
    };

    // Guard: If metadata is not loaded or has no filters, show error
    if (!metadata?.filters || metadata.filters.length === 0) {
        return (
            <div>
                <ErrorComponent
                    message={t(
                        "designSystem:designSystem.table.filterMetadataNotAvailable"
                    )}
                    variant="card"
                    showButtons={false}
                />
                <div className="mt-4 flex justify-end">
                    <Button onClick={onClose} variant="outline">
                        {t("designSystem:designSystem.table.close")}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-brand-100 dark:bg-brand-500/20">
                            <Filter className="w-5 h-5 text-brand-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {t(
                                "designSystem:designSystem.table.advancedFilters"
                            )}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Filter List */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-4">
                        {filters.map((filter, index) => {
                            const columnMeta = getColumnMetadata(filter.column);
                            return (
                                <div
                                    key={filter.id}
                                    className="flex gap-4 items-start p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-500/30 transition-colors"
                                >
                                    {/* Filter Number */}
                                    <div className="shrink-0 w-8 h-8 rounded-xl bg-brand-500 text-white flex items-center justify-center text-sm font-medium shadow-sm">
                                        {index + 1}
                                    </div>

                                    <div className="flex-1 space-y-3">
                                        {/* Column and Operator Row */}
                                        <div className="flex gap-3">
                                            {/* Column Select */}
                                            <select
                                                value={filter.column}
                                                onChange={(e) =>
                                                    updateFilter(
                                                        filter.id,
                                                        "column",
                                                        e.target.value
                                                    )
                                                }
                                                className="flex-1 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white bg-white text-gray-900 transition-all text-sm"
                                            >
                                                {metadata?.filters.map((fm) => (
                                                    <option
                                                        key={fm.column}
                                                        value={fm.column}
                                                    >
                                                        {fm.label}
                                                    </option>
                                                ))}
                                            </select>

                                            {/* Operator Select */}
                                            <select
                                                value={filter.operator}
                                                onChange={(e) =>
                                                    updateFilter(
                                                        filter.id,
                                                        "operator",
                                                        e.target
                                                            .value as FilterOperator
                                                    )
                                                }
                                                className="flex-1 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white bg-white text-gray-900 transition-all text-sm"
                                            >
                                                {columnMeta?.operators.map(
                                                    (op) => (
                                                        <option
                                                            key={op}
                                                            value={op}
                                                        >
                                                            {metadata
                                                                ?.operators[
                                                                op
                                                            ] || op}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>

                                        {/* Value Input Row */}
                                        <div className="flex gap-3">
                                            {renderValueInput(filter)}
                                        </div>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeFilter(filter.id)}
                                        className="shrink-0 w-8 h-8 rounded-xl hover:bg-error-50 dark:hover:bg-error-500/10 text-error-500 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={filters.length === 1}
                                        aria-label="Remove filter"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Add Filter Button */}
                    <button
                        onClick={addFilter}
                        className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 hover:border-brand-400 hover:text-brand-500 dark:hover:border-brand-500 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/5 transition-all font-medium flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        {t("designSystem:designSystem.table.addAnotherFilter")}
                    </button>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2.5 text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 rounded-xl transition-colors font-medium flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        {t("designSystem:designSystem.table.clearAll")}
                    </button>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={onClose}>
                            {t("designSystem:designSystem.table.cancel")}
                        </Button>
                        <Button onClick={applyFilters}>
                            {t("designSystem:designSystem.table.applyFilters")}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
