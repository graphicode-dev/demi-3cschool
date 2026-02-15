import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Monitor,
    Building2,
    Check,
    Lock,
    Play,
    Calendar,
    Clock,
    Timer,
    Users,
    Star,
    Bell,
    XCircle,
    AlertCircle,
    Loader2,
} from "lucide-react";
import type { AttendanceStatus, OnlineSession } from "../types";
import { usePermissions } from "@/auth";
import { useCreateZoomMeeting } from "../api";
import { AttendanceModal } from "./AttendanceModal";
import { ReviewsModal } from "./ReviewsModal";
import { useToast } from "@/design-system";
import { useCalculateDuration } from "@/features/dashboard/shared";
import {
    useContentReview,
    useCreateContentReview,
} from "../../selfStudy/api/sessionReview.queries";
import { RatingModal } from "../../selfStudy";

interface SessionItemProps {
    session: OnlineSession;
    programId?: number | string;
    onStart?: (sessionId: number) => void;
    index: number;
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

export function VirtualSessionItem({
    session,
    programId,
    onStart,
    index,
}: SessionItemProps) {
    const { t } = useTranslation("virtualSessions");
    const { addToast } = useToast();
    const { hasRole } = usePermissions();
    const calculatedDuration = useCalculateDuration(
        session.startTime,
        session.endTime
    );

    const isTeacher = hasRole("teacher");
    const isStudent = hasRole("student");

    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [showReviewsModal, setShowReviewsModal] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);

    const createZoomMeetingMutation = useCreateZoomMeeting();
    const { data: existingReview } = useContentReview(session.id);

    // Mutation for creating/updating review
    const { mutate: submitReview, isPending: isSubmitting } =
        useCreateContentReview({
            onSuccess: () => {
                setShowRatingModal(false);
            },
        });

    const handleSubmitReview = (rating: number, feedback: string) => {
        submitReview({
            sessionId: session.id,
            payload: {
                rate: rating,
                comment: feedback,
            },
        });
    };

    const currentRating = existingReview?.rate ?? 0;

    const isCompleted = session.sessionState === "completed";
    const isCurrent = session.sessionState === "current";
    const isUpcoming = session.sessionState === "upcoming";
    const isLocked = isUpcoming;
    const isOnline = session.locationType === "online";
    const isCancelled = session.sessionState === "canceled";
    const hasZoomMeeting = session.hasZoomMeeting ?? false;
    const zoomMeetingUrl = session.zoomMeeting?.meetingUrl;

