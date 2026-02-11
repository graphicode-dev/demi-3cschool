/**
 * Current Session Details Component
 *
 * Displays current session information including date, time,
 * total students, and instructor details.
 */

import React from "react";
import { useTranslation } from "react-i18next";
import type { CurrentSession } from "../types/attendance.types";

interface CurrentSessionDetailsProps {
    session: CurrentSession;
    loading?: boolean;
    className?: string;
}

interface SessionDetailItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: "blue" | "green" | "yellow" | "purple";
    loading?: boolean;
}

const SessionDetailItem: React.FC<SessionDetailItemProps> = ({
    icon,
    label,
    value,
    color,
    loading = false,
}) => {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
        green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
        yellow: "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
        purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    };

    if (loading) {
        return (
            <div className="flex items-center space-x-3 p-3">
                <div className="animate-pulse">
                    <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="flex-1">
                    <div className="animate-pulse">
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                        <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-3 p-3">
            <div className={`shrink-0 p-4 rounded-2xl ${colorClasses[color]}`}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {label}
                </p>
                <p className="text-lg font-medium text-gray-900 dark:text-white truncate">
                    {value}
                </p>
            </div>
        </div>
    );
};

// Icon components
const CalendarIcon: React.FC = () => (
    <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
    </svg>
);

const ClockIcon: React.FC = () => (
    <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
    </svg>
);

const UsersIcon: React.FC = () => (
    <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
    </svg>
);

const GraduationCapIcon: React.FC = () => (
    <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 14l9-5-9-5-9 5 9 5z"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
        />
    </svg>
);

export const CurrentSessionDetails: React.FC<CurrentSessionDetailsProps> = ({
    session,
    loading = false,
    className = "",
}) => {
    const { t } = useTranslation("groupsManagement");

    // Format date for display
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        } catch {
            return dateString;
        }
    };

    // Format time range
    const formatTimeRange = (startTime: string, endTime: string) => {
        try {
            const start = new Date(`1970-01-01T${startTime}`);
            const end = new Date(`1970-01-01T${endTime}`);

            const startTimeFormatted = start.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });

            const endTimeFormatted = end.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });

            return `${startTimeFormatted} - ${endTimeFormatted}`;
        } catch {
            return `${startTime} - ${endTime}`;
        }
    };

    return (
        <div
            className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
        >
            <div className="px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t("attendance.currentSession", "Current Session")}
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 space-y-1">
                <SessionDetailItem
                    icon={<CalendarIcon />}
                    label={t("attendance.sessionDate", "Session Date")}
                    value={formatDate(session.date)}
                    color="blue"
                    loading={loading}
                />

                <SessionDetailItem
                    icon={<ClockIcon />}
                    label={t("attendance.time", "Time")}
                    value={formatTimeRange(session.startTime, session.endTime)}
                    color="yellow"
                    loading={loading}
                />

                <SessionDetailItem
                    icon={<UsersIcon />}
                    label={t("attendance.totalStudents", "Total Students")}
                    value={`${session.totalEnrolled} ${t("attendance.enrolled", "enrolled")}`}
                    color="green"
                    loading={loading}
                />

                <SessionDetailItem
                    icon={<GraduationCapIcon />}
                    label={t("attendance.instructor", "Instructor")}
                    value={session.instructor.name}
                    color="purple"
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default CurrentSessionDetails;
