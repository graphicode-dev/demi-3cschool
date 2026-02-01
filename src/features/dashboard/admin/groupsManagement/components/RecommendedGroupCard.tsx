import { useTranslation } from "react-i18next";

interface RecommendedGroup {
    id: string | number;
    name: string;
    studentsCount: number;
    level: string;
    grade: string;
    status: string;
    days: string;
    times: string;
}

interface RecommendedGroupCardProps {
    group: RecommendedGroup;
    onViewDetails?: (id: string) => void;
    isRecommended?: boolean;
}

const UsersIcon = () => (
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
    </svg>
);

const CalendarIcon = () => (
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
    </svg>
);

const ClockIcon = () => (
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
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
    </svg>
);

const ChevronRightIcon = () => (
    <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
        />
    </svg>
);

export function RecommendedGroupCard({
    group,
    onViewDetails,
    isRecommended = false,
}: RecommendedGroupCardProps) {
    const { t } = useTranslation("groupsManagement");

    return (
        <div
            className={`rounded-xl p-5 ${
                isRecommended
                    ? " border-2 border-brand-400 bg-brand-200/20 dark:bg-brand-900/10 shadow-sm"
                    : "border border-gray-200 dark:border-gray-700"
            }`}
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {group.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-gray-500 dark:text-gray-400 text-sm">
                        <UsersIcon />
                        <span>
                            {group.studentsCount}{" "}
                            {t("groups.form.summary.students", "students")}
                        </span>
                    </div>
                </div>
                <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rtl:rotate-180"
                    aria-label={t("groups.form.recommended.expand", "Expand")}
                >
                    <ChevronRightIcon />
                </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 text-xs bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded">
                    {group.level}
                </span>
                <span className="px-2 py-1 text-xs bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded">
                    {group.grade}
                </span>
                <span className="px-2 py-1 text-xs bg-white dark:bg-gray-800 text-brand-600 dark:text-brand-400 rounded">
                    {group.status}
                </span>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs mb-1">
                            <CalendarIcon />
                            <span>
                                {t("groups.form.fields.days.label", "Days")}
                            </span>
                        </div>
                        <p className="text-sm text-gray-900 dark:text-white">
                            {group.days}
                        </p>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs mb-1">
                            <ClockIcon />
                            <span>
                                {t("groups.form.summary.times", "Times")}
                            </span>
                        </div>
                        <p className="text-sm text-gray-900 dark:text-white">
                            {group.times}
                        </p>
                    </div>
                </div>
            </div>

            <button
                type="button"
                onClick={() => onViewDetails?.(String(group.id))}
                className={`w-full py-2.5 text-sm rounded-lg transition-colors ${
                    isRecommended
                        ? "bg-brand-500 text-white hover:bg-brand-600"
                        : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
            >
                {t("groups.form.recommended.viewDetails", "View Details")}
            </button>
        </div>
    );
}

export default RecommendedGroupCard;
