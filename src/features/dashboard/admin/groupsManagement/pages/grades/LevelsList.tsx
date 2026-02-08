/**
 * LevelsList Page for Groups
 *
 * Displays available levels for a specific grade.
 * Each card navigates to the groups list for that level.
 * Fetches levels by grade from the API.
 */

import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { PageWrapper, LoadingState, ErrorState, EmptyState } from "@/design-system";
import { useLevelsByGrade } from "@/features/dashboard/admin/learning/pages/levels";
import {
    NavigationCard,
    CardGrid,
} from "@/features/dashboard/admin/learning/pages/grades/components";

/**
 * Level icon component
 */
function LevelIcon({ index }: { index: number }) {
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
            </svg>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-brand-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {index + 1}
            </span>
        </div>
    );
}

/**
 * Get icon background color based on index
 */
function getIconBg(index: number): string {
    const colors = [
        "bg-blue-100 dark:bg-blue-900/30",
        "bg-purple-100 dark:bg-purple-900/30",
        "bg-emerald-100 dark:bg-emerald-900/30",
        "bg-amber-100 dark:bg-amber-900/30",
        "bg-rose-100 dark:bg-rose-900/30",
        "bg-cyan-100 dark:bg-cyan-900/30",
        "bg-indigo-100 dark:bg-indigo-900/30",
        "bg-teal-100 dark:bg-teal-900/30",
    ];
    return colors[index % colors.length];
}

/**
 * Get term display name
 */
function getTermDisplayName(
    termName: string,
    t: (key: string, fallback: string) => string
): string {
    const termMap: Record<string, string> = {
        first_term: t("learning:terms.items.firstTerm.title", "First Term"),
        second_term: t("learning:terms.items.secondTerm.title", "Second Term"),
        summer_camp: t("learning:terms.items.summerCamp.title", "Summer Camp"),
    };
    return termMap[termName] || termName;
}

/**
 * LevelsList page component for Groups
 */
export default function GroupsLevelsList() {
    const { t } = useTranslation();
    const { gradeId } = useParams<{ gradeId: string }>();

    const {
        data: levels,
        isLoading,
        error,
        refetch,
    } = useLevelsByGrade(gradeId);

    // Get grade name from first level
    const gradeName = levels?.items?.[0]?.grade?.name || `Grade ${gradeId}`;

    if (isLoading) {
        return <LoadingState message={t("common.loading", "Loading...")} />;
    }

    if (error) {
        return (
            <ErrorState
                message={
                    error.message ||
                    t("errors.fetchFailed", "Failed to load levels")
                }
                onRetry={refetch}
            />
        );
    }

    if (!levels || levels?.items?.length === 0) {
        return (
            <PageWrapper
                pageHeaderProps={{
                    title: t("groupsManagement:groups.levels.title", "Levels"),
                    subtitle: gradeName,
                    backButton: true,
                }}
            >
                <EmptyState
                    title={t(
                        "groupsManagement:groups.levels.empty.title",
                        "No levels found"
                    )}
                    message={t(
                        "groupsManagement:groups.levels.empty.description",
                        "No levels have been created for this grade yet"
                    )}
                />
            </PageWrapper>
        );
    }

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("groupsManagement:groups.levels.title", "Levels"),
                subtitle: t(
                    "groupsManagement:groups.levels.subtitle",
                    `Select a level to manage groups for ${gradeName}`
                ),
                backButton: true,
            }}
        >
            {/* Grade Badge */}
            <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
                    {gradeName}
                </span>
            </div>

            <CardGrid columns={3}>
                {levels.items.map((level, index) => (
                    <NavigationCard
                        key={level.id}
                        title={level.title}
                        description={`${getTermDisplayName(level.programsCurriculum.name, t)} • ${level.description || t("groupsManagement:groups.levels.viewGroups", "View groups")}`}
                        href={`/admin/groups/grades/${gradeId}/levels/${level.id}/group`}
                        icon={<LevelIcon index={index} />}
                        iconBg={getIconBg(index)}
                        testId={`groups-level-card-${level.id}`}
                    />
                ))}
            </CardGrid>

            {/* Levels Overview */}
            <div className="mt-8 p-6 bg-linear-to-r from-brand-50 to-purple-50 dark:from-brand-900/20 dark:to-purple-900/20 rounded-2xl border border-brand-100 dark:border-brand-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {t(
                        "groupsManagement:groups.levels.overview",
                        "Levels Overview"
                    )}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {levels?.items?.map((level, index) => (
                        <div
                            key={level.id}
                            className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl"
                        >
                            <div
                                className={`w-10 h-10 rounded-lg ${getIconBg(index)} flex items-center justify-center`}
                            >
                                <LevelIcon index={index} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {level.title}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {getTermDisplayName(
                                        level.programsCurriculum.name,
                                        t
                                    )}
                                </p>
                            </div>
                            <div className="ml-auto">
                                <span
                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                        level.isActive
                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                            : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400"
                                    }`}
                                >
                                    {level.isActive
                                        ? t("common.active", "Active")
                                        : t("common.inactive", "Inactive")}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PageWrapper>
    );
}
