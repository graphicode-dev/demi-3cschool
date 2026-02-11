import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Clock,
    Calendar,
    User,
    Users,
    Star,
    Check,
    XCircle,
    AlertCircle,
} from "lucide-react";
import type { VirtualSession } from "../types";
import { usePermissions } from "@/auth";
import { AttendanceModal } from "./AttendanceModal";
import { ReviewsModal } from "./ReviewsModal";
import { SessionRatingModal } from "./SessionRatingModal";
import {
    MOCK_STUDENT_REVIEWS,
    MOCK_CURRENT_STUDENT_ATTENDANCE,
    type AttendanceStatus,
} from "../mocks/sessionMockData";

interface VirtualSessionCardProps {
    session: VirtualSession;
    onJoinSession?: (session: VirtualSession) => void;
    onViewInfo?: (session: VirtualSession) => void;
    onViewRecording?: (session: VirtualSession) => void;
}

// Format time from "HH:mm:ss" to "HH:mm"
function formatTime(time: string): string {
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
}

// Format date from "YYYY-MM-DD" to relative or formatted date
function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return "Today";
    }
    if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
    }

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
}

const attendanceStatusConfig: Record<
    AttendanceStatus,
    { icon: typeof Check; bgColor: string; textColor: string; label: string }
> = {
    present: {
        icon: Check,
        bgColor: "bg-success-100 dark:bg-success-500/20",
        textColor: "text-success-600 dark:text-success-400",
        label: "present",
    },
    absent: {
        icon: XCircle,
        bgColor: "bg-error-100 dark:bg-error-500/20",
        textColor: "text-error-600 dark:text-error-400",
        label: "absent",
    },
    late: {
        icon: Clock,
        bgColor: "bg-warning-100 dark:bg-warning-500/20",
        textColor: "text-warning-600 dark:text-warning-400",
        label: "late",
    },
    excused: {
        icon: AlertCircle,
        bgColor: "bg-gray-100 dark:bg-gray-700",
        textColor: "text-gray-600 dark:text-gray-400",
        label: "excused",
    },
};

export function VirtualSessionCard({
    session,
    onJoinSession,
    onViewInfo,
    onViewRecording,
}: VirtualSessionCardProps) {
    const { t } = useTranslation("virtualSessions");
    const { hasRole } = usePermissions();

    const isTeacher = hasRole("teacher");
    const isStudent = hasRole("student");

    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [showReviewsModal, setShowReviewsModal] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);

    const isLive = session.status === "current";
    const isUpcoming = session.status === "upcoming";
    const isCompleted = session.status === "completed";

    const studentAttendanceStatus = MOCK_CURRENT_STUDENT_ATTENDANCE;
    const attendanceConfig = attendanceStatusConfig[studentAttendanceStatus];
    const AttendanceIcon = attendanceConfig.icon;

    const handleSubmitRating = (rating: number, feedback: string) => {
        // TODO: Implement API call when ready
        console.log("Rating submitted:", {
            sessionId: session.id,
            rating,
            feedback,
        });
        setShowRatingModal(false);
    };

    const getStatusBadge = () => {
        if (isLive) {
            return (
                <div className="flex items-center gap-1.5 bg-error-500 text-white px-2.5 py-1 rounded-full">
                    <span className="size-2 bg-white rounded-full animate-pulse" />
                    <span className="text-xs font-semibold">
                        {t("status.live")}
                    </span>
                </div>
            );
        }
        if (isUpcoming) {
            return (
                <div className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-full">
                    <span className="text-xs font-semibold">
                        {t("status.upcoming")}
                    </span>
                </div>
            );
        }
        if (isCompleted) {
            return (
                <div className="bg-warning-100 dark:bg-warning-500/20 text-warning-600 px-2.5 py-1 rounded-full">
                    <span className="text-xs font-semibold">
                        {t("status.completed")}
                    </span>
                </div>
            );
        }
        return null;
    };

    const getActionButton = () => {
        if (isLive) {
            return (
                <button
                    onClick={() => onJoinSession?.(session)}
                    className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
                >
                    {t("session.joinSession")}
                </button>
            );
        }
        if (isUpcoming) {
            return (
                <button
                    onClick={() => onViewInfo?.(session)}
                    className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
                >
                    {t("session.sessionInfo")}
                </button>
            );
        }
        if (isCompleted) {
            return (
                <button
                    onClick={() => onViewRecording?.(session)}
                    className="w-full bg-warning-500 hover:bg-warning-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
                >
                    {t("session.viewRecording")}
                </button>
            );
        }
        return null;
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-theme-sm p-4 flex flex-col gap-3 w-full md:w-[280px]">
            {/* Header - Tags and Status */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                    <span className="bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-medium px-2 py-0.5 rounded">
                        {session.course.title}
                    </span>
                    <span className="bg-brand-50 dark:bg-brand-500/10 text-brand-500 text-xs font-medium px-2 py-0.5 rounded border border-brand-200 dark:border-brand-500/30">
                        Term {session.term.id}
                    </span>
                </div>
                {getStatusBadge()}
            </div>

            {/* Title */}
            <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2">
                {session.topic}
            </h3>

            {/* Instructor */}
            <div className="flex items-center gap-3">
                <div className="size-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <User className="size-5 text-gray-400" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {session.instructor.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {session.instructor.course}
                    </span>
                </div>
            </div>

            {/* Time and Date */}
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                    <Clock className="size-4" />
                    <span>{formatTime(session.startTime)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Calendar className="size-4" />
                    <span>
                        {isLive
                            ? t("session.liveNow")
                            : formatDate(session.sessionDate)}
                    </span>
                </div>
            </div>

            {/* Student Attendance Status Badge */}
            {isStudent && (
                <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${attendanceConfig.bgColor}`}
                >
                    <AttendanceIcon
                        className={`size-4 ${attendanceConfig.textColor}`}
                    />
                    <span
                        className={`text-xs font-medium ${attendanceConfig.textColor}`}
                    >
                        {t(`attendance.status.${attendanceConfig.label}`)}
                    </span>
                </div>
            )}

            {/* Action Button */}
            {getActionButton()}

            {/* Teacher Actions - Attendance & Reviews */}
            {isStudent && (
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowAttendanceModal(true)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <Users className="size-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t("session.attendance")}
                        </span>
                    </button>
                    <button
                        onClick={() => setShowReviewsModal(true)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <Star className="size-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t("session.reviews")}
                        </span>
                    </button>
                </div>
            )}

            {/* Student Review Button */}
            {isStudent && (
                <button
                    onClick={() => setShowRatingModal(true)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border-2 border-brand-500 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                >
                    <Star className="size-4" />
                    <span className="text-sm font-semibold">
                        {t("session.rateSession")}
                    </span>
                </button>
            )}

            {/* Modals */}
            <AttendanceModal
                isOpen={showAttendanceModal}
                onClose={() => setShowAttendanceModal(false)}
                sessionId={session.id}
                sessionTopic={session.topic}
            />

            <ReviewsModal
                isOpen={showReviewsModal}
                onClose={() => setShowReviewsModal(false)}
                reviews={MOCK_STUDENT_REVIEWS}
                sessionTopic={session.topic}
            />

            <SessionRatingModal
                isOpen={showRatingModal}
                onClose={() => setShowRatingModal(false)}
                onSubmit={handleSubmitRating}
            />
        </div>
    );
}

export default VirtualSessionCard;
