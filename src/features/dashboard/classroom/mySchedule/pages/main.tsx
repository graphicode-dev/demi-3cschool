import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Monitor, Building2 } from "lucide-react";
import { ScheduleCalendar } from "../components";
import { MOCK_SCHEDULE_SESSIONS } from "../mocks";
import type { ScheduleSession } from "../types";

type FilterType = "all" | "online" | "offline";

export function MySchedulePage() {
    const { t } = useTranslation("mySchedule");
    const [filter, setFilter] = useState<FilterType>("all");

    const filteredSessions = MOCK_SCHEDULE_SESSIONS.filter((session) => {
        if (filter === "all") return true;
        return session.type === filter;
    });

    return (
        <div className="flex flex-col gap-6 px-4 py-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t("title")}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("description")}
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex justify-center gap-4">
                <button
                    onClick={() => setFilter("all")}
                    className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                        filter === "all"
                            ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30"
                            : "bg-white dark:bg-gray-900 text-gray-500 shadow-md hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                >
                    {t("allSessions")}
                </button>
                <button
                    onClick={() => setFilter("online")}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                        filter === "online"
                            ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30"
                            : "bg-white dark:bg-gray-900 text-gray-500 shadow-md hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                >
                    <Monitor className="size-4" />
                    {t("online")}
                </button>
                <button
                    onClick={() => setFilter("offline")}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                        filter === "offline"
                            ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30"
                            : "bg-white dark:bg-gray-900 text-gray-500 shadow-md hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                >
                    <Building2 className="size-4" />
                    {t("offline")}
                </button>
            </div>

            {/* Calendar */}
            <ScheduleCalendar sessions={filteredSessions} />
        </div>
    );
}

export default MySchedulePage;
