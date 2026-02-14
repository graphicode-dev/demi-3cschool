import { useTranslation } from "react-i18next";
import { X, Calendar, Clock, Timer, Globe, Bell, User } from "lucide-react";
import { ScheduleSession } from "../types";
import { useCallback } from "react";

interface SessionInfoModalProps {
    session: ScheduleSession;
    onClose: () => void;
}

// Format time from "HH:mm:ss" to "HH:mm"
function formatTime(time: string): string {
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
}

// Format date to display - returns key or formatted date
function formatDateKey(dateStr: string): {
    isToday: boolean;
    formatted: string;
} {
    const date = new Date(dateStr);
    const today = new Date();

    if (date.toDateString() === today.toDateString()) {
        return { isToday: true, formatted: "" };
    }

    return {
        isToday: false,
        formatted: date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
        }),
    };
}

export function SessionInfoModal({ session, onClose }: SessionInfoModalProps) {
    const { t } = useTranslation("virtualSessions");

    const calculatedDuration = useCallback(() => {
        const startTime = new Date(`1970-01-01T${session.startTime}`);
        const endTime = new Date(`1970-01-01T${session.endTime}`);
        const duration = endTime.getTime() - startTime.getTime();
        const hours = Math.floor(duration / (1000 * 60 * 60));
        const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    }, [session]);

    if (!session) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-start justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {session.title}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <X className="size-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col gap-5">
                    {/* Class Schedule */}
                    <div className="flex flex-col gap-3">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t("modal.classSchedule")}
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {/* Date */}
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3 flex items-center gap-3">
                                <Calendar className="size-5 text-brand-400" />
                                <div className="flex flex-col">
                                    <span className="text-xs dark:text-gray-400">
                                        {t("modal.date")}
                                    </span>
                                    <span className="text-sm font-medium dark:text-white">
                                        {(() => {
                                            const dateInfo = formatDateKey(
                                                session.date
                                            );
                                            return dateInfo.isToday
                                                ? t("common.today")
                                                : dateInfo.formatted;
                                        })()}
                                    </span>
                                </div>
                            </div>
                            {/* Time */}
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3 flex items-center gap-3">
                                <Clock className="size-5 text-brand-400" />
                                <div className="flex flex-col">
                                    <span className="text-xs dark:text-gray-400">
                                        {t("modal.time")}
                                    </span>
                                    <span className="text-sm font-medium dark:text-white">
                                        {formatTime(session.startTime)} -{" "}
                                        {formatTime(session.endTime)}
                                    </span>
                                </div>
                            </div>
                            {/* Duration */}
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3 flex items-center gap-3">
                                <Timer className="size-5 text-warning-400" />
                                <div className="flex flex-col">
                                    <span className="text-xs dark:text-gray-400">
                                        {t("modal.duration")}
                                    </span>
                                    <span className="text-sm font-medium dark:text-white">
                                        {calculatedDuration()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SessionInfoModal;
