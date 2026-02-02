/**
 * TermsList Page
 *
 * Displays available terms (First Term, Second Term, Summer Camp) for a specific grade.
 * Each card navigates to the lessons list for that grade+term combination.
 * Fetches levels by grade from the API to show term availability.
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import PageWrapper from "@/design-system/components/PageWrapper";
import { LoadingState, ErrorState } from "@/design-system";
import { useLevelsByGrade } from "../../levels";
import { NavigationCard, CardGrid } from "../components";

/**
 * Term icon components
 */
function FirstTermIcon() {
    return (
        <svg
            className="w-8 h-8 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
        </svg>
    );
}

function SecondTermIcon() {
    return (
        <svg
            className="w-8 h-8 text-purple-600 dark:text-purple-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
        </svg>
    );
}

function SummerCampIcon() {
    return (
        <svg
            className="w-8 h-8 text-amber-600 dark:text-amber-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
        </svg>
    );
}

/**
 * Term configuration with icons and styling
 */
const TERM_CONFIG: Record<
    string,
    {
        key: string;
        icon: React.ComponentType;
        iconBg: string;
    }
> = {
    first_term: {
        key: "firstTerm",
        icon: FirstTermIcon,
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
    },
    second_term: {
        key: "secondTerm",
        icon: SecondTermIcon,
        iconBg: "bg-purple-100 dark:bg-purple-900/30",
    },
    summer_camp: {
        key: "summerCamp",
        icon: SummerCampIcon,
        iconBg: "bg-amber-100 dark:bg-amber-900/30",
    },
};

/**
 * TermsList page component
 */
export default function TermsList() {
    const { t } = useTranslation();
    const { gradeId } = useParams<{ gradeId: string }>();

    const {
        data: levelsData,
        isLoading,
        error,
        refetch,
    } = useLevelsByGrade(gradeId);

    const levels = levelsData?.items ?? [];

    // Group levels by programsCurriculum (term)
    const termStats = useMemo(() => {
        if (levels.length === 0) return {};

        const stats: Record<string, { count: number; gradeName: string }> = {};
        levels.forEach((level) => {
            const termName = level.programsCurriculum.name;
            if (!stats[termName]) {
                stats[termName] = { count: 0, gradeName: level.grade.name };
            }
            stats[termName].count++;
        });
        return stats;
    }, [levels]);

    // Get grade name from first level
    const gradeName = levels[0]?.grade?.name || `Grade ${gradeId}`;

    // Available terms based on API data
    const availableTerms = useMemo(() => {
        const termNames = Object.keys(termStats);
        // If no data yet, show all terms
        if (termNames.length === 0) {
            return ["first_term", "second_term", "summer_camp"];
        }
        return termNames;
    }, [termStats]);

    if (isLoading) {
        return <LoadingState message={t("common.loading", "Loading...")} />;
    }

    if (error) {
        return (
            <ErrorState
                message={
                    error.message ||
                    t("errors.fetchFailed", "Failed to load terms")
                }
                onRetry={refetch}
            />
        );
    }

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("learning:terms.title", "Select Term"),
                subtitle: t(
                    "learning:terms.subtitle",
                    `Choose a term to view lessons for ${gradeName}`
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
                {availableTerms.map((termId) => {
                    const config = TERM_CONFIG[termId];
                    if (!config) return null;

                    const IconComponent = config.icon;
                    return (
                        <NavigationCard
                            key={termId}
                            title={t(
                                `learning:terms.items.${config.key}.title`,
                                config.key
                            )}
                            description={t(
                                `learning:terms.items.${config.key}.description`,
                                `View ${config.key} lessons and content`
                            )}
                            href={`/admin/grades/${gradeId}/terms/${termId}/lessons`}
                            icon={<IconComponent />}
                            iconBg={config.iconBg}
                            testId={`term-card-${termId}`}
                        />
                    );
                })}
            </CardGrid>

            {/* Term Stats */}
            {Object.keys(termStats).length > 0 && (
                <div className="mt-8 p-6 bg-linear-to-r from-brand-50 to-purple-50 dark:from-brand-900/20 dark:to-purple-900/20 rounded-2xl border border-brand-100 dark:border-brand-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        {t("learning:terms.overview", "Term Overview")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {availableTerms.map((termId) => {
                            const config = TERM_CONFIG[termId];
                            if (!config) return null;

                            const stats = termStats[termId];
                            const IconComponent = config.icon;

                            return (
                                <div
                                    key={termId}
                                    className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl"
                                >
                                    <div
                                        className={`w-10 h-10 rounded-lg ${config.iconBg} flex items-center justify-center`}
                                    >
                                        <IconComponent />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {t(
                                                `learning:terms.items.${config.key}.title`,
                                                config.key
                                            )}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {stats?.count || 0}{" "}
                                            {t(
                                                "learning:terms.levels",
                                                "levels"
                                            )}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </PageWrapper>
    );
}
