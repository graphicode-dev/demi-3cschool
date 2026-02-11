/**
 * Learning - Lesson Detail Page
 *
 * Shared component for both Standard and Professional Learning.
 * Displays lesson content management with tabs for Videos, Quizzes, Assignments, and Materials.
 */

import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {
    PageWrapper,
    ErrorState,
    LoadingState,
    ViewCard,
} from "@/design-system";
import { useLesson } from "../api";
import { LessonContentManager } from "../components";

export default function LearningLessonsDetail() {
    const { t } = useTranslation();
    const { id, levelId } = useParams<{ id: string; levelId: string }>();

    const { data: lesson, isLoading, error, refetch } = useLesson(id);

    if (isLoading) {
        return <LoadingState message={t("common.loading", "Loading...")} />;
    }

    if (error || !lesson) {
        return (
            <ErrorState
                message={
                    error?.message ||
                    t("errors.fetchFailed", "Failed to load lesson")
                }
                onRetry={refetch}
            />
        );
    }

    return (
        <PageWrapper
            pageHeaderProps={{
                title: lesson?.title,
                subtitle: t(
                    "learning:lessons.content.subtitle",
                    "Manage videos, quizzes, assignments, and materials"
                ),
            }}
        >
            <ViewCard
                headerTitle={t(
                    "learning:lessons.overview.title",
                    "Lesson Overview"
                )}
                data={{
                    rows: [
                        {
                            fields: [
                                {
                                    label: t(
                                        "learning:lessons.overview.description",
                                        "Lesson Description"
                                    ),
                                    value: lesson?.description,
                                    colSpan: 3,
                                },
                            ],
                        },
                    ],
                }}
            />

            <LessonContentManager lessonId={lesson.id} levelId={levelId!} />
        </PageWrapper>
    );
}
