/**
 * PeriodFilter Component
 *
 * Toggle buttons for Weekly/Monthly period filter.
 */

import { useTranslation } from "react-i18next";
import type { PeriodFilter as PeriodFilterType } from "../types";

interface PeriodFilterProps {
    value: PeriodFilterType;
    onChange: (value: PeriodFilterType) => void;
}

export function PeriodFilter({ value, onChange }: PeriodFilterProps) {
    const { t } = useTranslation("adminTicketsManagement");

    return (
        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
                onClick={() => onChange("weekly")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    value === "weekly"
                        ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
            >
                {t("performance.filter.weekly", "Weekly")}
            </button>
            <button
                onClick={() => onChange("monthly")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    value === "monthly"
                        ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
            >
                {t("performance.filter.monthly", "Monthly")}
            </button>
        </div>
    );
}

export default PeriodFilter;
