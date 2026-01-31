import { useTranslation } from "react-i18next";

interface TrackCardProps {
    title: string;
    groups: number;
    students: number;
    avgProgress: number;
}

export function TrackCard({
    title,
    groups,
    students,
    avgProgress,
}: TrackCardProps) {
    const { t } = useTranslation("groupsAnalytics");

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 truncate">
                {title}
            </h4>
            <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                        {t("groupsAnalytics.trackCard.groups", "Groups")}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                        {groups}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                        {t("groupsAnalytics.trackCard.students", "Students")}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                        {students}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                        {t(
                            "groupsAnalytics.trackCard.avgProgress",
                            "Avg Progress"
                        )}
                    </span>
                    <span className="font-medium text-brand-500">
                        {avgProgress}%
                    </span>
                </div>
            </div>
        </div>
    );
}

export default TrackCard;
