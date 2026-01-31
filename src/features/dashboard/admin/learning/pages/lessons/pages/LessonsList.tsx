/**
 * Learning - Lessons List Page
 *
 * Shared component for both Standard and Professional Learning lessons.
 * The curriculum type is determined from the URL path.
 * Displays lessons grouped by level.
 *
 * Fetching logic:
 * - null or "all" = fetch all lessons grouped by level
 * - levelId=<id> = fetch lessons for that specific level grouped
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
import { LevelFilterDropdown } from "../components";
import { ProgramsCurriculum } from "@/features/dashboard/admin/learning/types";
import { Level, LevelGroup, useLevelsList } from "../../levels";
import { useDeleteLesson, useLessonsByLevel, useLessonsList } from "../api";
import { ListCard } from "../../courses/components";
import { Lesson, LessonGroup } from "../types";
import PageWrapper from "@/design-system/components/PageWrapper";
import { useMutationHandler } from "@/shared/api";

export function useCurriculumType() {
    const location = useLocation();
    const curriculumType: ProgramsCurriculum = location.pathname.includes(
        "professional-learning"
    )
        ? "professional"
        : "standard";

    const isStandard = curriculumType === "standard";
    const basePath = isStandard
        ? "/dashboard/standard-learning"
        : "/dashboard/professional-learning";

    return {
        curriculumType,
        isStandard,
        basePath,
    };
}

export default function LearningLessonsList() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { basePath, curriculumType, isStandard } = useCurriculumType();

    // Get levelId from URL - this drives the fetching logic
    // null or "all" = fetch all lessons, <id> = fetch by specific level
    const levelIdFromUrl = searchParams.get("levelId");
    const isAllSelected = !levelIdFromUrl || levelIdFromUrl === "all";
    const isSpecificLevel = levelIdFromUrl && levelIdFromUrl !== "all";

    // Fetch all levels grouped for dropdown (filtered by curriculum type)
    // Using type: "group" to get levels with their course info
    const { data: allLevelsData, isLoading: isLevelsLoading } = useLevelsList({
        type: "group",
        programs_curriculum: curriculumType,
    });

    // Fetch all lessons grouped (when "all" is selected)
    const {
        data: allLessonsData,
        isLoading: isAllLessonsLoading,
        error: allLessonsError,
        refetch: refetchAllLessons,
    } = useLessonsList(
        {
            type: "group",
            programs_curriculum: curriculumType,
        },
        {
            enabled: isAllSelected,
        }
    );

    // Fetch lessons by level (when specific levelId is selected)
    const {
        data: levelLessonsData,
        isLoading: isLevelLessonsLoading,
        error: levelLessonsError,
        refetch: refetchLevelLessons,
    } = useLessonsByLevel(
        {
            levelId: isSpecificLevel ? levelIdFromUrl : "",
            type: "group",
            programs_curriculum: curriculumType,
        },
        {
            enabled: !!isSpecificLevel,
        }
    );

    // Determine which data/loading/error to use based on URL
    const lessonsData = isSpecificLevel ? levelLessonsData : allLessonsData;
    const isLessonsLoading = isSpecificLevel
        ? isLevelLessonsLoading
        : isAllLessonsLoading;
    const error = isSpecificLevel ? levelLessonsError : allLessonsError;
    const refetch = isSpecificLevel ? refetchLevelLessons : refetchAllLessons;

    // Map levels for dropdown - extract from grouped data
    const levels = useMemo(() => {
        const levelGroups = (allLevelsData as LevelGroup[]) ?? [];
        if (levelGroups.length === 0) return [];

        // Flatten all levels from all groups
        const allLevels: { id: string; title: string }[] = [];
        levelGroups.forEach((group: LevelGroup) => {
            group.levels.forEach((level: Level) => {
                allLevels.push({
                    id: String(level.id),
                    title: level.title,
                });
            });
        });
        return allLevels;
    }, [allLevelsData]);

    // Handle dropdown change - update URL
    const handleLevelChange = (levelId: string | null) => {
        if (levelId) {
            setSearchParams({ levelId });
        } else {
            searchParams.delete("levelId");
            setSearchParams(searchParams);
        }
    };

    const handleEdit = (id: string) => {
        navigate(`${basePath}/lessons/edit/${id}`);
    };

    const { mutateAsync: deleteLesson } = useDeleteLesson();
    const { confirm } = useConfirmDialog();
    const { execute } = useMutationHandler();

    const handleDelete = async (lesson: Lesson) => {
        const confirmed = await confirm({
            title: t("lessons:lessons.delete.title", "Delete Lesson"),
            message: t(
                "lessons:lessons.delete.message",
                `Are you sure you want to delete "${lesson.title}"? This action cannot be undone.`
            ),
            variant: "danger",
            confirmText: t("common.delete", "Delete"),
            cancelText: t("common.cancel", "Cancel"),
        });

        if (confirmed) {
            execute(() => deleteLesson(lesson.id), {
                successMessage: t(
                    "lessons:lessons.delete.success",
                    "Lesson deleted successfully"
                ),
            });
        }
    };

    const handleView = (id: string) => {
        navigate(`${basePath}/lessons/view/${id}?tab=videos`);
    };

    const lessonGroups = (lessonsData as LessonGroup[]) ?? [];
    const isLoading = isLevelsLoading || isLessonsLoading;

    if (isLoading && !lessonsData) {
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
                    isStandard
                        ? "learning:learning.standard.lessons"
                        : "learning:learning.professional.lessons",
                    `${isStandard ? "Standard" : "Professional"} Learning - Lessons`
                ),
                subtitle: t(
                    isStandard
                        ? "learning:learning.standard.lessonsDescription"
                        : "learning:learning.professional.lessonsDescription",
                    `Manage lessons in the ${isStandard ? "standard" : "professional"} learning track`
                ),
                actions: (
                    <Link
                        to={`${basePath}/lessons/create`}
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
                        {t("lessons:lessons.actions.add", "Add Lesson")}
                    </Link>
                ),
            }}
        >
            <LevelFilterDropdown
                levels={levels}
                selectedLevelId={levelIdFromUrl}
                onChange={handleLevelChange}
                isLoading={isLevelsLoading}
                className="max-w-xs"
            />

            {lessonGroups.length === 0 ? (
                <EmptyState
                    title={t("lessons:lessons.empty.title", "No lessons found")}
                    message={t(
                        "lessons:lessons.empty.description",
                        "Get started by creating your first lesson"
                    )}
                />
            ) : (
                <div className="space-y-6">
                    {lessonGroups.map(
                        (group: LessonGroup, groupIndex: number) => (
                            <div
                                key={group.level?.id ?? `group-${groupIndex}`}
                                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                            >
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {group.level?.title ??
                                            t(
                                                "lessons:lessons.noCourse",
                                                "Uncategorized"
                                            )}
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {t(
                                            "lessons:lessons.lessonsCount",
                                            "{{count}} Lessons",
                                            { count: group.lessons.length }
                                        )}
                                    </p>
                                </div>

                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {group.lessons.map((lesson: Lesson) => (
                                        <ListCard
                                            key={lesson.id}
                                            title={lesson.title}
                                            description={`${lesson.level.title} • ${lesson.description}`}
                                            status={{
                                                label: lesson.isActive
                                                    ? t(
                                                          "common.active",
                                                          "Active"
                                                      )
                                                    : t(
                                                          "common.inactive",
                                                          "Inactive"
                                                      ),
                                                variant: lesson.isActive
                                                    ? "success"
                                                    : "default",
                                            }}
                                            meta={new Date(
                                                lesson.createdAt
                                            ).toLocaleDateString()}
                                            onEdit={() =>
                                                handleEdit(String(lesson.id))
                                            }
                                            onDelete={() =>
                                                handleDelete(lesson)
                                            }
                                            onView={() =>
                                                handleView(String(lesson.id))
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        )
                    )}
                </div>
            )}
        </PageWrapper>
    );
}
