import { memo } from "react";
import { useTranslation } from "react-i18next";
import { User, Calendar, Clock } from "lucide-react";
import { GroupStudent } from "../types";

interface StudentSelectCardProps {
    student: GroupStudent;
    onSelect: (studentId: string) => void;
}

const CourseIcon = () => (
    <svg
        className="w-4 h-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
    </svg>
);

export const StudentSelectCard = memo(function StudentSelectCard({
    student,
    onSelect,
}: StudentSelectCardProps) {
    const { t } = useTranslation("groupsManagement");

    console.log("Student: ", student);

    return (
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-brand-300 dark:hover:border-brand-600 transition-colors">
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="flex items-center justify-center w-10 h-10 bg-brand-100 dark:bg-brand-900/30 rounded-full">
                    <User className="w-5 h-5 text-brand-500" />
                </div>

                {/* Student Info */}
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {student.student.name}
                        </span>
                        <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                student.status === "active"
                                    ? "bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400"
                                    : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                            }`}
                        >
                            {student.status === "active"
                                ? t("groups.view.active", "Active")
                                : t("groups.view.inactive", "Inactive")}
                        </span>
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                            {/* {t("groups.assignStudent.age", "Age")} {student.age} */}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <CourseIcon />
                        {/* <span>{student.course}</span> */}
                    </div>
                </div>
            </div>

            {/* Schedule Info */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {/* <span>{student.days}</span> */}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    {/* <span>{student.timeSlot}</span> */}
                </div>

                {/* Select Button */}
                <button
                    type="button"
                    onClick={() => onSelect(student.id)}
                    className="px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors"
                >
                    {t("groups.assignStudent.select", "Select")}
                </button>
            </div>
        </div>
    );
});

export default StudentSelectCard;
