/**
 * Learning - Create Lesson Page
 *
 * Shared component for both Standard and Professional Learning.
 * Uses react-hook-form with design-system Form components.
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/design-system/components/form";
import { learningPaths } from "@/features/dashboard/admin/learning/navigation/paths";
import { ProgramsCurriculum } from "@/features/dashboard/admin/learning/types";
import { useCreateLesson } from "../api";
import { Level, LevelGroup, useLevelsList } from "../../levels";
import PageWrapper from "@/design-system/components/PageWrapper";
import { useMutationHandler } from "@/shared/api";

const lessonFormSchema = z.object({
    levelId: z.string().min(1, "Level is required"),
    title: z.string().min(1, "Title is required").max(255, "Title is too long"),
    description: z.string().min(1, "Description is required"),
    isActive: z.boolean(),
});

type LessonFormData = z.infer<typeof lessonFormSchema>;

function useCurriculumType(): ProgramsCurriculum {
    const location = useLocation();
    return location.pathname.includes("professional-learning")
        ? "professional"
        : "standard";
}

export default function LearningLessonsCreate() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const curriculumType = useCurriculumType();
    const isStandard = curriculumType === "standard";
    const paths = isStandard
        ? learningPaths.standard
        : learningPaths.professional;

    const preselectedLevelId = searchParams.get("levelId") || "";

    const { mutateAsync, isPending } = useCreateLesson();
    const { execute } = useMutationHandler();
    const { data: levelsData } = useLevelsList({
        type: "group",
        programs_curriculum: curriculumType,
    });

    // Extract levels from grouped data
    const levels = useMemo(() => {
        const levelGroups = (levelsData as LevelGroup[]) ?? [];
        if (levelGroups.length === 0) return [];

        const allLevels: Level[] = [];
        levelGroups.forEach((group: LevelGroup) => {
            group.levels.forEach((level: Level) => {
                allLevels.push(level);
            });
        });
        return allLevels;
    }, [levelsData]);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LessonFormData>({
        resolver: zodResolver(lessonFormSchema),
        defaultValues: {
            levelId: preselectedLevelId,
            title: "",
            description: "",
            isActive: true,
        },
    });

    const onSubmit = (data: LessonFormData) => {
        execute(
            () =>
                mutateAsync({
                    levelId: data.levelId,
                    title: data.title,
                    description: data.description,
                    isActive: data.isActive,
                }),
            {
                successMessage: t(
                    "lessons:lessons.messages.createSuccess",
                    "Lesson created successfully"
                ),
                onSuccess: () => navigate(paths.lessons.list()),
            }
        );
    };

    const handleCancel = () => {
        navigate(paths.lessons.list());
    };

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t(
                    "lessons:lessons.form.create.title",
                    "Create New Lesson"
                ),
                subtitle: t(
                    "lessons:lessons.form.create.subtitle",
                    `Add a new lesson to ${isStandard ? "Standard" : "Professional"} Learning`
                ),
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
                            "lessons:lessons.form.fields.level.placeholder",
                            "Select a level"
                        ),
                        options: levels.map((level: Level) => ({
                            value: String(level.id),
                            label: level.title,
                        })),
                    }}
                    label={{
                        text: t(
                            "lessons:lessons.form.fields.level.label",
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
                            "lessons:lessons.form.fields.title.placeholder",
                            "Enter lesson title"
                        ),
                    }}
                    label={{
                        text: t(
                            "lessons:lessons.form.fields.title.label",
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
                            "lessons:lessons.form.fields.active.label",
                            "Active"
                        ),
                    }}
                    label={{
                        text: t(
                            "lessons:lessons.form.fields.status.label",
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
                            "lessons:lessons.form.fields.description.placeholder",
                            "Enter lesson description"
                        ),
                        rows: 4,
                    }}
                    label={{
                        text: t(
                            "lessons:lessons.form.fields.description.label",
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
                            text: t("common.create", "Create"),
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
