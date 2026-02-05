import { useTranslation } from "react-i18next";
import {
    Eye,
    Star,
    FileText,
    PenSquare,
    Clock,
    CheckCircle,
} from "lucide-react";
import type { Project, ProjectStatus } from "../types";

interface ProjectCardProps {
    project: Project;
    onViewHomework?: (projectId: number) => void;
    onSubmit?: (projectId: number) => void;
    onViewResults?: (projectId: number) => void;
}

const statusConfig: Record<
    ProjectStatus,
    {
        labelKey: string;
        bgColor: string;
        textColor: string;
        icon: React.ElementType;
    }
> = {
    new: {
        labelKey: "status.new",
        bgColor: "bg-brand-500/10",
        textColor: "text-brand-500",
        icon: PenSquare,
    },
    under_review: {
        labelKey: "status.underReview",
        bgColor: "bg-warning-500/10",
        textColor: "text-warning-500",
        icon: Clock,
    },
    reviewed: {
        labelKey: "status.reviewed",
        bgColor: "bg-success-500/10",
        textColor: "text-success-500",
        icon: CheckCircle,
    },
    completed: {
        labelKey: "status.completed",
        bgColor: "bg-success-500/10",
        textColor: "text-success-500",
        icon: CheckCircle,
    },
};

export function ProjectCard({
    project,
    onViewHomework,
    onSubmit,
    onViewResults,
}: ProjectCardProps) {
    const { t } = useTranslation("projects");
    const status = statusConfig[project.status];
    const StatusIcon = status.icon;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-theme-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Left Section: Icon + Content */}
                <div className="flex gap-4 items-start">
                    {/* File Icon */}
                    <div className="shrink-0 size-14 rounded-2xl bg-brand-500/15 flex items-center justify-center shadow-sm">
                        <FileText className="size-7 text-brand-500" />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-1 min-w-0">
                        {/* Tags Row */}
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Lesson Tag */}
                            {/* <span className="inline-flex items-center px-3 py-1 rounded-lg bg-brand-500/10 text-brand-500 text-sm font-semibold">
                                Lesson {project.lessonOrder}:{" "}
                                {project.lessonTitle}
                            </span> */}

                            {/* Status Tag */}
                            <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${status.bgColor} ${status.textColor} text-sm font-semibold`}
                            >
                                <StatusIcon className="size-4" />
                                {t(status.labelKey)}
                            </span>
                        </div>

                        {/* Project Title */}
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {project.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {project.description}
                        </p>
                    </div>
                </div>

                {/* Right Section: Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 sm:self-center">
                    {/* View Homework Button */}
                    <button
                        onClick={() => onViewHomework?.(project.id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <Eye className="size-4" />
                        {t("viewHomework")}
                    </button>

                    {/* Conditional Button based on status */}
                    {project.status === "new" ? (
                        <button
                            onClick={() => onSubmit?.(project.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold shadow-md shadow-brand-500/25 transition-colors"
                        >
                            {t("submitHomework")}
                            <span className="text-xs">→</span>
                        </button>
                    ) : project.status === "completed" ? (
                        <button
                            disabled
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success-500 text-white text-sm font-bold cursor-default"
                        >
                            <CheckCircle className="size-4" />
                            {t("status.completed", "Completed")}
                        </button>
                    ) : (
                        <button
                            onClick={() => onViewResults?.(project.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-warning-500 hover:bg-warning-600 text-white text-sm font-bold shadow-md shadow-warning-500/25 transition-colors"
                        >
                            <Star className="size-4" />
                            {t("results")}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProjectCard;
