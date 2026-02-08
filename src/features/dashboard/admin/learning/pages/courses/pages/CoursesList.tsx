/**
 * Learning - Courses List Page
 *
 * Shared component for both Standard and Professional Learning courses.
 * The curriculum type is determined from the URL path.
 */

import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { useListQueryState } from "@/shared/hooks";
import {
    PageWrapper,
    LoadingState,
    ErrorState,
    EmptyState,
    useConfirmDialog,
} from "@/design-system";
import { ListCard, SearchInput } from "../components";
import { learningPaths } from "@/features/dashboard/admin/learning/navigation/paths";
import { Course, useCoursesList, useDeleteCourse } from "../api";
import { useCurriculumType } from "../../../hooks";

export default function LearningCoursesList() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const curriculumType = useCurriculumType();
    const { search, setSearch, queryParams } = useListQueryState();
    const { confirm } = useConfirmDialog();

    const { data, isLoading, error, refetch } = useCoursesList({
        ...queryParams,
        programs_curriculum: curriculumType,
    });

    const { mutateAsync: deleteCourse } = useDeleteCourse();

    const paths =
        curriculumType === "first_term"
            ? learningPaths.firstTerm
            : curriculumType === "second_term"
              ? learningPaths.secondTerm
              : learningPaths.summerCamp;

    const courses = data?.items ?? [];

    const handleEdit = (id: string) => {
        navigate(paths.courses.edit(id));
    };

    const handleDelete = async (course: Course) => {
        const confirmed = await confirm({
            title: t("courses:courses.delete.title", "Delete Course"),
            message: t(
                "courses:courses.delete.message",
                `Are you sure you want to delete "${course.title}"? This action cannot be undone.`
            ),
            variant: "danger",
            confirmText: t("common.delete", "Delete"),
            cancelText: t("common.cancel", "Cancel"),
            successMessage: t(
                "courses:courses.delete.success",
                "Course deleted successfully"
            ),
        });

        if (confirmed) {
            try {
                await deleteCourse(course.id);
            } catch (error) {
                console.error("Failed to delete course:", error);
            }
        }
    };

    const handleView = (id: string) => {
        navigate(`${paths.levels.list()}?courseId=${id}`);
    };

    if (isLoading && !data) {
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
                    `learning:learning.${curriculumType}.courses`,
                    `${curriculumType === "first_term" ? "First Term" : curriculumType === "second_term" ? "Second Term" : "Summer Camp"} - Courses`
                ),
                subtitle: t(
                    `learning:learning.${curriculumType}.coursesDescription`,
                    `Manage courses in the ${curriculumType} learning track`
                ),
                actions: (
                    <Link
                        to={paths.courses.create()}
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
                        {t("courses:courses.actions.add", "Add Course")}
                    </Link>
                ),
            }}
        >
            <SearchInput
                value={search}
                onChange={setSearch}
                placeholder={t("courses:courses.search", "Search courses")}
            />

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {courses.length === 0 ? (
                    <EmptyState
                        title={t(
                            "courses:courses.empty.title",
                            "No courses found"
                        )}
                        message={
                            search
                                ? t(
                                      "courses:courses.empty.searchDescription",
                                      "Try adjusting your search terms"
                                  )
                                : t(
                                      "courses:courses.empty.description",
                                      "Get started by creating your first course"
                                  )
                        }
                    />
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {courses.map((course: Course) => (
                            <ListCard
                                key={course.id}
                                title={course.title}
                                description={`${course.slug} • ${course.description}`}
                                grade={course.grade?.name}
                                status={{
                                    label: course.isActive
                                        ? t("common.active", "Active")
                                        : t("common.inactive", "Inactive"),
                                    variant: course.isActive
                                        ? "success"
                                        : "default",
                                }}
                                meta={new Date(
                                    course.createdAt
                                ).toLocaleDateString()}
                                onEdit={() => handleEdit(course.id)}
                                onDelete={() => handleDelete(course)}
                                onView={() => handleView(course.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </PageWrapper>
    );
}
