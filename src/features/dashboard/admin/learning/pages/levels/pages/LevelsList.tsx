/**
 * Learning - Levels List Page
 *
 * Shared component for both Standard and Professional Learning levels.
 * The curriculum type is determined from the URL path.
 * Displays levels grouped by course.
 *
 * Fetching logic:
 * - No courseId in URL: don't fetch levels (show empty state to select course)
 * - courseId=all in URL: fetch all levels grouped by course
 * - courseId=<id> in URL: fetch levels for that specific course grouped
 */

import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

import {
    LoadingState,
    ErrorState,
    EmptyState,
    useConfirmDialog,
} from "@/design-system";
import { CourseFilterDropdown, LevelListItem } from "../components";
import { learningPaths } from "@/features/dashboard/admin/learning/navigation/paths";
import { useCoursesByProgram } from "../../courses";
import {
    Level,
    useDeleteLevel,
    useLevelsByCourse,
    useLevelsList,
} from "../api";
import PageWrapper from "@/design-system/components/PageWrapper";
import { useCurriculumType } from "../../../hooks";

export default function LearningLevelsList() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const curriculumType = useCurriculumType();

    // Get courseId from URL - this drives the fetching logic
    // null or "all" = fetch all levels, <id> = fetch by specific course
    const courseIdFromUrl = searchParams.get("courseId");
    const isAllSelected = !courseIdFromUrl || courseIdFromUrl === "all";
    const isSpecificCourse = courseIdFromUrl && courseIdFromUrl !== "all";

    const paths =
        curriculumType === "first_term"
            ? learningPaths.firstTerm
            : curriculumType === "second_term"
              ? learningPaths.secondTerm
              : learningPaths.summerCamp;

    // Fetch all levels grouped (when "all" is selected)
    const {
        data: levelsData,
        isLoading: isAllLevelsLoading,
        error: allLevelsError,
        refetch: refetchAllLevels,
    } = useLevelsList(
        {
            type: "group",
            programs_curriculum: curriculumType,
        },
        {
            enabled: isAllSelected,
        }
    );

    // Determine which data/loading/error to use based on URL
    const isLevelsLoading = isAllLevelsLoading;
    const error = allLevelsError;
    const refetch = refetchAllLevels;

    // Handle dropdown change - update URL
    const handleCourseChange = (courseId: string | null) => {
        if (courseId) {
            setSearchParams({ courseId });
        } else {
            // Remove courseId param when no selection
            searchParams.delete("courseId");
            setSearchParams(searchParams);
        }
    };

    const handleEdit = (id: string) => {
        navigate(paths.levels.edit(id));
    };

    const { mutateAsync: deleteLevel } = useDeleteLevel();
    const { confirm } = useConfirmDialog();

    const handleDelete = async (level: Level) => {
        const confirmed = await confirm({
            title: t("levels:levels.delete.title", "Delete Level"),
            message: t(
                "levels:levels.delete.message",
                `Are you sure you want to delete "${level.title}"? This action cannot be undone.`
            ),
            variant: "danger",
            confirmText: t("common.delete", "Delete"),
            cancelText: t("common.cancel", "Cancel"),
            successMessage: t(
                "levels:levels.delete.success",
                "Level deleted successfully"
            ),
        });

        if (confirmed) {
            try {
                await deleteLevel(level.id);
            } catch (error) {
                console.error("Failed to delete level:", error);
            }
        }
    };

    const isLoading = isLevelsLoading;

    if (isLoading && !levelsData) {
        return <LoadingState message={t("common.loading", "Loading...")} />;
    }

    if (error) {
        return (
            <ErrorState
                message={
                    error.message ||
                    t("errors.fetchFailed", "Failed to load data")
                }
                onRetry={refetch}
            />
        );
    }

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t(
                    `learning:learning.${curriculumType}.levels`,
                    `${curriculumType === "first_term" ? "First Term" : curriculumType === "second_term" ? "Second Term" : "Summer Camp"} Learning - Levels`
                ),
                subtitle: t(
                    "levels:levels.list.subtitle",
                    "Manage levels within courses"
                ),
                actions: (
                    <Link
                        to={paths.levels.create()}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        {t("levels:levels.actions.add", "Add Levels")}
                    </Link>
                ),
            }}
        >
            {levelsData?.items?.length === 0 ? (
                <EmptyState
                    title={t("levels:levels.empty.title", "No levels found")}
                    message={t(
                        "levels:levels.empty.description",
                        "Get started by creating your first level"
                    )}
                />
            ) : (
                <div className="space-y-6">
                    {levelsData?.items?.map((level, index) => (
                        <div className="px-6 pt-6">
                            <LevelListItem
                                key={level.id}
                                orderNumber={index + 1}
                                title={level.title}
                                description={level.description}
                                createdAt={level.createdAt}
                                updatedAt={level.updatedAt}
                                onEdit={() => handleEdit(level.id)}
                                onDelete={() => handleDelete(level)}
                                onQuiz={() =>
                                    navigate(paths.levels.view(level.id))
                                }
                                onClick={() =>
                                    navigate(
                                        paths.lessons.listByLevel(level.id)
                                    )
                                }
                                isLast={index === levelsData.items.length - 1}
                            />
                        </div>
                    ))}
                </div>
            )}
        </PageWrapper>
    );
}
