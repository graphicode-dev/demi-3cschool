import { useTranslation } from "react-i18next";
import { Eye, History, CloudUpload } from "lucide-react";
import type { Project } from "../types";

interface ProjectCardProps {
    project: Project;
    onViewHomework?: (projectId: number) => void;
    onViewHistory?: (projectId: number) => void;
    onSubmit?: (projectId: number) => void;
}

export function ProjectCard({
    project,
    onViewHomework,
    onViewHistory,
    onSubmit,
}: ProjectCardProps) {
    const { t } = useTranslation("projects");

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-theme-sm p-6 w-full">
            {/* Lesson Title */}
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                {project.lessonTitle}
            </p>

            {/* Project Title */}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {project.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {project.description}
            </p>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700 mb-4" />

            {/* Action Buttons */}
            <div className="flex gap-3">
                {/* View Homework Button */}
                <button
                    onClick={() => onViewHomework?.(project.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-400 dark:border-gray-600 text-gray-900 dark:text-white font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    <Eye className="size-4" />
                    {t("viewHomework")}
                </button>

                {/* History Button */}
                <button
                    onClick={() => onViewHistory?.(project.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    <History className="size-4" />
                    {t("history")}
                </button>

                {/* Submit Homework Button */}
                <button
                    onClick={() => onSubmit?.(project.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-lg shadow-brand-500/30 transition-colors"
                >
                    <CloudUpload className="size-4" />
                    {t("submitHomework")}
                </button>
            </div>
        </div>
    );
}

export default ProjectCard;
