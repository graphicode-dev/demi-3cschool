import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ScheduleSession } from "../types";
import { Legend } from "./Legend";
import { SessionCard } from "./SessionCard";
import {
    formatLocalDateYYYYMMDD,
    HOURS,
    parseLocalYYYYMMDD,
    startOfWeekSunday,
} from "../utils";
import SessionInfoModal from "./SessionInfoModal";

interface ScheduleCalendarProps {
    sessions: ScheduleSession[];
}

export function ScheduleCalendar({ sessions }: ScheduleCalendarProps) {
    const { t, i18n } = useTranslation("mySchedule");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedSession, setSelectedSession] =
        useState<ScheduleSession | null>(null);

    const sessionWeekStarts = useMemo(() => {
        const unique = new Map<string, Date>();
        for (const s of sessions) {
            const d = parseLocalYYYYMMDD(s.date);
            if (!d) continue;
            const weekStart = startOfWeekSunday(d);
            const key = formatLocalDateYYYYMMDD(weekStart);
            if (!unique.has(key)) unique.set(key, weekStart);
        }
        return Array.from(unique.values()).sort(
            (a, b) => a.getTime() - b.getTime()
        );
    }, [sessions]);

    const weekDays = useMemo(() => {
        const today = new Date();
        const startOfWeek = new Date(currentDate);
        const dayOfWeek = startOfWeek.getDay();
        startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return {
                date: date.getDate(),
                dayName: t(`days.${i}`),
                fullDate: formatLocalDateYYYYMMDD(date),
                isToday: date.toDateString() === today.toDateString(),
            };
        });
    }, [currentDate, t]);

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
    }, [currentDate, i18n.language]);

    // const goToPreviousWeek = () => {
    //     const newDate = new Date(currentDate);
    //     newDate.setDate(newDate.getDate() - 7);
    //     setCurrentDate(newDate);
    // };

    // const goToNextWeek = () => {
    //     const newDate = new Date(currentDate);
    //     newDate.setDate(newDate.getDate() + 7);
    //     setCurrentDate(newDate);
    // };

    const goToCurrentWeek = () => {
        setCurrentDate(new Date());
    };

    const goToPreviousSessionWeek = () => {
        if (sessionWeekStarts.length === 0) return;
        const currentWeekStart = startOfWeekSunday(currentDate).getTime();
        let target: Date | null = null;
        for (let i = sessionWeekStarts.length - 1; i >= 0; i--) {
            const t = sessionWeekStarts[i].getTime();
            if (t < currentWeekStart) {
                target = sessionWeekStarts[i];
                break;
            }
        }
        setCurrentDate(target ?? sessionWeekStarts[0]);
    };

    const goToNextSessionWeek = () => {
        if (sessionWeekStarts.length === 0) return;
        const currentWeekStart = startOfWeekSunday(currentDate).getTime();
        let target: Date | null = null;
        for (let i = 0; i < sessionWeekStarts.length; i++) {
            const t = sessionWeekStarts[i].getTime();
            if (t > currentWeekStart) {
                target = sessionWeekStarts[i];
                break;
            }
        }
        setCurrentDate(
            target ?? sessionWeekStarts[sessionWeekStarts.length - 1]
        );
    };

    const getSessionStyle = (session: ScheduleSession) => {
        const startHour = parseInt(session.startTime.split(":")[0]);
        const startMinute = parseInt(session.startTime.split(":")[1]) || 0;
        const endHour = parseInt(session.endTime.split(":")[0]);
        const endMinute = parseInt(session.endTime.split(":")[1]) || 0;

        const startOffset = (startHour - 9) * 80 + (startMinute / 60) * 80;
        const endOffset = (endHour - 9) * 80 + (endMinute / 60) * 80;
        const height = endOffset - startOffset;

        return { top: `${startOffset}px`, height: `${Math.max(height, 80)}px` };
    };

    return (
        <>
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm p-6">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-6">
                    {/* Previous Session Button */}
                    <div className="flex items-center gap-2">
                        {/* <button
                            onClick={goToPreviousWeek}
                            className="size-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                        >
                            <ChevronLeft className="size-6 text-gray-600 dark:text-gray-400 rtl:rotate-180" />
                        </button> */}
                        <button
                            onClick={goToPreviousSessionWeek}
                            disabled={sessionWeekStarts.length === 0}
                            className="flex items-center gap-2 h-10 px-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs font-semibold text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="size-6 text-gray-600 dark:text-gray-400 rtl:rotate-180" />
                            {t("previousSession")}
                        </button>
                    </div>

                    {/* Month Display */}
                    <div className="flex items-center gap-3">
                        <span className="text-xl font-semibold text-gray-900 dark:text-white">
                            {monthYear}
                        </span>
                        <button
                            onClick={goToCurrentWeek}
                            className="h-9 px-3 rounded-full bg-brand-500 text-white transition-colors text-xs font-semibold"
                        >
                            {t("today")}
                        </button>
                    </div>

                    {/* Next Session Button */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={goToNextSessionWeek}
                            disabled={sessionWeekStarts.length === 0}
                            className="flex items-center gap-2 h-10 px-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs font-semibold text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {t("nextSession")}
                            <ChevronRight className="size-6 text-gray-600 dark:text-gray-400 rtl:rotate-180" />
                        </button>
                        {/* <button
                            onClick={goToNextWeek}
                            className="size-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                        >
                            <ChevronRight className="size-6 text-gray-600 dark:text-gray-400 rtl:rotate-180" />
                        </button> */}
                    </div>
                </div>

                {/* Week Header */}
                <div className="flex mb-4">
                    <div className="w-28 shrink-0 flex items-center">
                        <span className="text-sm text-gray-400">
                            {t("week")} ({weekRange})
                        </span>
                    </div>
                    <div className="flex-1 grid grid-cols-7">
                        {weekDays.map((day) => (
                            <div
                                key={day.fullDate}
                                className={`text-center py-2 ${
                                    day.isToday
                                        ? "text-indigo-500"
                                        : "text-gray-400"
                                }`}
                            >
                                <div className="text-xs font-normal">
                                    {day.date}
                                </div>
                                <div className="text-xs">{day.dayName}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Schedule Grid */}
                <div className="flex">
                    {/* Time Column */}
                    <div
                        className="w-28 shrink-0 relative"
                        style={{ height: `${HOURS.length * 80}px` }}
                    >
                        {HOURS.map((hour, index) => (
                            <div
                                key={hour}
                                className="absolute right-4 -translate-y-1/2 text-xs text-gray-400"
                                style={{ top: `${index * 80}px` }}
                            >
                                {hour}
                            </div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="flex-1 grid grid-cols-7 relative">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 pointer-events-none">
                            {HOURS.map((hour, index) => (
                                <div
                                    key={hour}
                                    className="absolute left-0 right-0 border-t border-gray-200 dark:border-gray-800"
                                    style={{ top: `${index * 80}px` }}
                                />
                            ))}
                        </div>

                        {/* Day Columns */}
                        {weekDays.map((day, dayIndex) => (
                            <div
                                key={day.fullDate}
                                className="relative"
                                style={{ height: `${HOURS.length * 80}px` }}
                            >
                                {/* Sessions */}
                                {sessions
                                    .filter((s) => s.date === day.fullDate)
                                    .map((session, sessionIndex) => (
                                        <SessionCard
                                            key={session.id}
                                            session={session}
                                            style={getSessionStyle(session)}
                                            onClick={() => {
                                                setSelectedSession(session);
                                            }}
                                            index={sessionIndex + 1}
                                        />
                                    ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Legend */}
            <Legend t={t} />

            {/* Session Info Modal */}
            {selectedSession && (
                <SessionInfoModal
                    session={selectedSession}
                    onClose={() => {
                        setSelectedSession(null);
                    }}
                />
            )}
        </>
    );
}

export default ScheduleCalendar;
