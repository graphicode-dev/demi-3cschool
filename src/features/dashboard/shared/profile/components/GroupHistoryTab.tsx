/**
 * Group History Tab Component
 */

import { useTranslation } from "react-i18next";
import { Users } from "lucide-react";
import type { GroupHistoryItem } from "../types/profile.types";

interface GroupHistoryTabProps {
    groupHistory: GroupHistoryItem[];
}

export default function GroupHistoryTab({
    groupHistory,
}: GroupHistoryTabProps) {
    const { t } = useTranslation("profile");

    return (
        <div className="rounded-b-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            {/* Header */}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                {t("profile.groups.title", "Group History")}
            </h2>

            {/* Timeline */}
            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

                {/* Items */}
                <div className="space-y-6">
                    {groupHistory.map((item, index) => (
                        <div
                            key={item.id}
                            className="relative flex items-start gap-4"
                        >
                            {/* Circle */}
                            <div
                                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                    item.status === "current"
                                        ? "bg-brand-500"
                                        : "bg-gray-200 dark:bg-gray-700"
                                }`}
                            >
                                <Users
                                    className={`w-5 h-5 ${
                                        item.status === "current"
                                            ? "text-white"
                                            : "text-gray-500 dark:text-gray-400"
                                    }`}
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium text-gray-900 dark:text-white">
                                            {item.groupName}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                            {item.period}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {t(
                                                "profile.groups.instructor",
                                                "Instructor"
                                            )}
                                            : {item.instructor}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            item.status === "current"
                                                ? "bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400"
                                                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                        }`}
                                    >
                                        {t(
                                            `profile.groups.${item.status}`,
                                            item.status
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
