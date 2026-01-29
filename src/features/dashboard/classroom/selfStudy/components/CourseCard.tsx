import { useTranslation } from "react-i18next";
import { Monitor, Building2 } from "lucide-react";
import type { Course } from "../types";

interface CourseCardProps {
    course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
    const { t } = useTranslation("selfStudy");

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-theme-sm border-l-8 border-brand-500 px-6 py-4">
            {/* Header */}
            <p className="text-brand-500 font-semibold text-sm uppercase tracking-wide mb-1">
                {t("course.unifiedCourse")}
            </p>

            {/* Content */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2 max-w-md">
                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {course.title}
                    </h2>

                    {/* Description */}
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                        {t("course.courseDescription")}
                    </p>
                </div>

                {/* Session Counts */}
                <div className="flex items-center gap-3">
                    {/* Online Sessions */}
                    <div className="flex items-center gap-1.5 bg-brand-50 dark:bg-brand-500/10 px-3 py-1.5 rounded-full">
                        <Monitor className="size-4 text-brand-500" />
                        <span className="text-brand-500 font-semibold text-sm">
                            {course.onlineSessionsCount} {t("course.online")}
                        </span>
                    </div>

                    {/* Offline Sessions */}
                    <div className="flex items-center gap-1.5 bg-warning-50 dark:bg-warning-500/10 px-3 py-1.5 rounded-full">
                        <Building2 className="size-4 text-warning-500" />
                        <span className="text-warning-500 font-semibold text-sm">
                            {course.offlineSessionsCount} {t("course.offline")}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseCard;
