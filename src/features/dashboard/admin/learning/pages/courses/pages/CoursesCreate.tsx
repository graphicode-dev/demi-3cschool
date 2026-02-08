/**
 * Learning - Create Course Page
 *
 * Shared component for both Standard and Professional Learning.
 * Uses react-hook-form with design-system Form components.
 */

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PageWrapper, Form } from "@/design-system";

import { learningPaths } from "@/features/dashboard/admin/learning/navigation/paths";
import { useCreateCourse } from "../api";
import { ProgramsCurriculum } from "@/features/dashboard/admin/learning/types";
import { useMutationHandler } from "@/shared/api";
import { useGrades } from "@/features/dashboard/admin/systemManagements/api";
import { useCurriculumType } from "../../../hooks";

const CURRICULUM_IDS: Record<ProgramsCurriculum, string> = {
    first_term: "1",
    second_term: "2",
    summer_camp: "3",
};

const courseFormSchema = z.object({
    title: z.string().min(1, "Title is required").max(255, "Title is too long"),
    description: z.string().min(1, "Description is required"),
    slug: z
        .string()
        .min(1, "Slug is required")
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug must be lowercase with hyphens only"
        ),
    gradeId: z.string().min(1, "Grade is required"),
    isActive: z.boolean(),
});

type CourseFormData = z.infer<typeof courseFormSchema>;

export default function LearningCoursesCreate() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const curriculumType = useCurriculumType();
    const paths =
        curriculumType === "first_term"
            ? learningPaths.firstTerm
            : curriculumType === "second_term"
              ? learningPaths.secondTerm
              : learningPaths.summerCamp;

    const { mutateAsync, isPending } = useCreateCourse();
    const { execute } = useMutationHandler();
    const { data: gradesData, isLoading: isLoadingGrades } = useGrades();
    const grades = gradesData?.items ?? [];

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<CourseFormData>({
        resolver: zodResolver(courseFormSchema),
        defaultValues: {
            title: "",
            description: "",
            slug: "",
            gradeId: "",
            isActive: true,
        },
    });

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    const handleTitleChange = (value: string) => {
        const newSlug = generateSlug(value);
        setValue("slug", newSlug);
    };

    const onSubmit = (data: CourseFormData) => {
        console.log("data: ", JSON.stringify(data));
        execute(
            () =>
                mutateAsync({
                    programCurriculumId: CURRICULUM_IDS[curriculumType],
                    title: data.title,
                    description: data.description,
                    slug: data.slug,
                    gradeId: data.gradeId,
                    isActive: data.isActive,
                }),
            {
                successMessage: t(
                    "courses:courses.messages.createSuccess",
                    "Course created successfully"
                ),
                onSuccess: () => navigate(paths.courses.list()),
            }
        );
    };

    const handleCancel = () => {
        navigate(paths.courses.list());
    };

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t(
                    "courses:courses.form.create.title",
                    "Create New Course"
                ),
                subtitle: t(
                    "courses:courses.form.create.subtitle",
                    `Add a new course to ${curriculumType === "first_term" ? "First Term" : curriculumType === "second_term" ? "Second Term" : "Summer Camp"} Learning`
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
                            "courses:courses.form.fields.title.placeholder",
                            "Enter course title"
                        ),
                    }}
                    label={{
                        text: t(
                            "courses:courses.form.fields.title.label",
                            "Course Title"
                        ),
                        required: true,
                    }}
                    style={{ size: "md" }}
                    layout={{ className: "col-span-full" }}
                    onChange={(value) => handleTitleChange(value)}
                />

                <Form.Input
                    name="slug"
                    type={{
                        type: "text",
                        placeholder: t(
                            "courses:courses.form.fields.slug.placeholder",
                            "course-slug"
                        ),
                        readOnly: true,
                    }}
                    label={{
                        text: t(
                            "courses:courses.form.fields.slug.label",
                            "URL Slug"
                        ),
                        required: true,
                    }}
                    style={{ size: "md" }}
                />

                <Form.Input
                    name="gradeId"
                    type={{
                        type: "dropdown",
                        placeholder: t(
                            "courses:courses.form.fields.grade.placeholder",
                            "Select a grade"
                        ),
                        options: grades
                            .filter((grade) => grade.isActive)
                            .map((grade) => ({
                                value: String(grade.id),
                                label: grade.name,
                            })),
                    }}
                    label={{
                        text: t(
                            "courses:courses.form.fields.grade.label",
                            "Grade"
                        ),
                        required: true,
                    }}
                    style={{ size: "md" }}
                />

                <Form.Input
                    name="isActive"
                    type={{
                        type: "checkbox",
                        label: t(
                            "courses:courses.form.fields.active.label",
                            "Active"
                        ),
                    }}
                    label={{
                        text: t(
                            "courses:courses.form.fields.status.label",
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
                            "courses:courses.form.fields.description.placeholder",
                            "Enter course description"
                        ),
                        rows: 4,
                    }}
                    label={{
                        text: t(
                            "courses:courses.form.fields.description.label",
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
