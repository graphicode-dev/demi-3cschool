import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, BookOpen } from "lucide-react";
import { ProjectCard } from "../components";
import { MOCK_PROJECTS, MOCK_LESSONS } from "../mocks";
import type { Project } from "../types";

export function ProjectsPage() {
    const { t } = useTranslation("projects");
    const [selectedLessonId, setSelectedLessonId] = useState<number | null>(
        null
    );
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const selectedLesson = useMemo(
        () => MOCK_LESSONS.find((l) => l.id === selectedLessonId),
        [selectedLessonId]
    );

    const filteredProjects = useMemo(() => {
        if (!selectedLessonId) return MOCK_PROJECTS;
        return MOCK_PROJECTS.filter((p) => p.lessonId === selectedLessonId);
    }, [selectedLessonId]);

    const handleViewHomework = (projectId: number) => {
        console.log("View homework:", projectId);
    };

    const handleViewHistory = (projectId: number) => {
        console.log("View history:", projectId);
    };

    const handleSubmit = (projectId: number) => {
        console.log("Submit homework:", projectId);
    };

    return (
        <div className="flex flex-col gap-6 px-4 py-6 max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col gap-4">
                {/* Title & Description */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {t("title")}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t("description")}
                    </p>
                </div>

                {/* Lesson Dropdown */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-gray-900 dark:text-white">
                        {t("chooseLesson")}
                    </label>
                    <div className="relative w-fit">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 border-2 border-brand-500 rounded-lg min-w-[240px] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            <BookOpen className="size-4 text-brand-500" />
                            <span className="flex-1 text-start text-sm font-semibold text-gray-900 dark:text-white">
                                {selectedLesson
                                    ? `Lesson ${selectedLesson.order}: ${selectedLesson.title}`
                                    : t("allLessons")}
                            </span>
                            <ChevronDown
                                className={`size-4 text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 overflow-hidden">
                                <button
                                    onClick={() => {
                                        setSelectedLessonId(null);
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`w-full px-3 py-2 text-start text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                                        selectedLessonId === null
                                            ? "bg-brand-50 dark:bg-brand-500/10 text-brand-500"
                                            : "text-gray-900 dark:text-white"
                                    }`}
                                >
                                    {t("allLessons")}
                                </button>
                                {MOCK_LESSONS.map((lesson) => (
                                    <button
                                        key={lesson.id}
                                        onClick={() => {
                                            setSelectedLessonId(lesson.id);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`w-full px-3 py-2 text-start text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                                            selectedLessonId === lesson.id
                                                ? "bg-brand-50 dark:bg-brand-500/10 text-brand-500"
                                                : "text-gray-900 dark:text-white"
                                        }`}
                                    >
                                        Lesson {lesson.order}: {lesson.title}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Projects List */}
            <div className="flex flex-col gap-4">
                {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onViewHomework={handleViewHomework}
                            onViewHistory={handleViewHistory}
                            onSubmit={handleSubmit}
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
        </div>
    );
}

export default ProjectsPage;