    // Format session date and time
    const sessionDate = new Date(`${session.sessionDate}T${session.startTime}`);
    const isToday = sessionDate.toDateString() === new Date().toDateString();
    const formattedDate = isToday
        ? t("common.today")
        : sessionDate.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
          });

    const formattedTime = `${session.startTime.slice(0, 5)} - ${session.endTime.slice(0, 5)}`;

    // TODO: Get actual attendance status from API
    const studentAttendanceStatus: AttendanceStatus = "present";
    const attendanceConfig = attendanceStatusConfig[studentAttendanceStatus];
    const AttendanceIcon = attendanceConfig.icon;

    const handleTeacherJoinOrStart = async () => {
        if (hasZoomMeeting && zoomMeetingUrl) {
            // Meeting already exists, just join
            window.open(zoomMeetingUrl, "_blank");
            onStart?.(session.id);
        } else {
            // Create meeting first, then open the start URL
            try {
                const result = await createZoomMeetingMutation.mutateAsync({
                    sessionId: session.id,
                    programId,
                });
                // For teacher, use startUrl to start the meeting
                const meetingUrl = result.zoom.startUrl;
                window.open(meetingUrl, "_blank");
                onStart?.(session.id);
            } catch (error) {
                console.error("Failed to create Zoom meeting:", error);
            }
        }
    };

    const handleStudentJoin = () => {
        if (zoomMeetingUrl) {
            window.open(zoomMeetingUrl, "_blank");
            onStart?.(session.id);
        }
    };

    const handleJoinClick = () => {
        if (isTeacher) {
            handleTeacherJoinOrStart();
        } else if (isStudent) {
            handleStudentJoin();
        } else {
            onStart?.(session.id);
        }
    };

    const handleRemindMe = () => {
        // TODO: Implement reminder functionality
        addToast({
            type: "success",
            message: t("toast.reminderSet"),
        });
    };

    const isCreatingMeeting = createZoomMeetingMutation.isPending;
    const orderNumber = String(index + 1).padStart(2, "0");

    return (
        <>
            <div
                className={`
                    flex items-center justify-between px-6 py-4 rounded-2xl
                ${isCompleted ? "bg-success-50 dark:bg-success-500/10 border border-success-500" : "bg-white dark:bg-gray-900 shadow-theme-sm"}
                ${isCurrent ? "bg-brand-50 dark:bg-brand-500/10 border border-brand-500" : "bg-white dark:bg-gray-900 shadow-theme-sm"}
                    ${isCancelled ? "bg-error-50 dark:bg-error-500/10 border border-error-500" : ""}
                `}
            >
                {/* Left Section */}
                <div className="flex items-start gap-3">
                    {/* Order Number */}
                    <span
                        className={`
                        text-xl font-bold w-8
                        ${isCompleted ? "text-success-500" : ""}
                        ${isCurrent ? "text-brand-500" : ""}
                        ${isLocked ? "text-gray-400/50 dark:text-gray-500/50" : ""}
                    `}
                    >
                        {orderNumber}
                    </span>

                    {/* Icon */}
                    <div
                        className={`
                                size-6
                                ${isCompleted ? "text-success-500" : ""}
                                ${isCurrent ? "text-brand-500" : ""}
                                ${isLocked ? "text-gray-400/50 dark:text-gray-500/50" : ""}
                                ${isCancelled ? "text-error-500" : ""}
                            `}
                    >
                        {isOnline ? (
                            <Monitor className="size-full" />
                        ) : (
                            <Building2 className="size-full" />
                        )}
                    </div>

                    {/* Title & Type */}
                    <div className="space-y-2">
                        <div className="flex items-start gap-2">
                            <h3
                                className={`
                                        font-semibold
                                        ${isCompleted ? "text-gray-900/80 dark:text-white/80" : ""}
                                        ${isCurrent ? "text-gray-900/80 dark:text-white/80" : ""}
                                        ${isLocked ? "text-gray-900/80 dark:text-white/80" : ""}
                                        ${isCancelled ? "text-gray-500 line-through" : ""}
                                    `}
                            >
                                {session.lesson.title}
                            </h3>

                            {/* Student Attendance Badge - Below instructor */}
                            {isStudent && isCompleted && (
                                <div
                                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg ${attendanceConfig.bgColor} mt-1 w-fit`}
                                >
                                    <AttendanceIcon
                                        className={`size-3 ${attendanceConfig.textColor}`}
                                    />
                                    <span
                                        className={`text-xs font-medium ${attendanceConfig.textColor}`}
                                    >
                                        {t(
                                            `attendance.status.${attendanceConfig.label}`
                                        )}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center">
                            {/* Session Date/Time Info */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-0.5">
                                    <Calendar className="size-4 text-brand-400" />
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {formattedDate}
                                    </span>
                                </div>
                                <div className="flex items-center gap-0.5">
                                    <Clock className="size-4 text-brand-400" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {formattedTime}
                                    </span>
                                </div>
                                <div className="flex items-center gap-0.5">
                                    <Timer className="size-4 text-warning-400" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {calculatedDuration()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Instructor Info */}
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {session?.teacher?.name}
                        </p>
                    </div>
                </div>

                {/* Right Section - Status & Actions */}
                <div className="flex items-center gap-2">
                    {/* Completed - Review Button */}
                    {isCompleted && !isCancelled && (
                        <button
                            onClick={() => onStart?.(session.id)}
                            className="flex items-center gap-1.5 bg-success-100 hover:bg-success-200 dark:bg-success-500/20 dark:hover:bg-success-500/30 text-success-600 dark:text-success-400 px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                        >
                            <Check className="size-4" strokeWidth={3} />
                            {t("status.review")}
                        </button>
                    )}

                    {/* Current/Live - Join Button */}
                    {isCurrent && !isCancelled && (
                        <button
                            onClick={handleJoinClick}
                            disabled={
                                isCreatingMeeting ||
                                (isStudent && !hasZoomMeeting)
                            }
                            className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isCreatingMeeting && (
                                <Loader2 className="size-4 animate-spin" />
                            )}
                            {!isCreatingMeeting && (
                                <Play className="size-4" fill="currentColor" />
                            )}
                            {isTeacher
                                ? hasZoomMeeting
                                    ? t("status.join")
                                    : t("session.startMeeting")
                                : t("status.join")}
                        </button>
                    )}

                    {/* Upcoming - Locked with Remind Me */}
                    {isLocked && !isCancelled && (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleRemindMe}
                                className="flex items-center gap-1.5 bg-brand-50 hover:bg-brand-100 dark:bg-brand-500/10 dark:hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 px-3 py-1.5 rounded-lg font-medium text-sm transition-colors"
                            >
                                <Bell className="size-4" />
                                {t("session.remindMe")}
                            </button>
                            <Lock className="size-4 text-gray-400/50 dark:text-gray-500/50" />
                            <span className="text-sm font-semibold text-gray-400/50 dark:text-gray-500/50">
                                {t("status.upcoming")}
                            </span>
                        </div>
                    )}

                    {/* Cancelled Status */}
                    {isCancelled && (
                        <span className="text-sm font-semibold text-error-500">
                            {t("status.cancelled")}
                        </span>
                    )}

                    {/* Teacher Actions - Attendance & Reviews for Completed */}
                    {isTeacher && isCompleted && !isCancelled && (
                        <div className="flex items-center gap-2 ml-3">
                            <button
                                onClick={() => setShowAttendanceModal(true)}
                                className="flex items-center gap-1.5 py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <Users className="size-4 text-gray-600 dark:text-gray-400" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t("session.attendance")}
                                </span>
                            </button>
                            <button
                                onClick={() => setShowReviewsModal(true)}
                                className="flex items-center gap-1.5 py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <Star className="size-4 text-gray-600 dark:text-gray-400" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t("session.reviews")}
                                </span>
                            </button>
                        </div>
                    )}

                    {/* Student Rate Session for Completed */}
                    {isStudent && isCompleted && !isCancelled && (
                        <button
                            onClick={() => setShowRatingModal(true)}
                            className="flex items-center gap-1.5 py-2 px-3 rounded-lg border-2 border-brand-500 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors ml-3"
                        >
                            <Star className="size-4" />
                            <span className="text-sm font-semibold">
                                {t("session.rateSession")}
                            </span>
                        </button>
                    )}
                </div>
            </div>

            {/* Modals */}
            <AttendanceModal
                isOpen={showAttendanceModal}
                onClose={() => setShowAttendanceModal(false)}
                sessionId={session.id}
                sessionTopic={session.lesson.title}
            />

            <ReviewsModal
                isOpen={showReviewsModal}
                onClose={() => setShowReviewsModal(false)}
                reviews={[]} // TODO: Get reviews from API
                sessionTopic={session.lesson.title}
            />

            <RatingModal
                isOpen={showRatingModal}
                onClose={() => setShowRatingModal(false)}
                onSubmit={handleSubmitReview}
                initialRating={currentRating}
                initialComment={existingReview?.comment}
                isSubmitting={isSubmitting}
            />
        </>
    );
}

export default VirtualSessionItem;
