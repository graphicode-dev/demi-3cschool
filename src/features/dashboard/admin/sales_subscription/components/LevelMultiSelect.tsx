/**
 * Level Multi-Select Component
 *
 * A multi-select component for choosing levels.
 * Displays selected levels as tags that can be removed.
 */

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { X, ChevronDown, Check } from "lucide-react";
import { useLevelsList } from "@/features/dashboard/admin/learning/pages/levels/api";

interface LevelMultiSelectProps {
    selectedIds: string[] | string;
    onChange: (ids: string[]) => void;
    placeholder?: string;
    disabled?: boolean;
    mode?: "single" | "multi";
}

interface LevelOption {
    id: string;
    title: string;
}

export function LevelMultiSelect({
    selectedIds,
    onChange,
    placeholder,
    disabled = false,
    mode = "multi",
}: LevelMultiSelectProps) {
    const { t } = useTranslation("sales_subscription");
    const [isOpen, setIsOpen] = useState(false);

    const { data: levelsData, isLoading } = useLevelsList({
        programs_curriculum: "first_term",
    });

    const levels: LevelOption[] = useMemo(() => {
        if (!levelsData) return [];
        // Handle both array response and paginated response
        const items = Array.isArray(levelsData) ? levelsData : levelsData.items;
        if (!items) return [];
        return items.map((level) => ({
            id: String(level.id),
            title: level.title,
        }));
    }, [levelsData]);

    // Normalize selectedIds to always be an array
    const normalizedSelectedIds = useMemo(() => {
        if (!selectedIds) return [];
        return Array.isArray(selectedIds) ? selectedIds : [selectedIds];
    }, [selectedIds]);

    const selectedLevels = useMemo(() => {
        return levels.filter((level) =>
            normalizedSelectedIds.includes(level.id)
        );
    }, [levels, normalizedSelectedIds]);

    const availableLevels = useMemo(() => {
        return levels.filter(
            (level) => !normalizedSelectedIds.includes(level.id)
        );
    }, [levels, normalizedSelectedIds]);

    const handleToggle = (levelId: string) => {
        if (mode === "single") {
            onChange([levelId]);
            setIsOpen(false);
        } else {
            if (normalizedSelectedIds.includes(levelId)) {
                onChange(normalizedSelectedIds.filter((id) => id !== levelId));
            } else {
                onChange([...normalizedSelectedIds, levelId]);
            }
        }
    };

    const handleRemove = (levelId: string) => {
        onChange(normalizedSelectedIds.filter((id) => id !== levelId));
    };

    const handleSelectAll = () => {
        if (normalizedSelectedIds.length === levels.length) {
            onChange([]);
        } else {
            onChange(levels.map((l) => l.id));
        }
    };

    return (
        <div className="relative">
            <div
                className={`
                    min-h-[44px] w-full rounded-lg border px-3 py-2
                    bg-white dark:bg-gray-800
                    border-gray-300 dark:border-gray-700
                    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20
                `}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                {selectedLevels.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                        {selectedLevels.map((level) => (
                            <span
                                key={level.id}
                                className="inline-flex items-center gap-3 px-4 py-2 text-sm rounded-lg border border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400"
                            >
                                {level.title}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove(level.id);
                                    }}
                                    className="text-brand-400 hover:text-brand-600 dark:hover:text-brand-300"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </span>
                        ))}
                    </div>
                ) : (
                    <span className="text-gray-400 dark:text-gray-500 text-sm">
                        {placeholder ||
                            t(
                                "coupons.form.fields.levels.placeholder",
                                "Select levels..."
                            )}
                    </span>
                )}
                <ChevronDown
                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </div>

            {isOpen && !disabled && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {isLoading ? (
                        <div className="p-3 text-center text-gray-500">
                            {t("common.loading", "Loading...")}
                        </div>
                    ) : levels.length === 0 ? (
                        <div className="p-3 text-center text-gray-500">
                            {t("common.noData", "No levels available")}
                        </div>
                    ) : mode === "multi" &&
                      availableLevels.length === 0 &&
                      levels.length > 0 ? (
                        <div className="p-3 text-center text-gray-500">
                            {t("common.allSelected", "All levels selected")}
                        </div>
                    ) : (
                        <>
                            {mode === "multi" && (
                                <button
                                    type="button"
                                    onClick={handleSelectAll}
                                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between border-b border-gray-200 dark:border-gray-700"
                                >
                                    <span className="font-medium">
                                        {t("common.selectAll", "Select All")}
                                    </span>
                                    {normalizedSelectedIds.length ===
                                        levels.length && (
                                        <Check className="w-4 h-4 text-brand-500" />
                                    )}
                                </button>
                            )}
                            {(mode === "single" ? levels : availableLevels).map(
                                (level) => (
                                    <button
                                        key={level.id}
                                        type="button"
                                        onClick={() => handleToggle(level.id)}
                                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between"
                                    >
                                        <span>{level.title}</span>
                                        {mode === "single" &&
                                            normalizedSelectedIds.includes(
                                                level.id
                                            ) && (
                                                <Check className="w-4 h-4 text-brand-500" />
                                            )}
                                    </button>
                                )
                            )}
                        </>
                    )}
                </div>
            )}

            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
