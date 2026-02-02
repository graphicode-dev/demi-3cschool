import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
    ChevronLeft,
    ChevronRight,
    Monitor,
    Building2,
    Clock,
} from "lucide-react";
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
                    <button
                        onClick={goToPreviousWeek}
                        className="size-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                    >
                        <ChevronLeft className="size-6 text-gray-600 dark:text-gray-400" />
                    </button>
                    <span className="text-xl font-semibold text-gray-900 dark:text-white">
                        {monthYear}
                    </span>
                    <button
                        onClick={goToNextWeek}
                        className="size-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                    >
                        <ChevronRight className="size-6 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Week Header */}
                <div className="flex mb-4">
                    <div className="w-28 shrink-0 flex items-center">
                        <span className="text-sm text-gray-400">
                            Week ({weekRange})
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
                                    .filter((s) => s.dayOfWeek === dayIndex)
                                    .map((session, sessionIndex) => (
                                        <SessionCard
                                            key={session.id}
                                            session={session}
                                            style={getSessionStyle(session)}
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
        </>
    );
}

interface SessionCardProps {
    session: ScheduleSession;
    style: React.CSSProperties;
    index: number;
}

function SessionCard({ session, style, index }: SessionCardProps) {
    const isOnline = session.type === "online";
    const colorClass = isOnline ? "text-success-500" : "text-brand-500";
    const bgClass = isOnline ? "bg-success-50" : "bg-brand-50";
    const borderClass = isOnline ? "bg-success-500" : "bg-brand-500";

    return (
        <div
            className={`absolute left-1 right-1 ${bgClass} rounded-md overflow-hidden flex`}
            style={style}
        >
            {/* Left Border */}
            <div className={`w-1.5 shrink-0 ${borderClass}`} />

            {/* Content */}
            <div className="flex-1 p-2 flex flex-col gap-1">
                {/* Session Type */}
                <div className={`flex items-center gap-2 ${colorClass}`}>
                    {isOnline ? (
                        <Monitor className="size-4" />
                    ) : (
                        <Building2 className="size-4" />
                    )}
                    <span className="text-xs font-bold">
                        {isOnline ? "Online Session" : "Offline Session"}
                    </span>
                </div>

                {/* Title */}
                <p className={`text-xs font-medium ${colorClass}`}>
                    {index}. {session.title}
                </p>

                {/* Time */}
                <div className={`flex items-center gap-1 ${colorClass}`}>
                    <Clock className="size-3" />
                    <span className="text-[10px]">
                        {session.startTime} - {session.endTime}
                    </span>
                </div>
            </div>
        </div>
    );
}

interface LegendProps {
    t: (key: string) => string;
}

function Legend({ t }: LegendProps) {
    return (
        <div className="w-fit mx-auto mt-6 p-4 bg-white dark:bg-gray-900 rounded-3xl shadow-sm flex justify-center gap-8">
            <div className="flex items-center gap-2">
                <div className="size-2.5 rounded-full bg-success-500" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {t("onlineSession")}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <div className="size-2.5 rounded-full bg-brand-500" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {t("offlineCenter")}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <div className="size-2.5 rounded-full bg-error-500" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {t("cancelled")}
                </span>
            </div>
        </div>
    );
}

export default ScheduleCalendar;
