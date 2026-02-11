/**
 * Learning - Edit Lesson Page
 *
 * Shared component for both Standard and Professional Learning.
 * Uses react-hook-form with design-system Form components.
 */

import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageWrapper, Form, LoadingState, ErrorState } from "@/design-system";

import { learningPaths } from "@/features/dashboard/admin/learning/navigation/paths";
import { useLesson, useUpdateLesson } from "../api";
import { Level, useLevelsList } from "../../levels";
import { useMutationHandler } from "@/shared/api";
import { useCurriculumType } from "../../../hooks";

const lessonFormSchema = z.object({
    levelId: z.string().min(1, "Level is required"),
    title: z.string().min(1, "Title is required").max(255, "Title is too long"),
    description: z.string().min(1, "Description is required"),
    isActive: z.boolean(),
});

type LessonFormData = z.infer<typeof lessonFormSchema>;

export default function LearningLessonsEdit() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const curriculumType = useCurriculumType();
    const paths =
        curriculumType === "first_term"
            ? learningPaths.firstTerm
            : curriculumType === "second_term"
              ? learningPaths.secondTerm
              : learningPaths.summerCamp;

    const { data: lesson, isLoading, error, refetch } = useLesson(id);
    const { mutateAsync, isPending } = useUpdateLesson();
    const { execute } = useMutationHandler();
    const { data: levelsData } = useLevelsList({
        page: 1,
        programs_curriculum: curriculumType,
    });

    // Extract levels from paginated data
    const levels = useMemo(() => {
        return levelsData?.items ?? [];
    }, [levelsData]);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<LessonFormData>({
        resolver: zodResolver(lessonFormSchema),
        defaultValues: {
            levelId: "",
            title: "",
            description: "",
            isActive: true,
        },
    });

    useEffect(() => {
        if (lesson && levels.length > 0) {
            reset({
                levelId: String(lesson.level?.id || ""),
                title: lesson.title,
                description: lesson.description ?? "",
                isActive: lesson.isActive,
            });
        }
    }, [lesson, levels, reset]);

    const onSubmit = (data: LessonFormData) => {
        if (!id) return;
        execute(
            () =>
                mutateAsync({
                    id,
                    data: {
                        levelId: data.levelId,
                        title: data.title,
                        description: data.description,
                        isActive: data.isActive,
                    },
                }),
            {
                successMessage: t(
                    "learning:lessons.messages.updateSuccess",
                    "Lesson updated successfully"
                ),
                onSuccess: () => navigate(paths.lessons.list()),
            }
        );
    };

    const handleCancel = () => {
        navigate(paths.lessons.list());
    };

    if (isLoading) {
        return <LoadingState message={t("common.loading", "Loading...")} />;
    }

    if (error) {
        return (
            <ErrorState
                message={
                    error.message ||
                    t("errors.fetchFailed", "Failed to load lesson")
                }
                onRetry={refetch}
            />
        );
    }

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("learning:lessons.form.edit.title", "Edit Lesson"),
                subtitle: lesson?.title,
                backButton: true,
            }}
        >
            <Form
                control={control}
                errors={errors}
                onSubmit={handleSubmit(onSubmit)}
                layout={{
                    columns: { base: 1, md: 2 },
                    gap: { base: "4", md: "6" },
                }}
            >
                <Form.Input
                    name="levelId"
                    type={{
                        type: "dropdown",
                        placeholder: t(
                            "learning:lessons.form.fields.level.placeholder",
                            "Select a level"
                        ),
                        options: levels.map((level: Level) => ({
                            value: String(level.id),
                            label: level.title,
                        })),
                    }}
                    label={{
                        text: t(
                            "learning:lessons.form.fields.level.label",
                            "Level"
                        ),
                        required: true,
                    }}
                    style={{ size: "md" }}
                    layout={{ className: "col-span-full" }}
                />

                <Form.Input
                    name="title"
                    type={{
                        type: "text",
                        placeholder: t(
                            "learning:lessons.form.fields.title.placeholder",
                            "Enter lesson title"
                        ),
                    }}
                    label={{
                        text: t(
                            "learning:lessons.form.fields.title.label",
                            "Lesson Title"
                        ),
                        required: true,
                    }}
                    style={{ size: "md" }}
                    layout={{ className: "col-span-full" }}
                />

                <Form.Input
                    name="isActive"
                    type={{
                        type: "checkbox",
                        label: t(
                            "learning:lessons.form.fields.active.label",
                            "Active"
                        ),
                    }}
                    label={{
                        text: t(
                            "learning:lessons.form.fields.status.label",
                            "Status"
                        ),
                    }}
                    style={{ size: "md" }}
                    layout={{ className: "flex items-end" }}
                />

                <Form.Input
                    name="description"
                    type={{
                        type: "textarea",
                        placeholder: t(
                            "learning:lessons.form.fields.description.placeholder",
                            "Enter lesson description"
                        ),
                        rows: 4,
                    }}
                    label={{
                        text: t(
                            "learning:lessons.form.fields.description.label",
                            "Description"
                        ),
                        required: true,
                    }}
                    style={{ size: "md" }}
                    layout={{ className: "col-span-full" }}
                />

                <Form.ButtonGroup
                    layout="horizontal"
                    className="col-span-full flex justify-end gap-3 pt-4"
                >
                    <Form.Button
                        config={{
                            text: t("common.cancel", "Cancel"),
                            variant: "outline",
                            size: "md",
                        }}
                        action={{
                            type: "button",
                            onClick: handleCancel,
                        }}
                    />
                    <Form.Button
                        config={{
                            text: t("common.save", "Save"),
                            variant: "primary",
                            size: "md",
                            loading: isPending,
                            disabled: isPending,
                        }}
                        action={{
                            type: "submit",
                        }}
                    />
                </Form.ButtonGroup>
            </Form>
        </PageWrapper>
    );
}
