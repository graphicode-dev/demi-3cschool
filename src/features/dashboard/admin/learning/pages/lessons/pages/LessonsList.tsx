/**
 * Learning - Lessons List Page
 *
 * Displays lessons for a specific level.
 * New structure: /admin/grades/:gradeId/levels/:levelId/lessons
 * Fetches lessons by levelId from URL params.
 */

import { useTranslation } from "react-i18next";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
    PageWrapper,
    LoadingState,
    ErrorState,
    EmptyState,
    useConfirmDialog,
} from "@/design-system";
import { useDeleteLesson, useLessonsByLevel } from "../api";
import { ListCard } from "../../courses/components";
import { Lesson } from "../types";
import { useMutationHandler } from "@/shared/api";

export default function LearningLessonsList() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { gradeId, levelId } = useParams<{
        gradeId: string;
        levelId: string;
    }>();

    // Build base path from URL params
    const basePath = `/admin/grades/${gradeId}/levels/${levelId}`;

    // Fetch lessons by level ID
    const {
        data: lessonsData,
        isLoading,
        error,
        refetch,
    } = useLessonsByLevel({ levelId: levelId || "" }, { enabled: !!levelId });

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

    const handleQuiz = (id: string) => {
        navigate(`${basePath}/lessons/quiz/${id}`);
    };

    // Get lessons array from response - API returns array directly for /lessons/level/:levelId
    const lessons = Array.isArray(lessonsData)
        ? (lessonsData as Lesson[])
        : ((lessonsData as { items?: Lesson[] })?.items ?? []);
    const levelTitle = lessons[0]?.level?.title || `Level ${levelId}`;

    if (isLoading) {
        return <LoadingState message={t("common.loading", "Loading...")} />;
    }

    if (error) {
        return (
            <ErrorState
                message={
                    error.message ||
                    t("errors.fetchFailed", "Failed to load lessons")
                }
                onRetry={refetch}
            />
        );
    }

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("learning:lessons.title", "Lessons"),
                subtitle: levelTitle,
                backButton: true,
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
            {/* Level Badge */}
            <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
                    {levelTitle}
                </span>
            </div>

            {lessons.length === 0 ? (
                <EmptyState
                    title={t("lessons:lessons.empty.title", "No lessons found")}
                    message={t(
                        "lessons:lessons.empty.description",
                        "Get started by creating your first lesson"
                    )}
                />
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {levelTitle}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {t(
                                "lessons:lessons.lessonsCount",
                                "{{count}} Lessons",
                                { count: lessons.length }
                            )}
                        </p>
                    </div>

                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {lessons.map((lesson: Lesson) => (
                            <ListCard
                                key={lesson.id}
                                title={lesson.title}
                                description={lesson.description}
                                status={{
                                    label: lesson.isActive
                                        ? t("common.active", "Active")
                                        : t("common.inactive", "Inactive"),
                                    variant: lesson.isActive
                                        ? "success"
                                        : "default",
                                }}
                                meta={new Date(
                                    lesson.createdAt
                                ).toLocaleDateString()}
                                onEdit={() => handleEdit(String(lesson.id))}
                                onDelete={() => handleDelete(lesson)}
                                onView={() => handleView(String(lesson.id))}
                                onQuiz={() => handleQuiz(String(lesson.id))}
                            />
                        ))}
                    </div>
                </div>
            )}
        </PageWrapper>
    );
}
