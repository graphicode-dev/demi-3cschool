import { useTranslation } from "react-i18next";
import { SessionItem } from "./SessionItem";
import type { CourseSession } from "../types";

interface SessionListProps {
    sessions: CourseSession[];
    onStartSession?: (sessionId: number) => void;
}

export function SessionList({ sessions, onStartSession }: SessionListProps) {
    const { t } = useTranslation("selfStudy");

    const sortedSessions = [...sessions].sort((a, b) => a.order - b.order);

    return (
        <div className="flex flex-col gap-4">
            {/* Header */}
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {t("sessions.title")}
            </h2>

            {/* Sessions */}
            <div className="flex flex-col gap-2">
                {sortedSessions.map((session) => (
                    <SessionItem
                        key={session.id}
                        session={session}
                        onStart={onStartSession}
                    />
                ))}
            </div>
        </div>
    );
}

export default SessionList;
