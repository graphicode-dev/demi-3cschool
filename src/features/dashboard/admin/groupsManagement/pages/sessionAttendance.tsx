/**
 * Session Attendance Details Page
 *
 * Detailed attendance management for a specific session.
 * Features session summary, instructor attendance, and student attendance table.
 */

import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { History, Check, X } from "lucide-react";
import PageWrapper from "@/design-system/components/PageWrapper";
import { DynamicTable } from "@/design-system/components/table";
import { ConfirmDialog } from "@/design-system/components/ConfirmDialog";
import type { TableColumn, TableData } from "@/shared/types/table.types";
import type { AttendanceStatus } from "../types/attendance.types";
import {
    useStudentAttendanceQuery,
    useTeacherAttendanceQuery,
    useUpdateStudentAttendanceMutation,
} from "../api";

// Status badge component
const StatusBadge: React.FC<{ status: string; size?: "sm" | "md" }> = ({
    status,
    size = "md",
}) => {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case "present":
                return {
                    label: "Present",
                    className: "bg-green-100 text-green-700 border-green-200",
                };
            case "absent":
                return {
                    label: "Absent",
                    className: "bg-red-100 text-red-700 border-red-200",
                };
            case "completed":
                return {
                    label: "Completed",
                    className: "bg-green-100 text-green-700 border-green-200",
                };
            default:
                return {
                    label: status,
                    className: "bg-gray-100 text-gray-700 border-gray-200",
                };
        }
    };

    const config = getStatusConfig(status);
    const sizeClasses =
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

    return (
        <span
            className={`inline-flex items-center rounded-full font-medium border ${config.className} ${sizeClasses}`}
        >
            {config.label}
        </span>
    );
};

