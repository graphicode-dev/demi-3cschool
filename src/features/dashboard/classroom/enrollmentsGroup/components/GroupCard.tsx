/**
 * GroupCard Component
 *
 * Displays an enrollment group card for online or offline sessions.
 * Matches the Figma design with session type badge, location, day, time, and enroll button.
 */

import { useTranslation } from "react-i18next";
import { Monitor, MapPin, Calendar, Clock } from "lucide-react";
import type { EnrollmentGroup } from "../types";

interface GroupCardProps {
    group: EnrollmentGroup;
    onEnroll: (group: EnrollmentGroup) => void;
    onViewMap?: (group: EnrollmentGroup) => void;
}

export function GroupCard({ group, onEnroll, onViewMap }: GroupCardProps) {
    const { t } = useTranslation("enrollmentsGroup");
    const isOffline = group.sessionType === "offline";

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 flex flex-col gap-4 min-w-[220px]">
            {/* Session Type Badge */}
            <div className="flex items-center gap-1.5">
                {isOffline ? (
                    <MapPin className="size-4 text-warning-500" />
                ) : (
                    <Monitor className="size-4 text-brand-500" />
                )}
                <span
                    className={`text-sm font-medium ${isOffline ? "text-warning-500" : "text-brand-500"}`}
                >
                    {isOffline ? t("offlineSessions") : t("onlineSessions")}
                </span>
            </div>

            {/* Location (offline only) */}
            {isOffline && group.location && (
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-warning-100 dark:bg-warning-500/20 flex items-center justify-center shrink-0">
                        <MapPin className="size-4 text-warning-500" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                            {t("location")}
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {group.location}
                        </span>
                        {group.address && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {group.address}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Day */}
            <div className="flex items-center gap-3">
                <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        isOffline
                            ? "bg-warning-100 dark:bg-warning-500/20"
                            : "bg-brand-100 dark:bg-brand-500/20"
                    }`}
                >
                    <Calendar
                        className={`size-4 ${isOffline ? "text-warning-500" : "text-brand-500"}`}
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                        {t("day")}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                        {t(`days.${group.day}`)}
                    </span>
                </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-3">
                <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        isOffline
                            ? "bg-warning-100 dark:bg-warning-500/20"
                            : "bg-brand-100 dark:bg-brand-500/20"
                    }`}
                >
                    <Clock
                        className={`size-4 ${isOffline ? "text-warning-500" : "text-brand-500"}`}
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                        {t("time")}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {group.startTime} - {group.endTime}
                    </span>
                </div>
            </div>

            {/* Enroll Button */}
            <button
                onClick={() => onEnroll(group)}
                className={`w-full py-3 rounded-xl text-sm font-semibold text-white transition-colors ${
                    isOffline
                        ? "bg-warning-500 hover:bg-warning-600"
                        : "bg-brand-500 hover:bg-brand-600"
                }`}
            >
                {t("enrollNow")}
            </button>

            {/* View Map (offline only) */}
            {isOffline && onViewMap && (
                <button
                    onClick={() => onViewMap(group)}
                    className="flex items-center justify-center gap-1.5 text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors"
                >
                    <MapPin className="size-4" />
                    {t("viewMap")}
                </button>
            )}
        </div>
    );
}

export default GroupCard;
