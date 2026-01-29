/**
 * Regular Group Instructor Page
 *
 * Complete instructor management page for regular groups.
 * Features summary cards, primary teacher details, and sessions table.
 */

import { useNavigate } from "react-router-dom";
import { InstructorSummaryCards } from "../../components/InstructorSummaryCards";
import { PrimaryTeacherCard } from "../../components/PrimaryTeacherCard";
import { InstructorSessionsTable } from "../../components/InstructorSessionsTable";
import type {
    Instructor,
    InstructorSummary,
    InstructorSession,
} from "../../types/instructor.types";
import PageWrapper from "@/design-system/components/PageWrapper";
import { useTranslation } from "react-i18next";

export const InstructorPage = () => {
    const { t } = useTranslation("groupsManagement");

    // Handle change primary teacher
    const handleChangeTeacher = () => {
        // TODO: Implement change teacher functionality
        console.log("Change primary teacher clicked");
    };

    // Generate mock data for development
    const displaySummary: InstructorSummary = {
        totalStudents: 6,
        totalGroups: 18,
        totalSessions: 5,
        teachingHours: 12.5,
        averageRating: 4.8,
    };

    const displayInstructor: Instructor = {
        id: "instructor-1",
        name: "Teacher #3",
        role: "Primary Instructor",
        assignedSince: "March 15, 2025",
    };

    const displaySessions: InstructorSession[] = [
        {
            id: "session-1",
            sessionName: "Web Development",
            date: "Jan 15, 2026",
            time: "14:32",
            group: "Beginner Coding",
            currentTeacher: "Teacher #3",
        },
        {
            id: "session-2",
            sessionName: "Web Development",
            date: "Jan 15, 2026",
            time: "14:32",
            group: "Intermediate Coding",
            currentTeacher: "Teacher #3",
        },
        {
            id: "session-3",
            sessionName: "Web Development",
            date: "Jan 15, 2026",
            time: "14:32",
            group: "Intermediate Coding",
            currentTeacher: "Teacher #3",
        },
    ];

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("Teacher Session Management"),
                subtitle: t("View and manage all sessions with the teacher"),
                backButton: true,
            }}
        >
            <div className="space-y-6">
                {/* Primary Teacher Card */}
                <PrimaryTeacherCard
                    instructor={displayInstructor}
                    loading={false}
                    onChangeTeacher={handleChangeTeacher}
                />

                {/* Instructor Summary Cards */}
                <InstructorSummaryCards
                    summary={displaySummary}
                    loading={false}
                />

                {/* Sessions Table */}
                <div>
                    <InstructorSessionsTable
                        sessions={displaySessions}
                        loading={false}
                    />
                </div>
            </div>
        </PageWrapper>
    );
};

export default InstructorPage;
