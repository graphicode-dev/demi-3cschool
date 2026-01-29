import { useTranslation } from "react-i18next";
import { Monitor, Building2, Check, Lock, Play } from "lucide-react";
import type { CourseSession } from "../types";

interface SessionItemProps {
    session: CourseSession;
    onStart?: (sessionId: number) => void;
}

export function SessionItem({ session, onStart }: SessionItemProps) {
    const { t } = useTranslation("selfStudy");

    const isCompleted = session.status === "completed";
    const isCurrent = session.status === "current";
    const isLocked = session.status === "locked";
    const isOnline = session.type === "online";

    const orderNumber = String(session.order).padStart(2, "0");

    return (
        <div
            className={`
                flex items-center justify-between px-6 py-4 rounded-2xl
                ${isCurrent ? "bg-success-50 dark:bg-success-500/10 border border-success-500" : "bg-white dark:bg-gray-900 shadow-theme-sm"}
            `}
        >
            {/* Left Section */}
            <div className="flex items-center gap-6">
                {/* Order Number */}
                <span
                    className={`
                        text-xl font-bold w-8
                        ${isCompleted ? "text-success-500" : ""}
                        ${isCurrent ? "text-success-500" : ""}
                        ${isLocked ? "text-gray-400/50 dark:text-gray-500/50" : ""}
                    `}
                >
                    {orderNumber}
                </span>

                {/* Session Icon & Info */}
                <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div
                        className={`
                            size-6
                            ${isCompleted ? "text-success-500" : ""}
                            ${isCurrent ? "text-success-500" : ""}
                            ${isLocked ? "text-gray-400/50 dark:text-gray-500/50" : ""}
                        `}
                    >
                        {isOnline ? (
                            <Monitor className="size-full" />
                        ) : (
                            <Building2 className="size-full" />
                        )}
                    </div>

                    {/* Title & Type */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <h3
                                className={`
                                    text-base font-semibold
                                    ${isCompleted ? "text-gray-900/80 dark:text-white/80" : ""}
                                    ${isCurrent ? "text-gray-900/80 dark:text-white/80" : ""}
                                    ${isLocked ? "text-gray-900/80 dark:text-white/80" : ""}
                                `}
                            >
                                {session.title}
                            </h3>

                            {/* Offline Badge */}
                            {!isOnline && (
                                <span className="bg-warning-50 dark:bg-warning-500/10 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-lg text-xs font-semibold">
                                    {t("course.offline")}
                                </span>
                            )}
                        </div>

                        <p
                            className={`
                                text-xs capitalize
                                ${isCompleted ? "text-success-500" : ""}
                                ${isCurrent ? "text-success-500" : ""}
                                ${isLocked ? "text-gray-400/50 dark:text-gray-500/50" : ""}
                            `}
                        >
                            {isOnline
                                ? t("sessions.onlineSession")
                                : session.location
                                  ? t(`sessions.${session.location}`)
                                  : t("sessions.offlineSession")}
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Section - Status */}
            <div className="flex items-center gap-2">
                {isCompleted && (
                    <>
                        <Check
                            className="size-4 text-success-500"
                            strokeWidth={3}
                        />
                        <span className="text-sm font-semibold text-success-500">
                            {t("status.completed")}
                        </span>
                    </>
                )}

                {isCurrent && (
                    <button
                        onClick={() => onStart?.(session.id)}
                        className="flex items-center gap-1.5 bg-success-500 hover:bg-success-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                    >
                        <Play className="size-4" fill="currentColor" />
                        {t("status.start")}
                    </button>
                )}

                {isLocked && (
                    <>
                        <Lock className="size-4 text-gray-400/50 dark:text-gray-500/50" />
                        <span className="text-sm font-semibold text-gray-400/50 dark:text-gray-500/50">
                            {t("status.locked")}
                        </span>
                    </>
                )}
            </div>
        </div>
    );
}

export default SessionItem;
