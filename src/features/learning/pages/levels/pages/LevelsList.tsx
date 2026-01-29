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

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
    useLocation,
    useNavigate,
    useSearchParams,
    Link,
} from "react-router-dom";

import {
    LoadingState,
    ErrorState,
    EmptyState,
    useConfirmDialog,
} from "@/design-system";
import {
    CourseFilterDropdown,
    LevelListItem,
    LevelGroupCard,
} from "../components";
import { learningPaths } from "@/features/learning/navigation/paths";
import { ProgramsCurriculum } from "@/features/learning/types";
import { Course, useCoursesByProgram } from "../../courses";
import { Level, LevelGroup, useDeleteLevel, useLevelsByCourse, useLevelsList } from "../api";
import PageWrapper from "@/design-system/components/PageWrapper";

function useCurriculumType(): ProgramsCurriculum {
    const location = useLocation();
    return location.pathname.includes("professional-learning")
        ? "professional"
        : "standard";
}

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

    const isStandard = curriculumType === "standard";
    const paths = isStandard
        ? learningPaths.standard
        : learningPaths.professional;

    // Fetch courses for dropdown (filtered by curriculum type)
    const { data: coursesData, isLoading: isCoursesLoading } =
        useCoursesByProgram({
            programType: curriculumType,
        });

    // Fetch all levels grouped (when "all" is selected)
    const {
        data: allLevelsData,
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

    // Fetch levels by course (when specific courseId is selected)
    const {
        data: courseLevelsData,
        isLoading: isCourseLevelsLoading,
        error: courseLevelsError,
        refetch: refetchCourseLevels,
    } = useLevelsByCourse(
        {
            courseId: isSpecificCourse ? courseIdFromUrl : "",
            type: "group",
            programs_curriculum: curriculumType,
        },
        {
            enabled: !!isSpecificCourse,
        }
    );

    // Determine which data/loading/error to use based on URL
    const levelsData = isSpecificCourse ? courseLevelsData : allLevelsData;
    const isLevelsLoading = isSpecificCourse
        ? isCourseLevelsLoading
        : isAllLevelsLoading;
    const error = isSpecificCourse ? courseLevelsError : allLevelsError;
    const refetch = isSpecificCourse ? refetchCourseLevels : refetchAllLevels;

    // Map courses for dropdown - API returns array directly
    const courses = useMemo(() => {
        if (!coursesData || coursesData.length === 0) return [];
        return coursesData.map((course: Course) => ({
            id: String(course.id),
            title: course.title,
        }));
    }, [coursesData]);

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

    const levelGroups = (levelsData as LevelGroup[]) ?? [];
    const isLoading = isCoursesLoading || isLevelsLoading;

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
            title:t(
                    isStandard
                        ? "learning:learning.standard.levels"
                        : "learning:learning.professional.levels",
                    `${isStandard ? "Standard" : "Professional"} Learning - Levels`
                ),
                subtitle:t(
                    "levels:levels.list.subtitle",
                    "Manage levels within courses"
                ),
                actions:
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
                
        }}
        >

            <CourseFilterDropdown
                courses={courses}
                selectedCourseId={courseIdFromUrl}
                onChange={handleCourseChange}
                isLoading={isCoursesLoading}
                className="max-w-xs"
            />

            {levelGroups.length === 0 ? (
                <EmptyState
                    title={t("levels:levels.empty.title", "No levels found")}
                    message={t(
                        "levels:levels.empty.description",
                        "Get started by creating your first level"
                    )}
                />
            ) : (
                <div className="space-y-6">
                    {levelGroups.map((group: LevelGroup) => (
                        <div
                            key={group.course.id}
                            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {group.course.title}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {t(
                                        "levels:levels.levelsCount",
                                        "{{count}} Levels",
                                        { count: group.levels.length }
                                    )}
                                </p>
                            </div>

                            {group.levels.length === 0 ? (
                                <div className="p-6 text-sm text-gray-500 dark:text-gray-400">
                                    {t(
                                        "levels:levels.empty.noLevelsInCourse",
                                        "No levels in this course"
                                    )}
                                </div>
                            ) : (
                                <div className="px-6 pt-6">
                                    {group.levels.map((level, index) => (
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
                                                navigate(
                                                    paths.levels.view(level.id)
                                                )
                                            }
                                            onClick={() =>
                                                navigate(
                                                    paths.lessons.listByLevel(
                                                        level.id
                                                    )
                                                )
                                            }
                                            isLast={
                                                index ===
                                                group.levels.length - 1
                                            }
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </PageWrapper>
    );
}
