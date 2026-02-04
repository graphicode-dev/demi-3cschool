import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Monitor, Building2 } from "lucide-react";
import { ScheduleCalendar } from "../components";
import type { MyAllSession, ScheduleSession } from "../types";
import { useMyAllSessions } from "../api";
import PageWrapper from "@/design-system/components/PageWrapper";

type FilterType = "all" | "online" | "offline";

export function MySchedulePage() {
    const { t } = useTranslation("mySchedule");
    const [filter, setFilter] = useState<FilterType>("all");

    const { data: myAllSessions } = useMyAllSessions();

    const apiSessions: ScheduleSession[] = useMemo(() => {
        const items: MyAllSession[] = myAllSessions?.items ?? [];

        return items.map((session: MyAllSession) => {
            const date = new Date(
                `${session.sessionDate}T${session.startTime}`
            );
            const dayOfWeek = Number.isNaN(date.getTime()) ? 0 : date.getDay();

            const startTime = session.startTime.slice(0, 5);
            const endTime = session.endTime.slice(0, 5);

            return {
                id: session.id,
                title: session.lesson?.title ?? "",
                type: session.locationType,
                status: session.reason ? "cancelled" : "scheduled",
                date: session.sessionDate,
                startTime,
                endTime,
                dayOfWeek,
            };
        });
    }, [myAllSessions]);

    const allSessions = apiSessions;

    const filteredSessions = allSessions.filter((session) => {
        if (filter === "all") return true;
        return session.type === filter;
    });

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("title"),
                subtitle: t("description"),
            }}
            containerClassname="bg-transparent! border-none!"
        >
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
        </PageWrapper>
    );
}

export default MySchedulePage;
