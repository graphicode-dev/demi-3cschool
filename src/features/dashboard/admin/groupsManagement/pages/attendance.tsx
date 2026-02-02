/**
 * Regular Group Attendance Page
 *
 * Complete attendance management page for regular groups.
 * Features summary cards, current session info, and sessions table with View Details action.
 */

import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EmptyState } from "@/design-system/components/EmptyState";
import { AttendanceSummaryCards } from "../components/AttendanceSummaryCards";
import { CurrentSessionDetails } from "../components/CurrentSessionDetails";
import { DynamicTable } from "@/design-system/components/table";
import type { TableColumn, TableData } from "@/shared/types/table.types";
import type {
    AttendanceSummary,
    CurrentSession,
} from "../types/attendance.types";
import PageWrapper from "@/design-system/components/PageWrapper";
import { useTranslation } from "react-i18next";
import {
    useStudentAttendanceQuery,
    useTeacherAttendanceQuery,
    useSessionsListQuery,
} from "../api";
import { Users, CheckCircle, Clock, TrendingUp } from "lucide-react";

// Helper to format date for display
const formatDateForDisplay = (dateString: string): string => {
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

// Helper to format time for display
const formatTimeForDisplay = (timeString: string): string => {
    if (!timeString) return "--:--";
    try {
        const [hours, minutes] = timeString.split(":");
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    } catch {
        return timeString;
    }
};

// Status badge component for sessions table
const SessionStatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case "completed":
                return {
                    label: "Completed",
                    className:
                        "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
                };
            case "pending":
                return {
                    label: "Pending",
                    className:
                        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
                };
            case "upcoming":
                return {
                    label: "Upcoming",
                    className:
                        "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
                };
            default:
                return {
                    label: status,
                    className:
                        "bg-gray-100 text-gray-700 dark:bg-gray-800/20 dark:text-gray-400",
                };
        }
    };

    const config = getStatusConfig(status);

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
        >
            {config.label}
        </span>
    );
};

