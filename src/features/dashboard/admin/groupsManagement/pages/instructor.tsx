/**
 * Regular Group Instructor Page
 *
 * Complete instructor management page for regular groups.
 * Features summary cards, primary teacher details, and sessions table.
 */

import { useNavigate, useParams } from "react-router-dom";
import { InstructorSummaryCards } from "../components/InstructorSummaryCards";
import { PrimaryTeacherCard } from "../components/PrimaryTeacherCard";
import { InstructorSessionsTable } from "../components/InstructorSessionsTable";
import type {
    InstructorSummary,
    InstructorSession,
} from "../types/instructor.types";
import PageWrapper from "@/design-system/components/PageWrapper";
import { useTranslation } from "react-i18next";
import { useGroup } from "../api";
import { ErrorState, LoadingState } from "@/design-system";
import { paths } from "@/router";

export const InstructorPage = () => {
    const { t } = useTranslation("groupsManagement");
    const navigate = useNavigate();
    const {
        gradeId,
        levelId,
        id: groupId,
    } = useParams<{
        gradeId: string;
        levelId: string;
        id: string;
    }>();

    const {
        data: groupData,
        isLoading: groupLoading,
        error: groupError,
        refetch: refetchGroup,
    } = useGroup(groupId);

    // Handle change primary teacher - navigate to teacher selection page
    const handleChangeTeacher = () => {
        navigate(
            paths.dashboard.groupsManagement.regularAssignTeacher(
                gradeId,
                levelId,
                groupId
            )
        );
    };

    // Generate mock data for development (sessions and summary)
    const displaySummary: InstructorSummary = {
        totalStudents: 6,
        totalGroups: 18,
        totalSessions: 5,
        teachingHours: 12.5,
        averageRating: 4.8,
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

    if (groupError) {
        return (
            <ErrorState
                message={
                    groupError.message ||
                    t("errors.fetchFailed", "Failed to load data")
                }
                onRetry={refetchGroup}
            />
        );
    }

    if (groupLoading) {
        return <LoadingState />;
    }

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("instructor.title", "Teacher Session Management"),
                subtitle: t(
                    "instructor.subtitle",
                    "View and manage all sessions with the teacher"
                ),
                backButton: true,
            }}
        >
            <div className="space-y-6">
                {/* Primary Teacher Card */}
                <PrimaryTeacherCard
                    primaryTeacher={
                        groupData?.primaryTeacher as {
                            id: number;
                            name: string;
                        } | null
                    }
                    loading={groupLoading}
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
