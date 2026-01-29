/**
 * RecentActivityList Component
 *
 * Displays a list of recent activities with icons and timestamps.
 */

import { useTranslation } from "react-i18next";

type ActivityType = "lesson" | "level" | "content" | "track";

interface Activity {
    id: string;
    type: ActivityType;
    titleKey: string;
    title: string;
    descriptionKey: string;
    description: string;
    timeKey: string;
    time: string;
    authorKey: string;
    author: string;
}

interface RecentActivityListProps {
    activities: Activity[];
}

const activityColors: Record<ActivityType, string> = {
    lesson: "bg-success-500",
    level: "bg-warning-500",
    content: "bg-brand-500",
    track: "bg-orange-500",
};

export function RecentActivityList({ activities }: RecentActivityListProps) {
    const { t } = useTranslation();

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800">
            <h3 className="mb-6 text-base font-semibold text-gray-900 dark:text-white">
                {t("overview:overview.recentActivity.title", "Recent Activity")}
            </h3>
            <div className="space-y-4">
                {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                        <div
                            className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${activityColors[activity.type]}`}
                        />
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                {t(activity.titleKey, activity.title)}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {t(
                                    activity.descriptionKey,
                                    activity.description
                                )}
                            </p>
                            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                {t(activity.timeKey, activity.time)} •{" "}
                                {t(activity.authorKey, activity.author)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecentActivityList;