export const AttendancePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id: groupId } = useParams<{
        gradeId: string;
        levelId: string;
        id: string;
    }>();

    // Fetch sessions for this group
    const { data: sessionsData, isLoading: isLoadingSessions } =
        useSessionsListQuery(
            { group_id: groupId ? parseInt(groupId, 10) : undefined },
            { enabled: !!groupId }
        );

    // Extract sessions array from paginated response
    const sessions = useMemo(() => {
        if (!sessionsData) return [];
        const items =
            "items" in sessionsData ? sessionsData.items : sessionsData;
        return Array.isArray(items) ? items : [];
    }, [sessionsData]);

    // Get the first/current session for display
    const currentSession = sessions?.[0];
    const currentSessionId = currentSession ? String(currentSession.id) : null;

    // Fetch student attendance data for current session
    const { data: studentAttendanceData, isLoading: isLoadingStudents } =
        useStudentAttendanceQuery(currentSessionId || "", {
            enabled: !!currentSessionId,
        });

    // Fetch teacher attendance data (for session details)
    const { data: teacherAttendanceData, isLoading: isLoadingTeachers } =
        useTeacherAttendanceQuery(currentSessionId || "", {
            enabled: !!currentSessionId,
        });

    // Calculate summary from sessions data
    const displaySummary: AttendanceSummary = useMemo(() => {
        const totalSessions = sessions?.length || 0;
        const completedSessions =
            sessions?.filter((s) => {
                const sessionDate = new Date(s.sessionDate);
                return sessionDate < new Date();
            }).length || 0;
        const pendingSessions = totalSessions - completedSessions;

        // Calculate attendance rate from student data
        const totalStudents = studentAttendanceData?.length || 0;
        const presentCount =
            studentAttendanceData?.filter((s) => s.status === "present")
                .length || 0;
        const attendanceRate =
            totalStudents > 0 ? (presentCount / totalStudents) * 100 : 0;

        return {
            totalStudents: totalSessions,
            presentCount: completedSessions,
            absentCount: pendingSessions,
            attendanceRate,
        };
    }, [sessions, studentAttendanceData]);

    // Build current session details from teacher attendance data
    const displaySession: CurrentSession = useMemo(() => {
        const firstTeacher = teacherAttendanceData?.[0];
        const session = firstTeacher?.groupSession || currentSession;
        const totalStudents = studentAttendanceData?.length || 0;

        return {
            date: session?.sessionDate || "-",
            startTime: session?.startTime || "-",
            endTime: session?.endTime || "-",
            totalEnrolled: String(totalStudents),
            instructor: {
                name: firstTeacher?.teacher.name || "-",
            },
        };
    }, [teacherAttendanceData, currentSession, studentAttendanceData]);

    // Navigate to session details
    const handleViewDetails = (sessionId: string) => {
        navigate(`session/${sessionId}`);
    };

    // Convert sessions to table data
    const tableData: TableData[] = useMemo(() => {
        if (!sessions || sessions.length === 0) return [];

        return sessions.map((session, index) => {
            const sessionDate = new Date(session.sessionDate);
            const isPast = sessionDate < new Date();
            const status = isPast ? "completed" : "pending";

            return {
                id: String(session.id),
                columns: {
                    sessionName:
                        session.lesson?.title || `Session ${index + 1}`,
                    status,
                    sessionDate: session.sessionDate,
                    sessionTime: `${session.startTime}`,
                    instructor: session.lesson?.title || "-",
                    attendance: "18/18",
                },
            };
        });
    }, [sessions]);

    // Define table columns matching Figma design
    const columns: TableColumn[] = [
        {
            id: "sessionName",
            header: t("attendance.sessionName", "Session Name"),
            accessorKey: "sessionName",
            sortable: true,
            cell: ({ row }: { row: TableData }) => (
                <span className="font-medium text-gray-900 dark:text-white">
                    {row.columns.sessionName}
                </span>
            ),
        },
        {
            id: "status",
            header: t("attendance.status", "Status"),
            accessorKey: "status",
            sortable: true,
            cell: ({ row }: { row: TableData }) => (
                <SessionStatusBadge status={row.columns.status as string} />
            ),
        },
        {
            id: "sessionDate",
            header: t("attendance.sessionDate", "Session Date"),
            accessorKey: "sessionDate",
            sortable: true,
            cell: ({ row }: { row: TableData }) => (
                <div className="text-sm">
                    <div className="text-gray-900 dark:text-white">
                        {formatDateForDisplay(
                            row.columns.sessionDate as string
                        )}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                        {formatTimeForDisplay(
                            row.columns.sessionTime as string
                        )}
                    </div>
                </div>
            ),
        },
        {
            id: "instructor",
            header: t("attendance.instructor", "Instructor"),
            accessorKey: "instructor",
            sortable: true,
            cell: ({ row }: { row: TableData }) => (
                <span className="text-sm text-gray-900 dark:text-white">
                    {row.columns.instructor}
                </span>
            ),
        },
        {
            id: "attendance",
            header: t("attendance.attendance", "Attendance"),
            accessorKey: "attendance",
            sortable: true,
            cell: ({ row }: { row: TableData }) => (
                <div className="text-sm">
                    <span className="text-gray-900 dark:text-white">
                        {row.columns.attendance}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">
                        Student
                    </span>
                </div>
            ),
        },
        {
            id: "actions",
            header: t("common.action", "Action"),
            accessorKey: "actions",
            sortable: false,
            cell: ({ row }: { row: TableData }) => (
                <button
                    onClick={() => handleViewDetails(row.id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors"
                >
                    {t("attendance.viewDetails", "View Details")}
                </button>
            ),
        },
    ];

    const isLoading =
        isLoadingStudents || isLoadingTeachers || isLoadingSessions;

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("groups.attendance.title", "Attendance"),
                subtitle: t(
                    "groups.attendance.subtitle",
                    "Track and manage attendance for scheduled group sessions."
                ),
                backButton: true,
            }}
        >
            <div className="space-y-6">
                {/* Attendance Summary Cards */}
                <AttendanceSummaryCards
                    summary={displaySummary}
                    loading={isLoading}
                />

                {/* Current Session Details */}
                <CurrentSessionDetails
                    session={displaySession}
                    loading={isLoading}
                />

                {/* Attendance Details Table */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        {t(
                            "groups.attendance.attendanceDetails",
                            "Attendance Details"
                        )}
                    </h2>

                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
                        </div>
                    ) : tableData.length > 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <DynamicTable
                                data={tableData}
                                columns={columns}
                                hideToolbar
                                noPadding
                                disableRowClick
                            />
                        </div>
                    ) : (
                        <EmptyState
                            title={t(
                                "groups.attendance.noSessions",
                                "No sessions found"
                            )}
                            message={t(
                                "groups.attendance.noSessionsMessage",
                                "There are no sessions scheduled for this group yet."
                            )}
                        />
                    )}
                </div>
            </div>
        </PageWrapper>
    );
};

export default AttendancePage;
