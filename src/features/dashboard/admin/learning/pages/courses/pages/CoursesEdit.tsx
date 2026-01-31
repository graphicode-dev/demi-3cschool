/**
 * Learning - Edit Course Page
 *
 * Shared component for both Standard and Professional Learning.
 * Uses react-hook-form with design-system Form components.
 */

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LoadingState, ErrorState } from "@/design-system";
import { Form } from "@/design-system/components/form";

import { learningPaths } from "@/features/dashboard/admin/learning/navigation/paths";
import { ProgramsCurriculum } from "@/features/dashboard/admin/learning/types";
import { useCourse, useUpdateCourse } from "../api";
import PageWrapper from "@/design-system/components/PageWrapper";
import { useMutationHandler } from "@/shared/api";
import { useCurriculumType } from "../../../hooks";

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
    isActive: z.boolean(),
});

type CourseFormData = z.infer<typeof courseFormSchema>;

export default function LearningCoursesEdit() {
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

    const { data: course, isLoading, error, refetch } = useCourse(id);
    const { mutateAsync, isPending } = useUpdateCourse();
    const { execute } = useMutationHandler();

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CourseFormData>({
        resolver: zodResolver(courseFormSchema),
        defaultValues: {
            title: "",
            description: "",
            slug: "",
            isActive: true,
        },
    });

    useEffect(() => {
        if (course) {
            reset({
                title: course.title,
                description: course.description,
                slug: course.slug,
                isActive: course.isActive,
            });
        }
    }, [course, reset]);

    const onSubmit = (data: CourseFormData) => {
        if (!id) return;
        execute(
            () =>
                mutateAsync({
                    id,
                    data: {
                        title: data.title,
                        description: data.description,
                        slug: data.slug,
                        isActive: data.isActive,
                    },
                }),
            {
                successMessage: t(
                    "courses:courses.messages.updateSuccess",
                    "Course updated successfully"
                ),
                onSuccess: () => navigate(paths.courses.list()),
            }
        );
    };

    const handleCancel = () => {
        navigate(paths.courses.list());
    };

    if (isLoading) {
        return <LoadingState message={t("common.loading", "Loading...")} />;
    }

    if (error) {
        return (
            <ErrorState
                message={
                    error.message ||
                    t("errors.fetchFailed", "Failed to load course")
                }
                onRetry={refetch}
            />
        );
    }

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("courses:courses.form.edit.title", "Edit Course"),
                subtitle: course?.title,
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
                />

                <Form.Input
                    name="slug"
                    type={{
                        type: "text",
                        placeholder: t(
                            "courses:courses.form.fields.slug.placeholder",
                            "course-slug"
                        ),
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
                    layout={{ className: "flex items-end" }}
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
