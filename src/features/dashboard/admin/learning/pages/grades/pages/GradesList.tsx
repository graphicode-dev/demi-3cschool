/**
 * GradesList Page
 *
 * Displays available grades as navigation cards.
 * Each card navigates to the terms selection page for that grade.
 * Fetches grades from the API using useGrades hook.
 */

import { useTranslation } from "react-i18next";
import { PageWrapper, LoadingState, ErrorState } from "@/design-system";
import { useGrades } from "@/features/dashboard/admin/systemManagements/api/systemManagement.queries";
import { NavigationCard, CardGrid } from "../components";

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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
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
 * GradesList page component
 */
export default function GradesList() {
    const { t } = useTranslation();
    const { data: grades, isLoading, error, refetch } = useGrades();

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
                title: t("learning:grades.title", "Grades"),
                subtitle: t(
                    "learning:grades.subtitle",
                    "Select a grade to view its learning content"
                ),
            }}
        >
            <CardGrid columns={3}>
                {grades?.items?.map((grade, index) => {
                    console.log(JSON.stringify(grade, null, 2));

                    return (
                        <NavigationCard
                            key={grade.id}
                            title={grade.name}
                            description={t(
                                "learning:grades.cardDescription",
                                `Explore learning content for ${grade.name} students`
                            )}
                            href={`/admin/grades/${grade.id}/levels`}
                            icon={<GradeIcon gradeCode={grade.code} />}
                            iconBg={getIconBg(index)}
                            testId={`grade-card-${grade.id}`}
                        />
                    );
                })}
            </CardGrid>
        </PageWrapper>
    );
}
