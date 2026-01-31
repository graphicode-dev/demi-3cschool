/**
 * Regular Group Attendance Page
 *
 * Complete attendance management page for regular groups.
 * Features summary cards, session details, and student attendance table.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "@/design-system/components/EmptyState";
import { AttendanceSummaryCards } from "../components/AttendanceSummaryCards";
import { CurrentSessionDetails } from "../components/CurrentSessionDetails";
import { StudentAttendanceTable } from "../components/StudentAttendanceTable";
import type {
    AttendanceStatus,
    AttendanceSummary,
    CurrentSession,
    StudentAttendance,
} from "../types/attendance.types";
import PageWrapper from "@/design-system/components/PageWrapper";
import { useTranslation } from "react-i18next";

export const AttendancePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

    // Handle selection change
    const handleSelectionChange = (selectedIds: string[]) => {
        setSelectedStudentIds(selectedIds);
    };

    // Handle view student profile
    const handleViewProfile = (studentId: string) => {
        navigate(`/students/${studentId}`);
    };

    // Generate mock data for development if no data exists
    const displaySummary: AttendanceSummary = {
        totalStudents: 3,
        presentCount: 2,
        absentCount: 1,
        attendanceRate: 66.7,
    };

    const displaySession: CurrentSession = {
        date: "2026-01-15",
        startTime: "14:00",
        endTime: "15:30",
        totalEnrolled: "3",
        instructor: {
            name: "Teacher #3",
        },
    };

    const displayStudents: StudentAttendance[] = [
        {
            id: "student-1",
            studentAvatar: "",
            studentName: "Emma John",
            status: "present" as AttendanceStatus,
            attendanceDate: "Jan 15, 2026",
            attendanceTime: "14:32",
            primaryTeacher: {
                name: "Teacher #3",
            },
            selected: false,
        },
        {
            id: "student-2",
            studentName: "Michael Smith",
            studentAvatar: "",
            status: "present" as AttendanceStatus,
            attendanceDate: "Jan 15, 2026",
            attendanceTime: "14:28",
            primaryTeacher: {
                name: "Teacher #3",
            },
            selected: false,
        },
        {
            id: "student-3",
            studentName: "Sarah Johnson",
            studentAvatar: "",
            status: "absent" as AttendanceStatus,
            attendanceDate: "Jan 15, 2026",
            attendanceTime: "--:--",
            primaryTeacher: {
                name: "Teacher #3",
            },
            selected: false,
        },
    ];

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("groups.attendance.title", "Regular Group Attendance"),
                subtitle: t(
                    "groups.attendance.subtitle",
                    "Track and manage student attendance for the Regular group"
                ),
                backButton: true,
            }}
        >
            <div className="space-y-6">
                {/* Attendance Summary Cards */}
                <AttendanceSummaryCards
                    summary={displaySummary}
                    loading={false}
                />

                {/* Current Session Details */}
                <CurrentSessionDetails
                    session={displaySession}
                    loading={false}
                />

                {/* Student Attendance Table */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Student Attendance Details
                    </h2>
                    {displayStudents.length > 0 ? (
                        <StudentAttendanceTable
                            students={displayStudents}
                            loading={false}
                            onSelectionChange={handleSelectionChange}
                            onViewProfile={handleViewProfile}
                        />
                    ) : (
                        <EmptyState
                            title="No students found"
                            message="There are no students enrolled in this group or no attendance records for the current session."
                        />
                    )}
                </div>
            </div>
        </PageWrapper>
    );
};

export default AttendancePage;
