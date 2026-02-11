/**
 * Attendance Tab Component
 */

import { useTranslation } from "react-i18next";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import type { AttendanceStats, AttendanceRecord } from "../types/profile.types";

interface AttendanceTabProps {
    stats: AttendanceStats;
    records: AttendanceRecord[];
}

function StatCard({
    icon,
    label,
    value,
    color,
}: {
    icon: React.ReactNode;
    label: string;
    value: number | string;
    color: string;
}) {
    return (
        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}
            >
                {icon}
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {label}
                </p>
            </div>
        </div>
    );
}

export default function AttendanceTab({ stats, records }: AttendanceTabProps) {
    const { t } = useTranslation("profile");

    const getStatusBadge = (status: AttendanceRecord["status"]) => {
        const styles = {
            present:
                "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
            absent: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
            late: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
        };
        return styles[status];
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="rounded-b-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    {t("profile.attendance.title", "Attendance")}
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                        icon={
                            <CheckCircle className="w-6 h-6 text-green-500" />
                        }
                        label={t("profile.attendance.present", "Present")}
                        value={stats.present}
                        color="bg-green-100 dark:bg-green-900/30"
                    />
                    <StatCard
                        icon={<XCircle className="w-6 h-6 text-red-500" />}
                        label={t("profile.attendance.absent", "Absent")}
                        value={stats.absent}
                        color="bg-red-100 dark:bg-red-900/30"
                    />
                    <StatCard
                        icon={<Clock className="w-6 h-6 text-orange-500" />}
                        label={t("profile.attendance.late", "Late")}
                        value={stats.late}
                        color="bg-orange-100 dark:bg-orange-900/30"
                    />
                    <StatCard
                        icon={
                            <span className="text-xl font-bold text-brand-500">
                                %
                            </span>
                        }
                        label={t(
                            "profile.attendance.attendanceRate",
                            "Attendance Rate"
                        )}
                        value={`${stats.attendanceRate}%`}
                        color="bg-brand-100 dark:bg-brand-900/30"
                    />
                </div>
            </div>

            {/* Attendance History Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                    {t("profile.attendance.history", "Attendance History")}
                </h3>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="text-start py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {t("profile.attendance.date", "Date")}
                                </th>
                                <th className="text-start py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {t("profile.attendance.lesson", "Lesson")}
                                </th>
                                <th className="text-start py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {t(
                                        "profile.attendance.instructor",
                                        "Instructor"
                                    )}
                                </th>
                                <th className="text-start py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {t("profile.attendance.status", "Status")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((record) => (
                                <tr
                                    key={record.id}
                                    className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                                >
                                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                                        {record.date}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                                        {record.lesson}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                                        {record.instructor}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(record.status)}`}
                                        >
                                            {t(
                                                `profile.attendance.${record.status}`,
                                                record.status
                                            )}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
