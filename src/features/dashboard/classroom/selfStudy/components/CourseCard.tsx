import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Monitor, Building2, ChevronDown } from "lucide-react";
import type { Course } from "../types";

interface CourseCardProps {
    course: Course;
    defaultExpanded?: boolean;
}

export function CourseCard({
    course,
    defaultExpanded = true,
}: CourseCardProps) {
    const { t } = useTranslation("selfStudy");
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);
    const contentRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState<number | undefined>(
        undefined
    );

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    }, [course]);

    const toggleExpand = () => {
        setIsExpanded((prev) => !prev);
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-theme-sm border-l-8 border-brand-500 px-6 py-4">
            {/* Header - Always visible, clickable */}
            <div
                className="flex items-center justify-between cursor-pointer select-none"
                onClick={toggleExpand}
            >
                <div className="flex items-center gap-3">
                    <p className="text-brand-500 font-semibold text-sm uppercase tracking-wide">
                        {t("course.unifiedCourse")}
                    </p>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {course.title}
                    </h2>
                </div>
                <ChevronDown
                    className={`size-5 text-gray-400 transition-transform duration-300 ease-in-out ${
                        isExpanded ? "rotate-180" : "rotate-0"
                    }`}
                />
            </div>

            {/* Collapsible Content */}
            <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                    maxHeight: isExpanded ? contentHeight : 0,
                    opacity: isExpanded ? 1 : 0,
                }}
            >
                <div ref={contentRef} className="pt-4">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-2 max-w-md">
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
                                    {course.onlineSessionsCount}{" "}
                                    {t("course.online")}
                                </span>
                            </div>

                            {/* Offline Sessions */}
                            <div className="flex items-center gap-1.5 bg-warning-50 dark:bg-warning-500/10 px-3 py-1.5 rounded-full">
                                <Building2 className="size-4 text-warning-500" />
                                <span className="text-warning-500 font-semibold text-sm">
                                    {course.offlineSessionsCount}{" "}
                                    {t("course.offline")}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseCard;
