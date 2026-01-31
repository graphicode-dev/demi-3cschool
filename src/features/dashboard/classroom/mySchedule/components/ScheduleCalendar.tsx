import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import type { ScheduleSession } from "../types";

interface ScheduleCalendarProps {
    sessions: ScheduleSession[];
}

const HOURS = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function ScheduleCalendar({ sessions }: ScheduleCalendarProps) {
    const { t } = useTranslation("mySchedule");
    const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 16)); // October 16, 2026

    const weekDays = useMemo(() => {
        const startOfWeek = new Date(currentDate);
        const dayOfWeek = startOfWeek.getDay();
        startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return {
                date: date.getDate(),
                dayName: DAY_NAMES[i],
                fullDate: date.toISOString().split("T")[0],
                isToday: date.toDateString() === currentDate.toDateString(),
            };
        });
    }, [currentDate]);

    const weekRange = useMemo(() => {
        const start = weekDays[0].date;
        const end = weekDays[6].date;
        return `${start} - ${end}`;
    }, [weekDays]);

    const monthYear = useMemo(() => {
        return currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
        });
    }, [currentDate]);

    const goToPreviousWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentDate(newDate);
    };

    const goToNextWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentDate(newDate);
    };

    const getSessionStyle = (session: ScheduleSession) => {
        const startHour = parseInt(session.startTime.split(":")[0]);
        const endHour = parseInt(session.endTime.split(":")[0]);
        const top = (startHour - 9) * 48; // 48px per hour
        const height = (endHour - startHour) * 48;

        return { top: `${top}px`, height: `${height}px` };
    };

    const getSessionColor = (session: ScheduleSession) => {
        if (session.status === "cancelled") {
            return "bg-error-100 dark:bg-error-500/20 border-l-4 border-error-500";
        }
        if (session.type === "online") {
            return "bg-success-100 dark:bg-success-500/20 border-l-4 border-success-500";
        }
        return "bg-brand-100 dark:bg-brand-500/20 border-l-4 border-brand-500";
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-theme-sm overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                {/* Month Navigation */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={goToPreviousWeek}
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <ChevronLeft className="size-5 text-gray-500" />
                    </button>
                    <span className="text-xl font-semibold text-gray-900 dark:text-white">
                        {monthYear}
                    </span>
                    <button
                        onClick={goToNextWeek}
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <ChevronRight className="size-5 text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Week Header */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
                <div className="w-20 p-2 text-xs text-gray-400">
                    {t("week")} ({weekRange})
                </div>
                {weekDays.map((day) => (
                    <div
                        key={day.fullDate}
                        className={`flex-1 p-2 text-center ${
                            day.isToday ? "text-brand-500" : "text-gray-400"
                        }`}
                    >
                        <div className="text-sm font-semibold">{day.date}</div>
                        <div className="text-xs">{day.dayName}</div>
                    </div>
                ))}
            </div>

            {/* Schedule Grid */}
            <div className="flex max-h-[400px] overflow-y-auto">
                {/* Time Column */}
                <div className="w-20 shrink-0">
                    {HOURS.map((hour) => (
                        <div
                            key={hour}
                            className="h-12 flex items-start justify-end pr-2 text-xs text-gray-400"
                        >
                            {hour}
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="flex-1 flex">
                    {weekDays.map((day, dayIndex) => (
                        <div
                            key={day.fullDate}
                            className="flex-1 relative border-l border-gray-100 dark:border-gray-800"
                        >
                            {/* Hour Lines */}
                            {HOURS.map((hour) => (
                                <div
                                    key={hour}
                                    className="h-12 border-b border-gray-100 dark:border-gray-800"
                                />
                            ))}

                            {/* Sessions */}
                            {sessions
                                .filter((s) => s.dayOfWeek === dayIndex)
                                .map((session) => (
                                    <div
                                        key={session.id}
                                        className={`absolute left-1 right-1 rounded-md p-1 ${getSessionColor(session)}`}
                                        style={getSessionStyle(session)}
                                    >
                                        <p className="text-[10px] font-bold text-gray-900 dark:text-white truncate">
                                            {session.title}
                                        </p>
                                        <div className="flex items-center gap-1 text-[9px] text-gray-500">
                                            <Clock className="size-2.5" />
                                            {session.startTime} -{" "}
                                            {session.endTime}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full bg-success-500" />
                    <span className="text-xs text-gray-500">
                        {t("onlineSession")}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full bg-brand-500" />
                    <span className="text-xs text-gray-500">
                        {t("offlineCenter")}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full bg-error-500" />
                    <span className="text-xs text-gray-500">
                        {t("cancelled")}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default ScheduleCalendar;
