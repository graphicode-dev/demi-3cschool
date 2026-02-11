/**
 * LevelFilterDropdown Component
 *
 * A dropdown to filter lessons by level or show all lessons.
 */

import { useTranslation } from "react-i18next";

interface LevelOption {
    id: string;
    title: string;
}

interface LevelFilterDropdownProps {
    levels: LevelOption[];
    selectedLevelId: string | null;
    onChange: (levelId: string | null) => void;
    isLoading?: boolean;
    className?: string;
}

export function LevelFilterDropdown({
    levels,
    selectedLevelId,
    onChange,
    isLoading = false,
    className = "",
}: LevelFilterDropdownProps) {
    const { t } = useTranslation();

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("learning:lessons.filter.chooseLevel", "Choose Level")}
            </label>
            <div className="relative">
                <select
                    value={selectedLevelId ?? "all"}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === "all") {
                            onChange("all");
                        } else {
                            onChange(value);
                        }
                    }}
                    disabled={isLoading}
                    className="block w-full px-4 py-3 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg appearance-none focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-brand-500 dark:focus:border-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <option value="all">
                        {t("learning:lessons.filter.selectAll", "Select All")}
                    </option>
                    {levels.map((level) => (
                        <option key={level.id} value={level.id}>
                            {level.title}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                    <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default LevelFilterDropdown;
