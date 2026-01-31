import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import PageWrapper from "@/design-system/components/PageWrapper";
import { TermStepper } from "../../components";
import { VirtualSessionCard, SessionInfoModal } from "../components";
import { MOCK_VIRTUAL_SESSIONS_DATA } from "../mocks";
import type { VirtualSession } from "../types";
import { CLASSROOM_PATH } from "../../navigation/constant";

function VirtualSessionsPage() {
    const { t } = useTranslation("virtualSessions");
    const navigate = useNavigate();

    // Mock data - replace with API call
    const data = MOCK_VIRTUAL_SESSIONS_DATA;

    const [selectedTermId, setSelectedTermId] = useState<number>(
        data.currentTermId
    );
    const [selectedSession, setSelectedSession] =
        useState<VirtualSession | null>(null);
    const [showInfoModal, setShowInfoModal] = useState(false);

    const filteredSessions = data.sessions.filter(
        (session) => session.term.id === selectedTermId
    );

    const liveSessions = filteredSessions.filter((s) => s.status === "live");
    const upcomingSessions = filteredSessions.filter(
        (s) => s.status === "upcoming"
    );
    const completedSessions = filteredSessions.filter(
        (s) => s.status === "completed"
    );

    const handleJoinSession = (session: VirtualSession) => {
        if (session.linkMeeting) {
            window.open(session.linkMeeting, "_blank");
        }
    };

    const handleViewInfo = (session: VirtualSession) => {
        setSelectedSession(session);
        setShowInfoModal(true);
    };

    const handleViewRecording = (session: VirtualSession) => {
        navigate(`${CLASSROOM_PATH}/virtual-sessions/recording/${session.id}`);
    };

    const handleRemindMe = (session: VirtualSession) => {
        // TODO: Implement reminder functionality
        console.log("Remind me for session:", session.id);
        setShowInfoModal(false);
    };

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("title"),
                subtitle: t("description"),
            }}
        >
            {/* Term Stepper */}
            <TermStepper
                terms={data.terms}
                selectedTermId={selectedTermId}
                onTermSelect={setSelectedTermId}
                translationNamespace="virtualSessions"
            />

            {/* Current Live Sessions */}
            {liveSessions.length > 0 && (
                <section className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t("sections.currentLive")}
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        {liveSessions.map((session) => (
                            <VirtualSessionCard
                                key={session.id}
                                session={session}
                                onJoinSession={handleJoinSession}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Upcoming Sessions */}
            {upcomingSessions.length > 0 && (
                <section className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t("sections.upcoming")}
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        {upcomingSessions.map((session) => (
                            <VirtualSessionCard
                                key={session.id}
                                session={session}
                                onViewInfo={handleViewInfo}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Completed Sessions */}
            {completedSessions.length > 0 && (
                <section className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t("sections.completed")}
                        </h2>
                        <button className="flex items-center gap-1 text-sm font-medium text-warning-500 hover:text-warning-600 transition-colors">
                            {t("session.viewAllHistory")}
                            <ChevronRight className="size-4" />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {completedSessions.slice(0, 4).map((session) => (
                            <VirtualSessionCard
                                key={session.id}
                                session={session}
                                onViewRecording={handleViewRecording}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Session Info Modal */}
            {selectedSession && (
                <SessionInfoModal
                    session={selectedSession}
                    isOpen={showInfoModal}
                    onClose={() => setShowInfoModal(false)}
                    onRemindMe={handleRemindMe}
                />
            )}
        </PageWrapper>
    );
}

export default VirtualSessionsPage;
