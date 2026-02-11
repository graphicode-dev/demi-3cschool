/**
 * CourseFilterDropdown Component
 *
 * A dropdown to filter levels by course or show all levels.
 */

import { useTranslation } from "react-i18next";

interface CourseOption {
    id: string;
    title: string;
}

interface CourseFilterDropdownProps {
    courses: CourseOption[];
    selectedCourseId: string | null;
    onChange: (courseId: string | null) => void;
    isLoading?: boolean;
    className?: string;
}

export function CourseFilterDropdown({
    courses,
    selectedCourseId,
    onChange,
    isLoading = false,
    className = "",
}: CourseFilterDropdownProps) {
    const { t } = useTranslation();

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("learning:levels.filter.chooseCourse", "Choose Course")}
            </label>
            <div className="relative">
                <select
                    value={selectedCourseId ?? "all"}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === "all") {
                            onChange("all");
                        } else {
                            onChange(value);
                        }
                    }}
                    disabled={isLoading}
                    className="block w-full px-4 py-3 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg appearance-none focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-brand-500 dark:focus:border-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <option value="all">
                        {t("learning:levels.filter.selectAll", "Select All")}
                    </option>
                    {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                            {course.title}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 end-0 flex items-center pe-3 pointer-events-none">
                    <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default CourseFilterDropdown;
