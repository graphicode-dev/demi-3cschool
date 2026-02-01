/**
 * Attendance Summary Cards Component
 *
 * Displays attendance statistics in card format with icons.
 * Shows total sessions, completed, pending, and attendance rate.
 */

import React from "react";
import { useTranslation } from "react-i18next";
import { Users, CheckCircle, Clock, TrendingUp } from "lucide-react";
import type { AttendanceSummary } from "../types/attendance.types";

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
                title={t("attendance.totalSessions", "Total Sessions")}
                value={summary.totalStudents}
                icon={<Users className="w-5 h-5" />}
                color="blue"
                loading={loading}
            />
            <SummaryCard
                title={t("attendance.completed", "Completed")}
                value={summary.presentCount}
                icon={<CheckCircle className="w-5 h-5" />}
                color="green"
                loading={loading}
            />
            <SummaryCard
                title={t("attendance.pending", "Pending")}
                value={summary.absentCount}
                icon={<Clock className="w-5 h-5" />}
                color="red"
                loading={loading}
            />
            <SummaryCard
                title={t("attendance.attendanceRate", "Attendance Rate")}
                value={`${summary.attendanceRate.toFixed(1)}%`}
                icon={<TrendingUp className="w-5 h-5" />}
                color="purple"
                loading={loading}
            />
        </div>
    );
};

export default AttendanceSummaryCards;
