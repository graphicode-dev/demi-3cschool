import { Calendar, Clock, User, MapPin, Monitor, Users } from "lucide-react";

interface GroupSchedule {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
}

interface GroupCardProps {
    name: string;
    levelTitle?: string;
    gradeName?: string;
    programCaption?: string;
    locationType?: "online" | "offline" | string;
    trainerName?: string;
    schedules?: GroupSchedule[];
    maxCapacity?: number;
    enrolledCount?: number;
    sessionCount?: number;
    totalSessions?: number;
    isActive?: boolean;
    upcomingSession?: {
        name: string;
        dayOfWeek: string;
        date: string;
        endDate?: string;
    };
}

const formatTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
};

const capitalizeFirst = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const GroupCard = ({
    name,
    levelTitle,
    gradeName,
    programCaption,
    locationType,
    trainerName,
    schedules = [],
    maxCapacity = 0,
    enrolledCount = 0,
    sessionCount = 0,
    totalSessions = 0,
    isActive = true,
    upcomingSession,
}: GroupCardProps) => {
    const firstSchedule = schedules[0];
    const capacityPercentage =
        maxCapacity > 0 ? (enrolledCount / maxCapacity) * 100 : 0;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow h-full flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {gradeName && levelTitle
                                ? `${gradeName} • ${levelTitle}`
                                : gradeName || levelTitle || "-"}
                        </span>
                        {programCaption && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                                {programCaption}
                            </span>
                        )}
                    </div>
                </div>
                <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                        isActive
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                >
                    {isActive ? "Available" : "Unavailable"}
                </span>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Day */}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>
                        {firstSchedule?.dayOfWeek
                            ? capitalizeFirst(firstSchedule.dayOfWeek)
                            : "-"}
                    </span>
                </div>

                {/* Time */}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>
                        {firstSchedule?.startTime && firstSchedule?.endTime
                            ? `${formatTime(firstSchedule.startTime)} - ${formatTime(firstSchedule.endTime)}`
                            : "-"}
                    </span>
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>{trainerName || "No trainer"}</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    {locationType === "online" ? (
                        <Monitor className="w-4 h-4 text-gray-400" />
                    ) : (
                        <MapPin className="w-4 h-4 text-gray-400" />
                    )}
                    <span>
                        {locationType ? capitalizeFirst(locationType) : "-"}
                    </span>
                </div>
            </div>

            {/* Session & Capacity */}
            <div className="space-y-3 mb-4 mt-auto">
                {/* Session */}
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Monitor className="w-4 h-4 text-gray-400" />
                        <span>Session</span>
                    </div>
                    <span className="text-gray-900 dark:text-white font-medium">
                        {sessionCount}/{totalSessions}
                    </span>
                </div>

                {/* Capacity */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span>Capacity</span>
                        </div>
                        <span className="text-gray-900 dark:text-white font-medium">
                            {enrolledCount}/{maxCapacity}
                        </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-brand-500 rounded-full transition-all"
                            style={{
                                width: `${Math.min(capacityPercentage, 100)}%`,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Upcoming Session */}
            {upcomingSession && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        Up Coming Session
                    </p>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                            {upcomingSession.name}
                        </h4>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>
                                    {capitalizeFirst(upcomingSession.dayOfWeek)}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{upcomingSession.date}</span>
                            </div>
                            {upcomingSession.endDate && (
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{upcomingSession.endDate}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupCard;
