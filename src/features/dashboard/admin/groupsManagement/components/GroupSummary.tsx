import { useTranslation } from "react-i18next";

interface GroupSummaryData {
    groupName: string;
    grade?: string;
    level: string;
    days: string[];
    startTime: string;
    endTime: string;
    capacity: number;
    locationType?: string;
}

interface GroupSummaryProps {
    data: GroupSummaryData;
    onSimilarGroupsClick?: () => void;
}

const InfoIcon = () => (
    <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
    </svg>
);

const CalendarIcon = () => (
    <svg
        className="w-5 h-5"
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

const LocationIcon = () => (
    <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
    </svg>
);

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

const ChevronUpIcon = () => (
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
            d="M5 15l7-7 7 7"
        />
    </svg>
);

export function GroupSummary({
    data,
    onSimilarGroupsClick,
}: GroupSummaryProps) {
    const { t } = useTranslation("groupsManagement");

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-brand-500 px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                    {t("groups.form.sections.summary", "Group Summary")}
                </h2>
                <button
                    type="button"
                    onClick={onSimilarGroupsClick}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-brand-500 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <UsersIcon />
                    {t("groups.form.similarGroups.button", "Similar Groups")}
                    <ChevronUpIcon />
                </button>
            </div>

            <div className="p-6">
                <div className="mb-6">
                    <div className="flex items-center gap-2 text-brand-500 mb-4">
                        <InfoIcon />
                        <span className="text-sm font-semibold uppercase tracking-wide">
                            {t(
                                "groups.form.sections.groupInformation",
                                "Group Information"
                            )}
                        </span>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {t(
                                    "groups.form.fields.groupName.label",
                                    "Group Name"
                                )}
                            </span>
                            <span className="text-sm text-gray-900 dark:text-white font-medium">
                                {data.groupName ||
                                    t("groups.form.summary.notSet", "Not set")}
                            </span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {t("groups.form.fields.grade.label", "Grade")}
                            </span>
                            <span className="text-sm text-gray-900 dark:text-white">
                                {data.grade ||
                                    t(
                                        "groups.form.summary.notSelected",
                                        "Not selected"
                                    )}
                            </span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {t("groups.form.fields.level.label", "Level")}
                            </span>
                            <span className="text-sm text-gray-900 dark:text-white">
                                {data.level ||
                                    t(
                                        "groups.form.summary.notSelected",
                                        "Not selected"
                                    )}
                            </span>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex items-center gap-2 text-brand-500 mb-4">
                        <LocationIcon />
                        <span className="text-sm font-semibold uppercase tracking-wide">
                            {t(
                                "groups.form.sections.scheduleLocation",
                                "Schedule & Location"
                            )}
                        </span>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {t(
                                    "groups.form.fields.locationType.label",
                                    "Location Type"
                                )}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-brand-500 rounded-full"></span>
                                <span className="text-sm text-gray-900 dark:text-white">
                                    {data.locationType ||
                                        t(
                                            "groups.form.summary.online",
                                            "Online"
                                        )}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {t(
                                    "groups.form.fields.capacity.label",
                                    "Max Capacity"
                                )}
                            </span>
                            <div className="flex items-center gap-2">
                                <UsersIcon />
                                <span className="text-sm text-gray-900 dark:text-white">
                                    {data.capacity}{" "}
                                    {t(
                                        "groups.form.summary.students",
                                        "students"
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="py-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400 block mb-3">
                                {t(
                                    "groups.form.fields.classSchedule.label",
                                    "Class Schedule"
                                )}
                            </span>
                            <div className="space-y-3">
                                {data.days && data.days.length > 0 ? (
                                    data.days.map((day, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <CalendarIcon />
                                                <span className="text-sm text-gray-900 dark:text-white font-medium">
                                                    {day}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                                <ClockIcon />
                                                <span className="text-sm">
                                                    {data.startTime} -{" "}
                                                    {data.endTime}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <CalendarIcon />
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {t(
                                                    "groups.form.summary.noSchedule",
                                                    "No schedule set"
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GroupSummary;
