/**
 * SessionCard Component
 *
 * Displays a scheduled session with its number, lesson info, date/time,
 * and action buttons (reschedule, delete, assign lesson).
 */

import { useTranslation } from "react-i18next";
import { Calendar, Clock, Trash2, AlertCircle, Video } from "lucide-react";
import { format, parseISO } from "date-fns";

export type SessionStatus = "assigned" | "not_assigned" | "action_required";

interface SessionCardProps {
    sessionNumber: number;
    lessonTitle?: string;
    date: string;
    startTime: string;
    endTime: string;
    status: SessionStatus;
    locationType?: "online" | "offline";
    isRecreatingMeeting?: boolean;
    onReschedule?: () => void;
    onDelete?: () => void;
    onAssignLesson?: () => void;
    onRecreateMeeting?: () => void;
}

export function SessionCard({
    sessionNumber,
    lessonTitle,
    date,
    startTime,
    endTime,
    status,
    locationType,
    isRecreatingMeeting,
    onReschedule,
    onDelete,
    onAssignLesson,
    onRecreateMeeting,
}: SessionCardProps) {
    const { t } = useTranslation("groupsManagement");

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(":");
        return `${hours}:${minutes}`;
    };

    const formatDate = (dateStr: string) => {
        try {
            return format(parseISO(dateStr), "EEE, MMM d, yyyy");
        } catch {
            return dateStr;
        }
    };

    const getStatusStyles = () => {
        switch (status) {
            case "assigned":
                return {
                    border: "border-green-200 dark:border-green-800",
                    bg: "bg-white dark:bg-gray-800",
                    numberBg: "bg-green-500",
                    badge: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                    badgeText: t("sessions.lessonAssigned", "Lesson Assigned"),
                };
            case "not_assigned":
            case "action_required":
                return {
                    border: "border-amber-200 dark:border-amber-800",
                    bg: "bg-amber-50/50 dark:bg-amber-900/10",
                    numberBg: "bg-amber-400",
                    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                    badgeText: t(
                        "sessions.noLessonAssigned",
                        "No lesson assigned yet"
                    ),
                };
        }
    };

    const styles = getStatusStyles();

    return (
        <div
            className={`rounded-xl border ${styles.border} ${styles.bg} p-4 transition-all`}
        >
            <div className="flex items-start gap-4">
                {/* Session Number */}
                <div
                    className={`w-12 h-12 flex items-center justify-center ${styles.numberBg} rounded-xl text-white font-bold text-lg shrink-0`}
                >
                    {String(sessionNumber).padStart(2, "0")}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Status Badge */}
                    <span
                        className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full mb-1 ${styles.badge}`}
                    >
                        {styles.badgeText}
                    </span>

                    {/* Lesson Title or No Lesson Message */}
                    {lessonTitle ? (
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                            {lessonTitle}
                        </h3>
                    ) : (
                        <h3 className="text-base font-medium text-gray-500 dark:text-gray-400">
                            {t(
                                "sessions.noLessonYet",
                                "No lesson assigned yet"
                            )}
                        </h3>
                    )}

                    {/* Date and Time */}
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(date)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>
                                {formatTime(startTime)} - {formatTime(endTime)}
                            </span>
                        </div>
                    </div>

                    {/* Action Required Warning */}
                    {status === "action_required" && (
                        <div className="flex items-center gap-1.5 mt-2 text-sm text-amber-600 dark:text-amber-400">
                            <AlertCircle className="w-4 h-4" />
                            <span>
                                {t(
                                    "sessions.actionRequired",
                                    "Action Required"
                                )}
                            </span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    {status === "assigned" ? (
                        <>
                            {/* Recreate Meeting button - only for online sessions */}
                            {locationType === "online" && (
                                <button
                                    onClick={onRecreateMeeting}
                                    disabled={isRecreatingMeeting}
                                    className="p-2 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title={t(
                                        "sessions.recreateMeeting",
                                        "Recreate Meeting"
                                    )}
                                >
                                    <Video
                                        className={`w-5 h-5 ${isRecreatingMeeting ? "animate-pulse" : ""}`}
                                    />
                                </button>
                            )}
                            <button
                                onClick={onReschedule}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                title={t("sessions.reschedule", "Reschedule")}
                            >
                                <Calendar className="w-5 h-5" />
                            </button>
                            <button
                                onClick={onDelete}
                                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title={t("sessions.delete", "Delete")}
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onAssignLesson}
                            className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            {t("sessions.assignLesson", "Assign lesson")}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SessionCard;
