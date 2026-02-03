import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { SessionList, TermStepper, CourseCard } from "../components";
import { useOnlineSessions } from "../api";
import { selfStudyPaths } from "../navigation";
import PageWrapper from "@/design-system/components/PageWrapper";
import { useProgramsCurriculumList } from "@/features/dashboard/admin/programs/api";
import type {
    TermStatus,
    OnlineSession,
    CourseSession,
    Course,
} from "../types";
import type { Term } from "../../components/TermStepper";

function SelfStudyPage() {
    const { t } = useTranslation("selfStudy");
    const navigate = useNavigate();

    // Fetch curriculum list for term stepper
    const { data: curriculumData, isLoading: isLoadingCurriculum } =
        useProgramsCurriculumList();

    // State
    const [selectedCurriculumId, setSelectedCurriculumId] = useState<
        number | undefined
    >(undefined);

    // API returns array directly
    const curriculums = curriculumData ?? [];

    // Auto-select first active curriculum if none selected
    if (!selectedCurriculumId && curriculums.length > 0) {
        const activeCurriculum = curriculums.find((c) => c.isActive);
        if (activeCurriculum) {
            setSelectedCurriculumId(activeCurriculum.id);
        } else if (curriculums[0]) {
            setSelectedCurriculumId(curriculums[0].id);
        }
    }

    // Build terms from curriculum data - locked if not active
    const terms: Term[] = useMemo(() => {
        if (!curriculums.length) return [];

        return curriculums.map((curriculum, index) => {
            const isActive = Boolean(curriculum.isActive);

            // If not active, it's locked. Otherwise it's current (clickable)
            const status: TermStatus = isActive ? "current" : "locked";

            return {
                id: curriculum.id,
                name: curriculum.name,
                order: index + 1,
                status,
            };
        });
    }, [curriculums]);

    // Fetch online sessions for selected curriculum
    const { data: sessions, isLoading: isLoadingSessions } = useOnlineSessions(
        selectedCurriculumId,
        { enabled: !!selectedCurriculumId }
    );

    // Transform OnlineSession[] to CourseSession[] for SessionList component
    const courseSessions: CourseSession[] = useMemo(() => {
        if (!sessions) return [];

        return sessions.map((session, index) => ({
            id: session.id,
            courseId: selectedCurriculumId ?? 0,
            title: session.lesson.title,
            description: session.group?.name,
            type: session.locationType,
            order: index + 1,
            status: index === 0 ? "current" : "locked",
            location: session.offlineLocation ?? undefined,
            // Store lesson ID for navigation
            _lessonId: session.lesson.id,
        }));
    }, [sessions, selectedCurriculumId]);

    // Build course data for CourseCard
    const selectedCourse: Course | null = useMemo(() => {
        if (!selectedCurriculumId || !curriculums.length) return null;

        const curriculum = curriculums.find(
            (c) => c.id === selectedCurriculumId
        );
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
            title: curriculum.name,
            description: curriculum.caption,
            onlineSessionsCount: onlineCount,
            offlineSessionsCount: offlineCount,
            sessions: courseSessions,
        };
    }, [selectedCurriculumId, curriculums, courseSessions]);

    const handleTermSelect = (termId: number) => {
        const term = terms.find((t) => t.id === termId);
        if (term && term.status !== "locked") {
            setSelectedCurriculumId(termId);
        }
    };

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
        <PageWrapper>
            <div className="flex flex-col gap-6 max-w-4xl mx-auto px-6 py-6">
                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {t("title")}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t("description")}
                    </p>
                </div>

                {/* Term Progress Stepper */}
                {terms.length > 0 && (
                    <TermStepper
                        terms={terms}
                        selectedTermId={selectedCurriculumId ?? 0}
                        onTermSelect={handleTermSelect}
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
                    <SessionList
                        sessions={courseSessions}
                        onStartSession={handleStartSession}
                    />
                )}
            </div>
        </PageWrapper>
    );
}

export default SelfStudyPage;
