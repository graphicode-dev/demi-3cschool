/**
 * Attendance Summary Cards Component
 *
 * Displays attendance statistics in card format with icons.
 * Shows total students, present count, absent count, and attendance rate.
 */

import React from "react";
import { useTranslation } from "react-i18next";
import type { AttendanceSummary } from "../types/attendance.types";

// Icon components moved outside of render function
const TotalStudentsIcon: React.FC = () => (
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

const PresentIcon: React.FC = () => (
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
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
    </svg>
);

const AbsentIcon: React.FC = () => (
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
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
    </svg>
);

const AttendanceRateIcon: React.FC = () => (
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
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
    </svg>
);

interface AttendanceSummaryCardsProps {
    summary: AttendanceSummary;
    loading?: boolean;
    className?: string;
}

interface SummaryCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: "blue" | "green" | "red" | "purple";
    loading?: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
    title,
    value,
    icon,
    color,
    loading = false,
}) => {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
        green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
        red: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
        purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-5">
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    {icon}
                </div>
                <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {title}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {value}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AttendanceSummaryCards: React.FC<AttendanceSummaryCardsProps> = ({
    summary,
    loading = false,
    className = "",
}) => {
    const { t } = useTranslation();

    return (
        <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}
        >
            <SummaryCard
                title={t("attendance.totalStudents", "Total Students")}
                value={summary.totalStudents}
                icon={<TotalStudentsIcon />}
                color="blue"
                loading={loading}
            />
            <SummaryCard
                title={t("attendance.present", "Present")}
                value={summary.presentCount}
                icon={<PresentIcon />}
                color="green"
                loading={loading}
            />
            <SummaryCard
                title={t("attendance.absent", "Absent")}
                value={summary.absentCount}
                icon={<AbsentIcon />}
                color="red"
                loading={loading}
            />
            <SummaryCard
                title={t("attendance.attendanceRate", "Attendance Rate")}
                value={`${summary.attendanceRate.toFixed(1)}%`}
                icon={<AttendanceRateIcon />}
                color="purple"
                loading={loading}
            />
        </div>
    );
};

export default AttendanceSummaryCards;
