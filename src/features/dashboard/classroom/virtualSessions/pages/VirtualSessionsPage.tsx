import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Loader2 } from "lucide-react";
import PageWrapper from "@/design-system/components/PageWrapper";
import { TermStepper } from "../../components";
import { VirtualSessionCard, SessionInfoModal } from "../components";
import { useOnlineSessions } from "../api";
import type { VirtualSession } from "../types";
import { CLASSROOM_PATH } from "../../navigation/constant";
import { useCurriculumTerms } from "../../components/TermStepper";
import type { OnlineSession } from "../types";

function VirtualSessionsPage() {
    const { t } = useTranslation("virtualSessions");
    const navigate = useNavigate();

    const {
        curriculums,
        isLoadingCurriculum,
        selectedTermId,
        setSelectedTermId,
        terms,
    } = useCurriculumTerms();

    const {
        data: onlineSessions,
        isLoading: isLoadingSessions,
        isError,
    } = useOnlineSessions(selectedTermId, {
        enabled: !!selectedTermId,
    });

    const sessions: VirtualSession[] = useMemo(() => {
        const list = onlineSessions ?? [];

        const mapStatus = (
            status: string
        ): "current" | "upcoming" | "completed" => {
            const s = status.toLowerCase();
            if (s.includes("current") || s.includes("running")) return "current";
            if (s.includes("complete") || s.includes("ended"))
                return "completed";
            return "upcoming";
        };

        return list.map((session: OnlineSession) => ({
            id: session.id,
            group: {
                id: session.group.id,
                name: session.group.name,
                locationType: session.locationType,
            },
            course: {
                id: Number(selectedTermId ?? 0),
                title: session.group.name,
            },
            term: {
                id: Number(selectedTermId ?? 0),
                name:
                    curriculums.find((c) => c.id === selectedTermId)?.name ??
                    "",
            },
            sessionDate: session.sessionDate,
            startTime: session.startTime,
            endTime: session.endTime,
            topic: session.lesson.title,
            lesson: {
                id: session.lesson.id,
                title: session.lesson.title,
            },
            description: session.group.name,
            isCancelled: Boolean(session.reason),
            cancellationReason: session.reason,
            meetingProvider: "bbb",
            meetingId: session.bbbMeetingId ?? "",
            linkMeeting: session.hasMeeting ? (session.bbbMeetingId ?? "") : "",
            recordingUrl: undefined,
            contentProgress: {
                total: {
                    totalContents: 0,
                    completedContents: 0,
                    totalProgressPercentage: 0,
                },
                items: [],
            },
            instructor: {
                id: session.teacher?.id ?? 0,
                name: session.teacher?.name ?? "",
                course: session.group.name,
            },
            duration: undefined,
            timezone: undefined,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
            status: mapStatus(session.sessionState),
        }));
    }, [onlineSessions, selectedTermId, curriculums]);

    const [selectedSession, setSelectedSession] =
        useState<VirtualSession | null>(null);
    const [showInfoModal, setShowInfoModal] = useState(false);

    const liveSessions = sessions.filter((s) => s.status === "current");
    const upcomingSessions = sessions.filter((s) => s.status === "upcoming");
    const completedSessions = sessions.filter((s) => s.status === "completed");

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
                translationNamespace="virtualSessions"
                terms={terms}
                selectedTermId={selectedTermId}
                onSelectTerm={setSelectedTermId}
            />

            {(isLoadingCurriculum || isLoadingSessions) && (
                <div className="flex justify-center py-10">
                    <Loader2 className="size-6 animate-spin text-brand-500" />
                </div>
            )}

            {isError && (
                <div className="text-center py-10 text-red-500">
                    {t("errors.loadFailed", "Failed to load sessions")}
                </div>
            )}

            {!isLoadingCurriculum &&
                !isLoadingSessions &&
                !isError &&
                sessions.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        {t("empty", "No sessions available")}
                    </div>
                )}

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
