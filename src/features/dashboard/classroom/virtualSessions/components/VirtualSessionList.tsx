import { useTranslation } from "react-i18next";
import { VirtualSessionItem } from "./VirtualSessionItem";
import type { OnlineSession } from "../types";

interface SessionListProps {
    sessions: OnlineSession[];
    onStartSession?: (sessionId: number) => void;
}

export function VirtualSessionList({
    sessions,
    onStartSession,
}: SessionListProps) {
    const { t } = useTranslation("virtualSessions");

    const sortedSessions = [...sessions].sort((a, b) => {
        // Sort by session date and time
        const dateA = new Date(`${a.sessionDate}T${a.startTime}`);
        const dateB = new Date(`${b.sessionDate}T${b.startTime}`);
        return dateA.getTime() - dateB.getTime();
    });

    return (
        <div className="flex flex-col gap-4">
            {/* Header */}
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {t("sessions.title")}
            </h2>

            {/* Sessions */}
            <div className="flex flex-col gap-2">
                {sortedSessions.map((session, i) => (
                    <VirtualSessionItem
                        key={session.id}
                        index={i}
                        session={session}
                        onStart={onStartSession}
                    />
                ))}
            </div>
        </div>
    );
}

export default VirtualSessionList;
