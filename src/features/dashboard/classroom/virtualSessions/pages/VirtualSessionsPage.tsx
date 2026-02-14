import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { PageWrapper } from "@/design-system";
import { TermStepper } from "../../components";
import { VirtualSessionList } from "../components";
import { useOnlineSessions } from "../api";
import type { OnlineSession } from "../types";
import { useCurriculumTerms } from "../../components/TermStepper";

function VirtualSessionsPage() {
    const { t } = useTranslation("virtualSessions");
    const navigate = useNavigate();

    const { isLoadingCurriculum, selectedTermId, setSelectedTermId, terms } =
        useCurriculumTerms();

    // Fetch online sessions for selected curriculum
    const { data: onlineSessions, isLoading: isLoadingSessions } =
        useOnlineSessions(selectedTermId, {
            enabled: !!selectedTermId,
        });

    // Use original OnlineSession array for VirtualSessionList component
    const sessions: OnlineSession[] = onlineSessions ?? [];

    const handleStartSession = (sessionId: number) => {
        const session = sessions.find((s) => s.id === sessionId);
        if (session) {
            if (
                session.sessionState === "current" &&
                session.zoomMeeting?.meetingUrl
            ) {
                window.open(session.zoomMeeting.meetingUrl, "_blank");
            } else if (session.sessionState === "completed") {
                // Navigate to recording page
                navigate(`/classroom/virtual-sessions/recording/${session.id}`);
            } else if (session.sessionState === "upcoming") {
                // For upcoming sessions, could show info modal or disable action
                console.log("Session is upcoming:", session.id);
            }
        }
    };

    if (isLoadingCurriculum) {
        return (
            <PageWrapper>
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="size-8 animate-spin text-brand-500" />
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("title"),
                subtitle: t("description"),
            }}
        >
            <div className="flex flex-col gap-6 max-w-4xl mx-auto px-6 py-6">
                {/* Term Progress Stepper */}
                {terms.length > 0 && (
                    <TermStepper
                        terms={terms}
                        selectedTermId={selectedTermId}
                        onSelectTerm={setSelectedTermId}
                    />
                )}

                {/* Sessions List */}
                {isLoadingSessions ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="size-6 animate-spin text-brand-500" />
                    </div>
                ) : sessions.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                        {t("empty")}
                    </div>
                ) : (
                    <VirtualSessionList
                        sessions={sessions}
                        onStartSession={handleStartSession}
                    />
                )}
            </div>
        </PageWrapper>
    );
}

export default VirtualSessionsPage;
