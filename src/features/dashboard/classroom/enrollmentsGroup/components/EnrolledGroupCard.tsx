/**
 * EnrolledGroupCard Component
 *
 * Displays the user's enrolled group with active status.
 */

import { useTranslation } from "react-i18next";
import { Monitor, MapPin, Calendar, Clock, CheckSquare } from "lucide-react";
import type { EnrolledGroup } from "../types";

interface EnrolledGroupCardProps {
    group: EnrolledGroup;
}

export function EnrolledGroupCard({ group }: EnrolledGroupCardProps) {
    const { t } = useTranslation("enrollmentsGroup");
    const isOffline = group.sessionType === "offline";

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-success-200 dark:border-success-500/30 p-5 flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
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
                <span className="px-3 py-1 bg-success-100 dark:bg-success-500/20 text-success-600 dark:text-success-400 text-xs font-semibold rounded-full flex items-center gap-1">
                    <Monitor className="size-3" />
                    {t("yourGroup")}
                </span>
            </div>

            {/* Location (offline only) */}
            {isOffline && group.location && (
                <div className="flex items-start gap-2">
                    <MapPin className="size-4 text-warning-500 mt-0.5" />
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
            <div className="flex items-center gap-2">
                <Calendar className="size-4 text-gray-400" />
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
            <div className="flex items-center gap-2">
                <Clock className="size-4 text-gray-400" />
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                        {t("time")}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {group.startTime} - {group.endTime}
                    </span>
                </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <CheckSquare className="size-4 text-success-500" />
                <span className="text-sm font-medium text-success-500">
                    {t("activeStatus")}
                </span>
            </div>
        </div>
    );
}

export default EnrolledGroupCard;
