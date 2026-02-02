/**
 * DayCard Component
 * Displays a day's time slots in a card format
 */

import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { DaySlots } from "../types";

interface DayCardProps {
    daySlots: DaySlots;
    variant?: "online" | "offline";
}

const dayColors = {
    online: {
        headerBg: "bg-success-50 dark:bg-success-500/10",
        headerBorder: "border-success-500",
        badge: "bg-success-500",
        icon: "text-success-500 dark:text-success-400",
    },
    offline: {
        headerBg: "bg-brand-50 dark:bg-brand-500/10",
        headerBorder: "border-brand-500",
        badge: "bg-brand-500",
        icon: "text-brand-500 dark:text-brand-400",
    },
};

export function DayCard({ daySlots, variant = "online" }: DayCardProps) {
    const { t } = useTranslation("slots");
    const colors = dayColors[variant];

    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
            {/* Day Header */}
            <div
                className={`flex items-center gap-3 px-6 py-5 ${colors.headerBg} border-b-2 ${colors.headerBorder}`}
            >
                <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${colors.badge} text-white font-bold text-sm`}
                >
                    {daySlots.dayAbbr}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {daySlots.day}
                </h3>
            </div>

            {/* Time Slots Table */}
            <div className="px-6 py-4">
                {/* Table Header */}
                <div className="grid grid-cols-2 border-b border-gray-200 dark:border-gray-700 pb-3 mb-2">
                    <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t("table.from")}
                    </div>
                    <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t("table.to")}
                    </div>
                </div>

                {/* Table Body */}
                <div className="space-y-1">
                    {daySlots.slots.length > 0 ? (
                        daySlots.slots.map((slot, index) => (
                            <div
                                key={slot.id || index}
                                className="grid grid-cols-2 py-3 border-b border-gray-100 dark:border-gray-700/50 last:border-0"
                            >
                                <div className="flex items-center gap-2">
                                    <Clock
                                        size={16}
                                        className={colors.icon}
                                    />
                                    <span className="text-base text-gray-900 dark:text-gray-100">
                                        {slot.from}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock
                                        size={16}
                                        className={colors.icon}
                                    />
                                    <span className="text-base text-gray-900 dark:text-gray-100">
                                        {slot.to}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-6 text-center text-gray-400 dark:text-gray-500 text-sm">
                            {t("empty.noSlotsDescription")}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DayCard;
