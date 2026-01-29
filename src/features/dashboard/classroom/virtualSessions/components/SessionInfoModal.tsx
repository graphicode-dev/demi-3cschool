import { useTranslation } from "react-i18next";
import { X, Calendar, Clock, Timer, Globe, Bell, User } from "lucide-react";
import type { VirtualSession } from "../types";

interface SessionInfoModalProps {
    session: VirtualSession;
    isOpen: boolean;
    onClose: () => void;
    onRemindMe?: (session: VirtualSession) => void;
}

// Format time from "HH:mm:ss" to "HH:mm"
function formatTime(time: string): string {
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
}

// Format date to display
function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const today = new Date();

    if (date.toDateString() === today.toDateString()) {
        return "Today";
    }

    return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
    });
}

export function SessionInfoModal({
    session,
    isOpen,
    onClose,
    onRemindMe,
}: SessionInfoModalProps) {
    const { t } = useTranslation("virtualSessions");

    if (!isOpen) return null;

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
                            {session.topic}
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-medium px-2 py-0.5 rounded">
                                {session.course.title}
                            </span>
                            <span className="bg-brand-50 dark:bg-brand-500/10 text-brand-500 text-xs font-medium px-2 py-0.5 rounded border border-brand-200 dark:border-brand-500/30">
                                Term {session.term.id}
                            </span>
                            <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-2 py-0.5 rounded">
                                {t("status.upcoming")}
                            </span>
                        </div>
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
                            <div className="bg-gray-800 dark:bg-gray-800 rounded-xl p-3 flex items-center gap-3">
                                <Calendar className="size-5 text-brand-400" />
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400">
                                        {t("modal.date")}
                                    </span>
                                    <span className="text-sm font-medium text-white">
                                        {formatDate(session.sessionDate)}
                                    </span>
                                </div>
                            </div>
                            {/* Time */}
                            <div className="bg-gray-800 dark:bg-gray-800 rounded-xl p-3 flex items-center gap-3">
                                <Clock className="size-5 text-brand-400" />
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400">
                                        {t("modal.time")}
                                    </span>
                                    <span className="text-sm font-medium text-white">
                                        {formatTime(session.startTime)}
                                    </span>
                                </div>
                            </div>
                            {/* Duration */}
                            <div className="bg-gray-800 dark:bg-gray-800 rounded-xl p-3 flex items-center gap-3">
                                <Timer className="size-5 text-warning-400" />
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400">
                                        {t("modal.duration")}
                                    </span>
                                    <span className="text-sm font-medium text-white">
                                        {session.duration || 60} min
                                    </span>
                                </div>
                            </div>
                            {/* Timezone */}
                            <div className="bg-gray-800 dark:bg-gray-800 rounded-xl p-3 flex items-center gap-3">
                                <Globe className="size-5 text-warning-400" />
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400">
                                        {t("modal.timezone")}
                                    </span>
                                    <span className="text-sm font-medium text-white">
                                        {session.timezone || "GMT+3"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Instructor */}
                    <div className="flex flex-col gap-3">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t("modal.yourInstructor")}
                        </h3>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <div className="size-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                <User className="size-6 text-gray-400" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {session.instructor.name}
                                </span>
                                <span className="text-xs text-brand-500">
                                    {session.instructor.course}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* What we'll learn */}
                    {session.description && (
                        <div className="flex flex-col gap-3">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t("modal.whatYouLearn")}
                            </h3>
                            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {session.description}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Remind Me Button */}
                    <button
                        onClick={() => onRemindMe?.(session)}
                        className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                        <Bell className="size-5" />
                        {t("modal.remindMe")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SessionInfoModal;
