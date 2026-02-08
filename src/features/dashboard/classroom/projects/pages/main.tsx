import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ChevronDown, BookOpen } from "lucide-react";
import { ProjectCard } from "../components";
import type { Project } from "../types";
import { PageWrapper } from "@/design-system";
import { useMyAllSessions } from "@/features/dashboard/classroom/mySchedule/api";
import {
    useLessonAssignment,
    useLessonAssignmentsList,
    useLessonAssignmentsByLesson,
} from "@/features/dashboard/admin/learning/pages/lessons/api";

export function ProjectsPage() {
    const { t } = useTranslation("projects");
    const navigate = useNavigate();
    const [selectedLessonId, setSelectedLessonId] = useState<number | null>(
        null
    );
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState<
        string | null
    >(null);

    const { data: mySessionsData } = useMyAllSessions();

    const lessons = useMemo(() => {
        const items = mySessionsData?.items ?? [];
        const unique = new Map<number, { id: number; title: string }>();
        for (const s of items) {
            const lessonId = s.lesson?.id;
            const lessonTitle = s.lesson?.title;
            if (!lessonId || !lessonTitle) continue;
            if (!unique.has(lessonId)) {
                unique.set(lessonId, { id: lessonId, title: lessonTitle });
            }
        }
        return Array.from(unique.values()).sort((a, b) => a.id - b.id);
    }, [mySessionsData?.items]);

    const selectedLesson = useMemo(() => {
        if (!selectedLessonId) return null;
        return lessons.find((l) => l.id === selectedLessonId) ?? null;
    }, [selectedLessonId, lessons]);

    const { data: allAssignments } = useLessonAssignmentsList({
        enabled: selectedLessonId === null,
    });

    const { data: assignmentsData } = useLessonAssignmentsByLesson(
        selectedLessonId ? String(selectedLessonId) : null,
        undefined,
        { enabled: !!selectedLessonId }
    );

    useLessonAssignment(selectedAssignmentId, {
        enabled: !!selectedAssignmentId,
    });

    const stringToStableInt = (value: string) => {
        let hash = 0;
        for (let i = 0; i < value.length; i++) {
            hash = (hash * 31 + value.charCodeAt(i)) | 0;
        }
        return Math.abs(hash);
    };

    const projects = useMemo(() => {
        const items =
            selectedLessonId === null
                ? (allAssignments ?? [])
                : (assignmentsData?.items ?? []);

        if (items.length === 0) return [] as Project[];

        return items.map((a) => {
            const numericId = Number(a.id);
            const id = Number.isFinite(numericId)
                ? numericId
                : stringToStableInt(a.id);

            return {
                id,
                assignmentId: a.id,
                lessonId: selectedLesson?.id ?? 0,
                lessonTitle: selectedLesson?.title ?? t("allLessons"),
                lessonOrder: 0,
                title: a.title,
                description: a.file?.fileName ?? a.file?.name ?? "",
                status: "new",
                homeworkFile: a.file
                    ? {
                          name: a.file.fileName ?? a.file.name,
                          type: a.file.mimeType,
                          size: a.file.humanReadableSize,
                          url: a.file.url,
                      }
                    : undefined,
            } satisfies Project;
        });
    }, [
        allAssignments,
        assignmentsData?.items,
        selectedLesson,
        selectedLessonId,
        t,
    ]);

    const handleViewHomework = useCallback(
        (projectId: number) => {
            const assignmentId =
                projects.find((p) => p.id === projectId)?.assignmentId ??
                String(projectId);
            setSelectedAssignmentId(assignmentId);
            navigate(`homework/${assignmentId}`);
        },
        [navigate, projects]
    );

    const handleSubmit = useCallback(
        (projectId: number) => {
            navigate(`submit/${projectId}`);
        },
        [navigate]
    );

    const handleViewResults = useCallback(
        (projectId: number) => {
            navigate(`results/${projectId}`);
        },
        [navigate]
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
