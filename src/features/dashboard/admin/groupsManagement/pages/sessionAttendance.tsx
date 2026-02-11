/**
 * Session Attendance Details Page
 *
 * Detailed attendance management for a specific session.
 * Features session summary, instructor attendance, and student attendance table.
 */

import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { History, Check, X, ChevronDown } from "lucide-react";
import { PageWrapper, DynamicTable } from "@/design-system";
import type { TableColumn, TableData } from "@/shared/types/table.types";
import type { AttendanceStatus } from "../types/attendance.types";
import {
    useStudentAttendanceQuery,
    useTeacherAttendanceQuery,
    useUpdateStudentAttendanceMutation,
    useUpdateTeacherAttendanceMutation,
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
    const [showTeacherStatusDropdown, setShowTeacherStatusDropdown] =
        useState(false);
    const [teacherNote, setTeacherNote] = useState("");
    const [selectedTeacherStatus, setSelectedTeacherStatus] =
        useState<AttendanceStatus | null>(null);
    const [studentNoteModal, setStudentNoteModal] = useState<{
        studentId: string;
        status: AttendanceStatus;
        note: string;
    } | null>(null);

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

    // Mutation for updating teacher attendance
    const updateTeacherAttendance = useUpdateTeacherAttendanceMutation();

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
            id: firstTeacher?.teacher.id || 0,
            name: firstTeacher?.teacher.name || "Sarah Johnson",
            role: "Primary Instructor",
            status: firstTeacher?.status || "present",
            minutesTaught: firstTeacher?.minutesTaught || 0,
            note: firstTeacher?.note || "",
        };
    }, [teacherAttendanceData]);

    // Teacher attendance status options
    const teacherStatusOptions: AttendanceStatus[] = [
        "present",
        "absent",
        "late",
        "cancelled",
    ];

    // Handle teacher status selection (shows note input)
    const handleTeacherStatusSelect = (status: AttendanceStatus) => {
        setSelectedTeacherStatus(status);
        setTeacherNote(instructorInfo.note);
    };

    // Handle teacher status update with note
    const handleTeacherStatusUpdate = async () => {
        if (!sessionId || !instructorInfo.id || !selectedTeacherStatus) return;

        await updateTeacherAttendance.mutateAsync({
            sessionId,
            data: {
                teacher_id: instructorInfo.id,
                status: selectedTeacherStatus,
                minutes_taught: instructorInfo.minutesTaught,
                note: teacherNote,
            },
        });
        setShowTeacherStatusDropdown(false);
        setSelectedTeacherStatus(null);
        setTeacherNote("");
        setHasChanges(true);
    };

    // Cancel teacher status change
    const handleCancelTeacherStatus = () => {
        setSelectedTeacherStatus(null);
        setTeacherNote("");
        setShowTeacherStatusDropdown(false);
    };

    // Calculate attendance stats
    const attendanceStats = useMemo(() => {
        const total = studentAttendanceData?.length || 0;
        const present =
            studentAttendanceData?.filter((s) => s.status === "present")
                .length || 0;
        const absent = total - present;
        return { present, absent, total };
    }, [studentAttendanceData]);

    // Handle status update - open note modal
    const handleStatusUpdate = (
        studentId: string,
        newStatus: AttendanceStatus
    ) => {
        const student = studentAttendanceData?.find(
            (s) => String(s.id) === studentId
        );
        if (!student) return;

        setStudentNoteModal({
            studentId,
            status: newStatus,
            note: student.note || "",
        });
    };

    // Confirm student status update with note
    const handleConfirmStudentStatus = async () => {
        if (!sessionId || !studentNoteModal) return;

        const student = studentAttendanceData?.find(
            (s) => String(s.id) === studentNoteModal.studentId
        );
        if (!student) return;

        await updateStudentAttendance.mutateAsync({
            sessionId,
            data: {
                attendances: [
                    {
                        student_id: student.student.id,
                        status: studentNoteModal.status,
                        note: studentNoteModal.note,
                    },
                ],
            },
        });
        setStudentNoteModal(null);
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
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setShowTeacherStatusDropdown(
                                        !showTeacherStatusDropdown
                                    )
                                }
                                className="flex items-center gap-1 text-sm text-brand-500 hover:text-brand-600"
                            >
                                {t("attendance.changeStatus", "Change status")}
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            {showTeacherStatusDropdown && (
                                <div className="absolute right-0 top-full mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 z-10">
                                    {!selectedTeacherStatus ? (
                                        <div className="space-y-1">
                                            {teacherStatusOptions.map(
                                                (status) => (
                                                    <button
                                                        key={status}
                                                        onClick={() =>
                                                            handleTeacherStatusSelect(
                                                                status
                                                            )
                                                        }
                                                        className={`w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 capitalize ${
                                                            instructorInfo.status ===
                                                            status
                                                                ? "text-brand-500 font-medium bg-brand-50 dark:bg-brand-900/20"
                                                                : "text-gray-700 dark:text-gray-300"
                                                        }`}
                                                    >
                                                        {t(
                                                            `attendance.status.${status}`,
                                                            status
                                                        )}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                                    {t(
                                                        `attendance.status.${selectedTeacherStatus}`,
                                                        selectedTeacherStatus
                                                    )}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        setSelectedTeacherStatus(
                                                            null
                                                        )
                                                    }
                                                    className="text-xs text-gray-500 hover:text-gray-700"
                                                >
                                                    {t(
                                                        "common.change",
                                                        "Change"
                                                    )}
                                                </button>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                    {t(
                                                        "attendance.note",
                                                        "Note"
                                                    )}{" "}
                                                    (
                                                    {t(
                                                        "common.optional",
                                                        "optional"
                                                    )}
                                                    )
                                                </label>
                                                <textarea
                                                    value={teacherNote}
                                                    onChange={(e) =>
                                                        setTeacherNote(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder={t(
                                                        "attendance.addNote",
                                                        "Add a note..."
                                                    )}
                                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                                                    rows={2}
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={
                                                        handleCancelTeacherStatus
                                                    }
                                                    className="flex-1 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                                                >
                                                    {t(
                                                        "common.cancel",
                                                        "Cancel"
                                                    )}
                                                </button>
                                                <button
                                                    onClick={
                                                        handleTeacherStatusUpdate
                                                    }
                                                    className="flex-1 px-3 py-1.5 text-sm text-white bg-brand-500 rounded-lg hover:bg-brand-600"
                                                >
                                                    {t("common.save", "Save")}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
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

            {/* Student Note Modal */}
            {studentNoteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setStudentNoteModal(null)}
                    />
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            {t(
                                "attendance.updateStatus",
                                "Update Attendance Status"
                            )}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t("attendance.status", "Status")}
                                </label>
                                <div className="flex items-center gap-2">
                                    <StatusBadge
                                        status={studentNoteModal.status}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t("attendance.note", "Note")} (
                                    {t("common.optional", "optional")})
                                </label>
                                <textarea
                                    value={studentNoteModal.note}
                                    onChange={(e) =>
                                        setStudentNoteModal({
                                            ...studentNoteModal,
                                            note: e.target.value,
                                        })
                                    }
                                    placeholder={t(
                                        "attendance.addNote",
                                        "Add a note..."
                                    )}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    rows={3}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mt-6">
                            <button
                                onClick={() => setStudentNoteModal(null)}
                                className="flex-1 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                {t("common.cancel", "Cancel")}
                            </button>
                            <button
                                onClick={handleConfirmStudentStatus}
                                className="flex-1 px-4 py-2 text-sm text-white bg-brand-500 rounded-lg hover:bg-brand-600"
                            >
                                {t("common.save", "Save")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </PageWrapper>
    );
};

export default SessionAttendancePage;
