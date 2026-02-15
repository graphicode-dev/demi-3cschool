import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { SelfStudySessionList, TermStepper, CourseCard } from "../components";
import { useMySessions } from "../api";
import { selfStudyPaths } from "../navigation";
import { PageWrapper } from "@/design-system";
import { useCurriculumTerms } from "../../components/TermStepper";
import type { CourseSession, Course } from "../types";

function SelfStudyPage() {
    const { t } = useTranslation("selfStudy");
    const navigate = useNavigate();

    const {
        curriculums,
        isLoadingCurriculum,
        selectedTermId,
        setSelectedTermId,
        terms,
    } = useCurriculumTerms();

    // Fetch online sessions for selected curriculum
    const { data: sessions, isLoading: isLoadingSessions } = useMySessions(
        selectedTermId,
        { enabled: !!selectedTermId }
    );

    // Transform OnlineSession[] to CourseSession[] for SessionList component
    const courseSessions: CourseSession[] = useMemo(() => {
        if (!sessions) return [];

        return sessions.map((session, index) => ({
            id: session.id,
            courseId: selectedTermId ?? 0,
            title: session.lesson.title,
            description: session.group?.name,
            type: session.locationType,
            order: index + 1,
            status: index === 0 ? "current" : "locked",
            location: session.offlineLocation ?? undefined,
            // Store lesson ID for navigation
            _lessonId: session.lesson.id,
        }));
    }, [sessions, selectedTermId]);

    // Build course data for CourseCard
    const selectedCourse: Course | null = useMemo(() => {
        if (!selectedTermId || !curriculums.length) return null;

        const curriculum = curriculums.find((c) => c.id === selectedTermId);
        if (!curriculum) return null;

        const onlineCount = courseSessions.filter(
            (s) => s.type === "online"
        ).length;
        const offlineCount = courseSessions.filter(
            (s) => s.type === "offline"
        ).length;

        return {
            id: curriculum.id,
            termId: curriculum.id,
            title: curriculum.caption,
            description: curriculum.caption,
            onlineSessionsCount: onlineCount,
            offlineSessionsCount: offlineCount,
            sessions: courseSessions,
        };
    }, [selectedTermId, curriculums, courseSessions]);

    const handleStartSession = (sessionId: number) => {
        // Find the session to get the lesson ID
        const session = sessions?.find((s) => s.id === sessionId);
        if (session) {
            navigate(selfStudyPaths.lesson(session.lesson.id));
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
            {/* Term Progress Stepper */}
            {terms.length > 0 && (
                <TermStepper
                    terms={terms}
                    selectedTermId={selectedTermId}
                    onSelectTerm={setSelectedTermId}
                    tipText={t("termStepper")}
                />
            )}

            {/* Course Card */}
            {selectedCourse && <CourseCard course={selectedCourse} />}

            {/* Sessions List */}
            {isLoadingSessions ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="size-6 animate-spin text-brand-500" />
                </div>
            ) : (
                <SelfStudySessionList
                    sessions={courseSessions}
                    onStartSession={handleStartSession}
                />
            )}
        </PageWrapper>
    );
}

export default SelfStudyPage;
