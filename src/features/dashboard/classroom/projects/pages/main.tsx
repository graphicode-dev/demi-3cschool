import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ChevronDown, BookOpen } from "lucide-react";
import { ProjectCard } from "../components";
import type { Project } from "../types";
import { PageWrapper } from "@/design-system";
import { useAssignmentGroups, type Assignment } from "../api";

export function ProjectsPage() {
    const { t } = useTranslation("projects");
    const navigate = useNavigate();
    const [selectedLessonId, setSelectedLessonId] = useState<number | null>(
        null
    );
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const { data: assignmentGroups } = useAssignmentGroups();

    const lessons = useMemo(() => {
        const groups = assignmentGroups ?? [];
        const unique = new Map<number, { id: number; title: string }>();
        for (const group of groups) {
            for (const lesson of group.lessons) {
                if (!unique.has(lesson.lessonId)) {
                    unique.set(lesson.lessonId, {
                        id: lesson.lessonId,
                        title: lesson.lessonTitle,
                    });
                }
            }
        }
        return Array.from(unique.values()).sort((a, b) => a.id - b.id);
    }, [assignmentGroups]);

    const selectedLesson = useMemo(() => {
        if (!selectedLessonId) return null;
        return lessons.find((l) => l.id === selectedLessonId) ?? null;
    }, [selectedLessonId, lessons]);

    const mapAssignmentStatus = (
        status: Assignment["status"]
    ): Project["status"] => {
        switch (status) {
            case "not_started":
                return "new";
            case "submitted":
                return "under_review";
            case "reviewed":
                return "reviewed";
            default:
                return "new";
        }
    };

    const projects = useMemo(() => {
        const groups = assignmentGroups ?? [];
        const result: Project[] = [];

        for (const group of groups) {
            for (const lesson of group.lessons) {
                if (
                    selectedLessonId !== null &&
                    lesson.lessonId !== selectedLessonId
                ) {
                    continue;
                }
                for (const assignment of lesson.assignments) {
                    result.push({
                        id: assignment.assignmentId,
                        assignmentId: String(assignment.assignmentId),
                        groupId: group.groupId,
                        lessonId: lesson.lessonId,
                        lessonTitle: lesson.lessonTitle,
                        lessonOrder: 0,
                        title: assignment.assignmentTitle,
                        description: group.groupName,
                        status: mapAssignmentStatus(assignment.status),
                        submissionDate: assignment.submittedAt ?? undefined,
                        grade: assignment.score ?? undefined,
                        maxGrade: assignment.maxScore ?? undefined,
                        feedback: assignment.teacherComment ?? undefined,
                        homeworkFile: assignment.assignmentFileUrl
                            ? {
                                  name: assignment.assignmentTitle,
                                  type: "application/pdf",
                                  size: "",
                                  url: assignment.assignmentFileUrl,
                              }
                            : undefined,
                    });
                }
            }
        }

        return result;
    }, [assignmentGroups, selectedLessonId]);

    const handleViewHomework = useCallback(
        (projectId: number) => {
            const project = projects.find((p) => p.id === projectId);
            if (!project) return;
            navigate(`homework/${project.groupId}/${project.assignmentId}`);
        },
        [navigate, projects]
    );

    const handleSubmit = useCallback(
        (projectId: number) => {
            const project = projects.find((p) => p.id === projectId);
            if (!project) return;
            navigate(`submit/${project.groupId}/${project.assignmentId}`);
        },
        [navigate, projects]
    );

    const handleViewResults = useCallback(
        (projectId: number) => {
            const project = projects.find((p) => p.id === projectId);
            if (!project) return;
            navigate(`results/${project.groupId}/${project.assignmentId}`);
        },
        [navigate, projects]
    );

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("title"),
                subtitle: t("description"),
            }}
        >
            {/* Lesson Dropdown */}
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-900 dark:text-white">
                    {t("chooseLesson")}
                </label>
                <div className="relative w-fit">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 px-3 py-2.5 bg-white dark:bg-gray-900 border-2 border-brand-500 rounded-xl min-w-[280px] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <BookOpen className="size-5 text-brand-500" />
                        <span className="flex-1 text-start text-base font-semibold text-gray-900 dark:text-white">
                            {selectedLesson
                                ? selectedLesson.title
                                : t("allLessons")}
                        </span>
                        <ChevronDown
                            className={`size-5 text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                        />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10 overflow-hidden">
                            <button
                                onClick={() => {
                                    setSelectedLessonId(null);
                                    setIsDropdownOpen(false);
                                }}
                                className={`w-full px-3 py-2.5 text-start text-base font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                                    selectedLessonId === null
                                        ? "bg-brand-50 dark:bg-brand-500/10 text-brand-500"
                                        : "text-gray-900 dark:text-white"
                                }`}
                            >
                                {t("allLessons")}
                            </button>
                            {lessons.map((lesson) => (
                                <button
                                    key={lesson.id}
                                    onClick={() => {
                                        setSelectedLessonId(lesson.id);
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`w-full px-3 py-2.5 text-start text-base font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                                        selectedLessonId === lesson.id
                                            ? "bg-brand-50 dark:bg-brand-500/10 text-brand-500"
                                            : "text-gray-900 dark:text-white"
                                    }`}
                                >
                                    {lesson.title}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Projects List */}
            <div className="flex flex-col gap-4">
                {projects.length > 0 ? (
                    projects.map((project: Project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onViewHomework={handleViewHomework}
                            onSubmit={handleSubmit}
                            onViewResults={handleViewResults}
                        />
                    ))
                ) : (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-theme-sm p-8 text-center">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {t("noProjects")}
                        </p>
                    </div>
                )}
            </div>
        </PageWrapper>
    );
}

export default ProjectsPage;
