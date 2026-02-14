import { useTranslation } from "react-i18next";
import { ScheduleSession } from "../types";
import { Building2, Clock, Monitor } from "lucide-react";

interface SessionCardProps {
    session: ScheduleSession;
    style: React.CSSProperties;
    index: number;
    onClick: () => void;
}

export function SessionCard({
    session,
    style,
    index,
    onClick,
}: SessionCardProps) {
    const { t } = useTranslation("mySchedule");
    const isOnline = session.type === "online";
    const colorClass = isOnline ? "text-success-500" : "text-brand-500";
    const bgClass = isOnline ? "bg-success-50" : "bg-brand-50";
    const borderClass = isOnline ? "bg-success-500" : "bg-brand-500";

    return (
        <div
            className={`absolute left-1 right-1 ${bgClass} rounded-md overflow-hidden flex cursor-pointer hover:opacity-80 hover:scale-105 transition-all duration-200`}
            style={style}
            onClick={onClick}
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
                        {isOnline ? t("onlineSession") : t("offlineSession")}
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
