/**
 * GradesList Page for Groups
 *
 * Displays available grades as navigation cards.
 * Each card navigates to the levels selection page for that grade.
 * Fetches grades from the API using useGrades hook.
 */

import { useTranslation } from "react-i18next";
import { PageWrapper, LoadingState, ErrorState } from "@/design-system";
import { useGrades } from "@/features/dashboard/admin/systemManagements/api/systemManagement.queries";
import {
    NavigationCard,
    CardGrid,
} from "@/features/dashboard/admin/learning/pages/grades/components";

/**
 * Grade icon component
 */
function GradeIcon({ gradeCode }: { gradeCode: string }) {
    const gradeNumber = gradeCode.replace("grade_", "");
    return (
        <div className="relative">
            <svg
                className="w-8 h-8 text-brand-600 dark:text-brand-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
            </svg>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-brand-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {gradeNumber}
            </span>
        </div>
    );
}

/**
 * Get icon background color based on grade index
 */
function getIconBg(index: number): string {
    const colors = [
        "bg-blue-100 dark:bg-blue-900/30",
        "bg-purple-100 dark:bg-purple-900/30",
        "bg-emerald-100 dark:bg-emerald-900/30",
        "bg-amber-100 dark:bg-amber-900/30",
        "bg-rose-100 dark:bg-rose-900/30",
    ];
    return colors[index % colors.length];
}

/**
 * GradesList page component for Groups
 */
export default function GroupsGradesList() {
    const { t } = useTranslation();
    const { data: gradesData, isLoading, error, refetch } = useGrades();
    const grades = gradesData?.items ?? [];

    if (isLoading) {
        return <LoadingState message={t("common.loading", "Loading...")} />;
    }

    if (error) {
        return (
            <ErrorState
                message={
                    error.message ||
                    t("errors.fetchFailed", "Failed to load grades")
                }
                onRetry={refetch}
            />
        );
    }

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t(
                    "groupsManagement:groups.grades.title",
                    "Groups by Grade"
                ),
                subtitle: t(
                    "groupsManagement:groups.grades.subtitle",
                    "Select a grade to manage its groups"
                ),
            }}
        >
            <CardGrid columns={3}>
                {grades?.map((grade, index) => (
                    <NavigationCard
                        key={grade.id}
                        title={grade.name}
                        description={t(
                            "groupsManagement:groups.grades.cardDescription",
                            {
                                gradeName: grade.name,
                                defaultValue: `Manage groups for ${grade.name} students`,
                            }
                        )}
                        href={`/admin/groups/grades/${grade.id}/levels`}
                        icon={<GradeIcon gradeCode={grade.code} />}
                        iconBg={getIconBg(index)}
                        testId={`groups-grade-card-${grade.id}`}
                    />
                ))}
            </CardGrid>
        </PageWrapper>
    );
}
