/**
 * Learning - Create Level Page
 *
 * Shared component for both Standard and Professional Learning.
 * Uses react-hook-form with design-system Form components.
 */

import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageWrapper, Form } from "@/design-system";
import { learningPaths } from "@/features/dashboard/admin/learning/navigation/paths";
import { useCreateLevel } from "../api";
import { useCoursesByProgram } from "../../courses";
import { useMutationHandler } from "@/shared/api";
import { useCurriculumType } from "../../../hooks";

const levelFormSchema = z.object({
    courseId: z.string().min(1, "Course is required"),
    title: z.string().min(1, "Title is required").max(255, "Title is too long"),
    description: z.string().min(1, "Description is required"),
    isActive: z.boolean(),
});

type LevelFormData = z.infer<typeof levelFormSchema>;

export default function LearningLevelsCreate() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const curriculumType = useCurriculumType();
    const paths =
        curriculumType === "first_term"
            ? learningPaths.firstTerm
            : curriculumType === "second_term"
              ? learningPaths.secondTerm
              : learningPaths.summerCamp;

    const preselectedCourseId = searchParams.get("courseId") || "";

    const { mutateAsync, isPending } = useCreateLevel();
    const { execute } = useMutationHandler();
    const { data: coursesData } = useCoursesByProgram({
        programType: curriculumType,
    });

    const courses = coursesData ?? [];

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LevelFormData>({
        resolver: zodResolver(levelFormSchema),
        defaultValues: {
            courseId: preselectedCourseId,
            title: "",
            description: "",
            isActive: true,
        },
    });

    const onSubmit = (data: LevelFormData) => {
        execute(
            () =>
                mutateAsync({
                    courseId: data.courseId,
                    title: data.title,
                    description: data.description,
                    isActive: data.isActive,
                }),
            {
                successMessage: t(
                    "learning:levels.messages.createSuccess",
                    "Level created successfully"
                ),
                onSuccess: () => navigate(paths.levels.list()),
            }
        );
    };

    const handleCancel = () => {
        navigate(paths.levels.list());
    };

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t(
                    "learning:levels.form.create.title",
                    "Create New Level"
                ),
                subtitle: t(
                    "learning:levels.form.create.subtitle",
                    `Add a new level to ${curriculumType === "first_term" ? "First Term" : curriculumType === "second_term" ? "Second Term" : "Summer Camp"} Learning`
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
                    name="courseId"
                    type={{
                        type: "dropdown",
                        placeholder: t(
                            "learning:levels.form.fields.course.placeholder",
                            "Select a course"
                        ),
                        options: courses.map((course) => ({
                            value: String(course.id),
                            label: course.title,
                        })),
                    }}
                    label={{
                        text: t(
                            "learning:levels.form.fields.course.label",
                            "Course"
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
                            "learning:levels.form.fields.title.placeholder",
                            "Enter level title"
                        ),
                    }}
                    label={{
                        text: t(
                            "learning:levels.form.fields.title.label",
                            "Level Title"
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
                            "learning:levels.form.fields.active.label",
                            "Active"
                        ),
                    }}
                    label={{
                        text: t(
                            "learning:levels.form.fields.status.label",
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
                            "learning:levels.form.fields.description.placeholder",
                            "Enter level description"
                        ),
                        rows: 4,
                    }}
                    label={{
                        text: t(
                            "learning:levels.form.fields.description.label",
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
