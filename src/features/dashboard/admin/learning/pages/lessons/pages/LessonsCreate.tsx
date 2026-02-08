/**
 * Learning - Create Lesson Page
 *
 * Creates a new lesson for a specific level.
 * Level ID is taken from URL params.
 * Uses react-hook-form with design-system Form components.
 */

import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageWrapper, Form } from "@/design-system";
import { useCreateLesson } from "../api";
import { useMutationHandler } from "@/shared/api";

const lessonFormSchema = z.object({
    title: z.string().min(1, "Title is required").max(255, "Title is too long"),
    description: z.string().min(1, "Description is required"),
    isActive: z.boolean(),
});

type LessonFormData = z.infer<typeof lessonFormSchema>;

export default function LearningLessonsCreate() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { gradeId, levelId } = useParams<{
        gradeId: string;
        levelId: string;
    }>();

    // Build base path from URL params
    const basePath = `/admin/grades/${gradeId}/levels/${levelId}`;

    const { mutateAsync, isPending } = useCreateLesson();
    const { execute } = useMutationHandler();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LessonFormData>({
        resolver: zodResolver(lessonFormSchema),
        defaultValues: {
            title: "",
            description: "",
            isActive: true,
        },
    });

    const onSubmit = (data: LessonFormData) => {
        execute(
            () =>
                mutateAsync({
                    levelId: levelId || "",
                    title: data.title,
                    description: data.description,
                    isActive: data.isActive,
                }),
            {
                successMessage: t(
                    "lessons:lessons.messages.createSuccess",
                    "Lesson created successfully"
                ),
                onSuccess: () => navigate(`${basePath}/lessons`),
            }
        );
    };

    const handleCancel = () => {
        navigate(`${basePath}/lessons`);
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
                    "Add a new lesson"
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