export const SessionAttendancePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const {
        gradeId,
        levelId,
        id: groupId,
        sessionId,
    } = useParams<{
        gradeId: string;
        levelId: string;
        id: string;
        sessionId: string;
    }>();

    const [hasChanges, setHasChanges] = useState(false);

    // Fetch student attendance data
    const { data: studentAttendanceData, isLoading: isLoadingStudents } =
        useStudentAttendanceQuery(sessionId || "", {
            enabled: !!sessionId,
        });

    // Fetch teacher attendance data
    const { data: teacherAttendanceData, isLoading: isLoadingTeachers } =
        useTeacherAttendanceQuery(sessionId || "", {
            enabled: !!sessionId,
        });

    // Mutation for updating student attendance
    const updateStudentAttendance = useUpdateStudentAttendanceMutation();

    // Get session info from teacher attendance
    const sessionInfo = useMemo(() => {
        const firstTeacher = teacherAttendanceData?.[0];
        const session = firstTeacher?.groupSession;

        return {
            sessionName: "Control Flow: If Statements",
            group: "Python Beginners",
            date: session?.sessionDate || "-",
            startTime: session?.startTime || "-",
            endTime: session?.endTime || "-",
            status: "completed",
        };
    }, [teacherAttendanceData]);

    // Get instructor info
    const instructorInfo = useMemo(() => {
        const firstTeacher = teacherAttendanceData?.[0];
        return {
            name: firstTeacher?.teacher.name || "Sarah Johnson",
            role: "Primary Instructor",
            status: firstTeacher?.status || "present",
        };
    }, [teacherAttendanceData]);

    // Calculate attendance stats
    const attendanceStats = useMemo(() => {
        const total = studentAttendanceData?.length || 0;
        const present =
            studentAttendanceData?.filter((s) => s.status === "present")
                .length || 0;
        const absent = total - present;
        return { present, absent, total };
    }, [studentAttendanceData]);

    // Handle status update
    const handleStatusUpdate = async (
        studentId: string,
        newStatus: AttendanceStatus
    ) => {
        if (!sessionId) return;

        const student = studentAttendanceData?.find(
            (s) => String(s.id) === studentId
        );
        if (!student) return;

        await updateStudentAttendance.mutateAsync({
            sessionId,
            data: {
                attendances: [
                    {
                        student_id: student.student.id,
                        status: newStatus,
                        note: student.note,
                    },
                ],
            },
        });
        setHasChanges(true);
    };

    // Mark all present/absent
    const handleMarkAll = async (status: AttendanceStatus) => {
        if (!sessionId || !studentAttendanceData) return;

        await updateStudentAttendance.mutateAsync({
            sessionId,
            data: {
                attendances: studentAttendanceData.map((s) => ({
                    student_id: s.student.id,
                    status,
                    note: s.note,
                })),
            },
        });
        setHasChanges(true);
    };

    // Convert student data to table format
    const tableData: TableData[] = useMemo(() => {
        if (!studentAttendanceData) return [];

        return studentAttendanceData.map((record, index) => ({
            id: String(record.id),
            columns: {
                index: index + 1,
                studentName: record.student.name,
                status: record.status,
                studentId: record.student.id,
            },
        }));
    }, [studentAttendanceData]);

    // Table columns
    const columns: TableColumn[] = [
        {
            id: "id",
            header: "ID",
            accessorKey: "index",
            sortable: true,
            cell: ({ row }: { row: TableData }) => (
                <span className="text-gray-500 dark:text-gray-400">
                    {row.columns.index}
                </span>
            ),
        },
        {
            id: "studentName",
            header: t("attendance.studentName", "Student Name"),
            accessorKey: "studentName",
            sortable: true,
            cell: ({ row }: { row: TableData }) => (
                <span className="font-medium text-gray-900 dark:text-white">
                    {row.columns.studentName}
                </span>
            ),
        },
        {
            id: "status",
            header: t("attendance.attendanceStatus", "ATTENDANCE STATUS"),
            accessorKey: "status",
            sortable: true,
            cell: ({ row }: { row: TableData }) => (
                <StatusBadge status={row.columns.status as string} size="sm" />
            ),
        },
        {
            id: "actions",
            header: t("common.action", "Action"),
            accessorKey: "actions",
            sortable: false,
            cell: ({ row }: { row: TableData }) => {
                const isPresent = row.columns.status === "present";
                return (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() =>
                                handleStatusUpdate(row.id, "present")
                            }
                            className={`p-1.5 rounded-lg border transition-colors ${
                                isPresent
                                    ? "bg-green-50 border-green-500 text-green-600"
                                    : "bg-white border-gray-200 text-gray-400 hover:border-green-300 hover:text-green-500"
                            }`}
                            title={t("attendance.markPresent", "Mark Present")}
                        >
                            <Check className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleStatusUpdate(row.id, "absent")}
                            className={`p-1.5 rounded-lg border transition-colors ${
                                !isPresent
                                    ? "bg-red-50 border-red-500 text-red-600"
                                    : "bg-white border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500"
                            }`}
                            title={t("attendance.markAbsent", "Mark Absent")}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                );
            },
        },
    ];

    const isLoading = isLoadingStudents || isLoadingTeachers;

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t(
                    "attendance.sessionDetails",
                    "Session Attendance Details"
                ),
                subtitle: t(
                    "attendance.sessionDetailsSubtitle",
                    "Review and manage attendance for this scheduled session."
                ),
                backButton: true,
                actions: (
                    <button
                        onClick={() =>
                            navigate(
                                `/admin/groups/grades/${gradeId}/levels/${levelId}/group/${groupId}/attendance/audit-log`
                            )
                        }
                        className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        <History className="w-5 h-5" />
                        {t("attendance.auditLog", "Audit Log")}
                    </button>
                ),
            }}
        >
            <div className="space-y-6">
                {/* Session Summary Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                        {t("attendance.sessionSummary", "Session Summary")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                {t("attendance.session", "Session")}
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center text-brand-600 dark:text-brand-400 text-sm font-bold">
                                    03
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {sessionInfo.sessionName}
                                </span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                {t("attendance.group", "Group")}
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-900 dark:text-white">
                                    🐍 {sessionInfo.group}
                                </span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                {t("attendance.dateTime", "Date & Time")}
                            </p>
                            <div className="text-gray-900 dark:text-white">
                                <div>📅 {sessionInfo.date}</div>
                                <div className="text-sm text-gray-500">
                                    🕐 {sessionInfo.startTime} -{" "}
                                    {sessionInfo.endTime}
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                {t("attendance.status", "Status")}
                            </p>
                            <StatusBadge status={sessionInfo.status} />
                        </div>
                    </div>
                </div>

                {/* Instructor Attendance Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                            {t(
                                "attendance.instructorAttendance",
                                "Instructor Attendance"
                            )}
                        </h3>
                        <button className="text-sm text-brand-500 hover:text-brand-600">
                            {t("attendance.changeStatus", "Change status")}
                        </button>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center text-brand-600 dark:text-brand-400 font-semibold">
                            {instructorInfo.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {instructorInfo.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {instructorInfo.role}
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {t(
                                    "attendance.currentStatus",
                                    "Current Status"
                                )}
                            </span>
                            <StatusBadge status={instructorInfo.status} />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 flex items-center gap-1">
                        <span className="text-blue-500">ℹ️</span>
                        {t(
                            "attendance.instructorNote",
                            "Instructor presence is verified by system defaults. Manual override is recorded in the audit log."
                        )}
                    </p>
                </div>

                {/* Student Attendance Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                {t(
                                    "attendance.studentAttendance",
                                    "Student Attendance"
                                )}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                <span className="text-green-600">
                                    Present: {attendanceStats.present}
                                </span>
                                {" | "}
                                <span className="text-red-600">
                                    Absent: {attendanceStats.absent}
                                </span>
                                {" | "}
                                Total: {attendanceStats.total}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleMarkAll("present")}
                                className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                            >
                                {t(
                                    "attendance.markAllPresent",
                                    "Mark All Present"
                                )}
                            </button>
                            <button
                                onClick={() => handleMarkAll("absent")}
                                className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                {t(
                                    "attendance.markAllAbsent",
                                    "Mark All Absent"
                                )}
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
                        </div>
                    ) : (
                        <DynamicTable
                            data={tableData}
                            columns={columns}
                            noPadding
                            disableRowClick
                        />
                    )}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                        {t("attendance.backToAttendance", "Back to Attendance")}
                    </button>
                    <button
                        disabled={!hasChanges}
                        className="px-6 py-2 text-sm font-medium text-white bg-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {t("common.saveChanges", "Save Changes")}
                    </button>
                </div>
            </div>
        </PageWrapper>
    );
};

export default SessionAttendancePage;
