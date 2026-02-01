/**
 * Regular Group Attendance Page
 *
 * Complete attendance management page for regular groups.
 * Features summary cards, session details, and student attendance table.
 */

import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { EmptyState } from "@/design-system/components/EmptyState";
import { AttendanceSummaryCards } from "../components/AttendanceSummaryCards";
import { CurrentSessionDetails } from "../components/CurrentSessionDetails";
import { StudentAttendanceTable } from "../components/StudentAttendanceTable";
import type {
    AttendanceSummary,
    CurrentSession,
    StudentAttendance,
    AttendanceStatus,
} from "../types/attendance.types";
import PageWrapper from "@/design-system/components/PageWrapper";
import { useTranslation } from "react-i18next";
import {
    useStudentAttendanceQuery,
    useTeacherAttendanceQuery,
    useUpdateStudentAttendanceMutation,
    useSessionsListQuery,
} from "../api";

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

export const AttendancePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id: groupId } = useParams<{
        gradeId: string;
        levelId: string;
        id: string;
    }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const sessionIdFromUrl = searchParams.get("sessionId");
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
        sessionIdFromUrl
    );

    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

    // Fetch sessions for this group
    const { data: sessionsData, isLoading: isLoadingSessions } =
        useSessionsListQuery(
            { group_id: groupId ? parseInt(groupId, 10) : undefined },
            { enabled: !!groupId }
        );

    // Auto-select first session if none selected
    useEffect(() => {
        if (!selectedSessionId && sessionsData && sessionsData.length > 0) {
            const firstSessionId = String(sessionsData[0].id);
            setSelectedSessionId(firstSessionId);
            setSearchParams({ sessionId: firstSessionId });
        }
    }, [sessionsData, selectedSessionId, setSearchParams]);

    // Handle session selection change
    const handleSessionChange = (newSessionId: string) => {
        setSelectedSessionId(newSessionId);
        setSearchParams({ sessionId: newSessionId });
    };

    // Fetch student attendance data
    const {
        data: studentAttendanceData,
        isLoading: isLoadingStudents,
        isError: isStudentError,
    } = useStudentAttendanceQuery(selectedSessionId || "", {
        enabled: !!selectedSessionId,
    });

    // Fetch teacher attendance data (for session details)
    const { data: teacherAttendanceData, isLoading: isLoadingTeachers } =
        useTeacherAttendanceQuery(selectedSessionId || "", {
            enabled: !!selectedSessionId,
        });

    // Mutation for updating student attendance
    const updateStudentAttendance = useUpdateStudentAttendanceMutation();

    // Transform API data to component format
    const displayStudents: StudentAttendance[] = useMemo(() => {
        if (!studentAttendanceData) return [];

        return studentAttendanceData.map((record) => ({
            id: String(record.id),
            studentAvatar: "",
            studentName: record.student.name,
            status: record.status as AttendanceStatus,
            attendanceDate: formatDateForDisplay(record.createdAt),
            attendanceTime:
                record.status === "present"
                    ? formatTimeForDisplay(record.createdAt.split(" ")[1] || "")
                    : "--:--",
            primaryTeacher: {
                name: teacherAttendanceData?.[0]?.teacher.name || "-",
            },
            selected: selectedStudentIds.includes(String(record.id)),
        }));
    }, [studentAttendanceData, teacherAttendanceData, selectedStudentIds]);

    // Calculate summary from student data
    const displaySummary: AttendanceSummary = useMemo(() => {
        const total = displayStudents.length;
        const presentCount = displayStudents.filter(
            (s) => s.status === "present"
        ).length;
        const absentCount = displayStudents.filter(
            (s) => s.status === "absent"
        ).length;
        const attendanceRate = total > 0 ? (presentCount / total) * 100 : 0;

        return {
            totalStudents: total,
            presentCount,
            absentCount,
            attendanceRate,
        };
    }, [displayStudents]);

    // Build session details from teacher attendance data
    const displaySession: CurrentSession = useMemo(() => {
        const firstTeacher = teacherAttendanceData?.[0];
        const session = firstTeacher?.groupSession;

        return {
            date: session?.sessionDate || "-",
            startTime: session?.startTime || "-",
            endTime: session?.endTime || "-",
            totalEnrolled: String(displayStudents.length),
            instructor: {
                name: firstTeacher?.teacher.name || "-",
            },
        };
    }, [teacherAttendanceData, displayStudents.length]);

    // Handle selection change
    const handleSelectionChange = (selectedIds: string[]) => {
        setSelectedStudentIds(selectedIds);
    };

    // Handle status update - returns Promise for ConfirmDialog loading state
    const handleStatusUpdate = async (
        studentId: string,
        status: AttendanceStatus
    ): Promise<void> => {
        if (!selectedSessionId) return;

        const student = studentAttendanceData?.find(
            (s) => String(s.id) === studentId
        );
        if (!student) return;

        await updateStudentAttendance.mutateAsync({
            sessionId: selectedSessionId,
            data: {
                attendances: [
                    {
                        student_id: student.student.id,
                        status,
                        note: student.note,
                    },
                ],
            },
        });
    };

    const isLoading = isLoadingStudents || isLoadingTeachers;

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("groups.attendance.title", "Group Attendance"),
                subtitle: t(
                    "groups.attendance.subtitle",
                    "Track and manage student attendance for the Regular group"
                ),
                backButton: true,
            }}
        >
            <div className="space-y-6">
                {/* Session Selector */}
                {sessionsData && sessionsData.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t(
                                "groups.attendance.selectSession",
                                "Select Session"
                            )}
                        </label>
                        <select
                            value={selectedSessionId || ""}
                            onChange={(e) =>
                                handleSessionChange(e.target.value)
                            }
                            className="w-full md:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                        >
                            <option value="" disabled>
                                {t(
                                    "groups.attendance.chooseSession",
                                    "Choose a session..."
                                )}
                            </option>
                            {sessionsData.map((session) => (
                                <option
                                    key={session.id}
                                    value={String(session.id)}
                                >
                                    {session.sessionDate} -{" "}
                                    {session.lesson?.title || "Session"} (
                                    {session.startTime} - {session.endTime})
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* No Sessions Available Warning */}
                {!isLoadingSessions &&
                    (!sessionsData || sessionsData.length === 0) && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <p className="text-yellow-800 dark:text-yellow-200">
                                {t(
                                    "groups.attendance.noSessions",
                                    "No sessions found for this group."
                                )}
                            </p>
                        </div>
                    )}

                {/* No Session Selected Warning */}
                {sessionsData &&
                    sessionsData.length > 0 &&
                    !selectedSessionId && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <p className="text-yellow-800 dark:text-yellow-200">
                                {t(
                                    "groups.attendance.noSessionSelected",
                                    "No session selected. Please select a session to view attendance."
                                )}
                            </p>
                        </div>
                    )}

                {/* Error State */}
                {isStudentError && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <p className="text-red-800 dark:text-red-200">
                            {t(
                                "groups.attendance.loadError",
                                "Failed to load attendance data. Please try again."
                            )}
                        </p>
                    </div>
                )}

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

                {/* Student Attendance Table */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        {t(
                            "groups.attendance.studentDetails",
                            "Student Attendance Details"
                        )}
                    </h2>
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
                        </div>
                    ) : displayStudents.length > 0 ? (
                        <StudentAttendanceTable
                            students={displayStudents}
                            loading={isLoading}
                            onSelectionChange={handleSelectionChange}
                            onStatusUpdate={handleStatusUpdate}
                        />
                    ) : (
                        <EmptyState
                            title={t(
                                "groups.attendance.noStudents",
                                "No students found"
                            )}
                            message={t(
                                "groups.attendance.noStudentsMessage",
                                "There are no students enrolled in this group or no attendance records for the current session."
                            )}
                        />
                    )}
                </div>
            </div>
        </PageWrapper>
    );
};

export default AttendancePage;
