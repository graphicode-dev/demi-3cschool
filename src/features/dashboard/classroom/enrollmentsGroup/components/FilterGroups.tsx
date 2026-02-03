/**
 * FilterGroups Component
 *
 * Filter section for enrollment groups.
 */

import { useTranslation } from "react-i18next";
import { Filter, ChevronDown } from "lucide-react";
import type { SessionType, DayOfWeek } from "../types";

interface FilterGroupsProps {
    sessionType: SessionType;
    selectedDay: DayOfWeek | "all";
    onDayChange: (day: DayOfWeek | "all") => void;
    selectedLocation?: string | "all";
    onLocationChange?: (location: string | "all") => void;
    locations?: string[];
}

export function FilterGroups({
    sessionType,
    selectedDay,
    onDayChange,
    selectedLocation,
    onLocationChange,
    locations = [],
}: FilterGroupsProps) {
    const { t } = useTranslation("enrollmentsGroup");
    const isOffline = sessionType === "offline";

    const days: (DayOfWeek | "all")[] = ["all", "friday", "saturday"];

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <Filter className="size-5 text-brand-500" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {t("filterGroups")}
                </h3>
            </div>

            {/* Filters */}
            <div
                className={`grid gap-4 ${isOffline ? "grid-cols-2" : "grid-cols-1"}`}
            >
                {/* Day Filter */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t("selectDay")}
                    </label>
                    <div className="relative">
                        <select
                            value={selectedDay}
                            onChange={(e) =>
                                onDayChange(e.target.value as DayOfWeek | "all")
                            }
                            className="w-full appearance-none px-4 py-2.5 pr-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                        >
                            {days.map((day) => (
                                <option key={day} value={day}>
                                    {day === "all"
                                        ? t("allDays")
                                        : t(`days.${day}`)}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* Location Filter (offline only) */}
                {isOffline && onLocationChange && (
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t("selectLocation")}
                        </label>
                        <div className="relative">
                            <select
                                value={selectedLocation}
                                onChange={(e) =>
                                    onLocationChange(e.target.value)
                                }
                                className="w-full appearance-none px-4 py-2.5 pr-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="all">{t("allLocations")}</option>
                                {locations.map((location) => (
                                    <option key={location} value={location}>
                                        {location}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FilterGroups;
