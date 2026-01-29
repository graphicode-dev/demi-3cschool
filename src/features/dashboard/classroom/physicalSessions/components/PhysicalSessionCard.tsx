import { useTranslation } from "react-i18next";
import { Calendar, Clock, MapPin, Check, Lock } from "lucide-react";
import type { PhysicalSession } from "../types";

interface PhysicalSessionCardProps {
    session: PhysicalSession;
    variant?: "full" | "compact";
}

// Format time from "HH:mm:ss" to "HH:mm AM/PM"
function formatTime(time: string): string {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

// Format date from "YYYY-MM-DD" to "DD MMM YYYY"
function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export function PhysicalSessionCard({
    session,
    variant = "full",
}: PhysicalSessionCardProps) {
    const { t } = useTranslation("physicalSessions");

    const isCompleted = session.status === "completed";
    const isUpcoming = session.status === "upcoming";
    const isNext = session.status === "next";
    const isLocked = session.status === "locked";

    const orderNumber = String(session.order || 1).padStart(2, "0");

    const getBorderColor = () => {
        if (isCompleted) return "border-success-500";
        if (isUpcoming) return "border-brand-500";
        if (isNext) return "border-warning-500";
        return "border-gray-400";
    };

    const getStatusBadge = () => {
        if (isCompleted) {
            return (
                <div className="flex items-center gap-1.5 bg-success-50 dark:bg-success-500/10 text-success-500 px-3 py-1.5 rounded-full">
                    <Check className="size-4" strokeWidth={3} />
                    <span className="text-sm font-semibold">
                        {t("status.completed")}
                    </span>
                </div>
            );
        }
        if (isUpcoming) {
            return (
                <div className="flex items-center gap-1.5 bg-brand-50 dark:bg-brand-500/10 text-brand-500 px-3 py-1.5 rounded-full">
                    <span className="text-sm font-semibold">
                        {t("status.upcoming")}
                    </span>
                </div>
            );
        }
        if (isNext) {
            return (
                <div className="flex items-center gap-1.5 bg-warning-50 dark:bg-warning-500/10 text-warning-600 px-3 py-1.5 rounded-full">
                    <span className="text-sm font-semibold">
                        {t("status.nextUp")}
                    </span>
                </div>
            );
        }
        if (isLocked) {
            return (
                <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 text-gray-500 px-3 py-1.5 rounded-full">
                    <Lock className="size-4" />
                    <span className="text-sm font-semibold">
                        {t("status.locked")}
                    </span>
                </div>
            );
        }
        return null;
    };

    return (
        <div
            className={`
                bg-white dark:bg-gray-900 rounded-xl shadow-theme-sm
                border-t-4 ${getBorderColor()}
                ${isLocked ? "opacity-50" : ""}
                ${variant === "compact" ? "w-full md:w-[calc(50%-12px)]" : "w-full"}
            `}
        >
            {/* Header with Status Badge */}
            <div className="flex flex-col gap-3 p-4 pb-3">
                {/* Status Badge - Top Right */}
                <div className="flex justify-end">{getStatusBadge()}</div>

                {/* Session Info */}
                <div className="flex items-center gap-4">
                    {/* Order Circle */}
                    <div
                        className={`
                            flex items-center justify-center size-12 rounded-full shrink-0
                            ${isCompleted ? "bg-success-500" : ""}
                            ${isUpcoming ? "bg-brand-500" : ""}
                            ${isNext ? "bg-warning-500" : ""}
                            ${isLocked ? "bg-gray-200 dark:bg-gray-700" : ""}
                        `}
                    >
                        <span
                            className={`
                                text-lg font-bold
                                ${isLocked ? "text-gray-500" : "text-white"}
                            `}
                        >
                            {orderNumber}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {session.topic}
                    </h3>
                </div>
            </div>

            {/* Details Section */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl mx-3 mb-3 p-3 flex flex-col gap-2.5">
                {/* Date */}
                <div className="flex items-center gap-3">
                    <Calendar className="size-4 text-gray-400 shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(session.sessionDate)}
                    </span>
                </div>

                {/* Time */}
                <div className="flex items-center gap-3">
                    <Clock className="size-4 text-gray-400 shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatTime(session.startTime)} -{" "}
                        {formatTime(session.endTime)}
                    </span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3">
                    <MapPin className="size-4 text-error-500 shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                        {session.group.location}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default PhysicalSessionCard;
