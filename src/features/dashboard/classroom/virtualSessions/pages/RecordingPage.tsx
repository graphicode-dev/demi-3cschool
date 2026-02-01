import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Clock,
    Calendar,
    Play,
    BookOpen,
    Sparkles,
} from "lucide-react";
import PageWrapper from "@/design-system/components/PageWrapper";
import { MOCK_VIRTUAL_SESSIONS_DATA } from "../mocks";
import { CLASSROOM_PATH } from "../../navigation/constant";

// Format time from "HH:mm:ss" to "HH:mm"
function formatTime(time: string): string {
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
}

// Format date
function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
    }

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function RecordingPage() {
    const { t } = useTranslation("virtualSessions");
    const navigate = useNavigate();
    const { sessionId } = useParams<{ sessionId: string }>();

    // Find session from mock data
    const session = MOCK_VIRTUAL_SESSIONS_DATA.sessions.find(
        (s) => s.id === Number(sessionId)
    );

    if (!session) {
        return (
            <PageWrapper>
                <div className="flex items-center justify-center h-96">
                    <p className="text-gray-500">Session not found</p>
                </div>
            </PageWrapper>
        );
    }

    const handleGoBack = () => {
        navigate(`${CLASSROOM_PATH}/virtual-sessions`);
    };

    const handleWatchLessonVideos = () => {
        // Navigate to self study lesson
        navigate(`${CLASSROOM_PATH}/self-study/lesson/${session.lesson.id}`);
    };

    return (
        <PageWrapper>
            <div className="space-y-6">
                {/* Back Button */}
                <button
                    onClick={handleGoBack}
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors w-fit"
                >
                    <ArrowLeft className="size-4" />
                    {t("recording.backToVirtualSessions")}
                </button>

                {/* Video Player */}
                <div className="relative w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden">
                    {/* Placeholder image - replace with actual video player */}
                    <div className="absolute inset-0 bg-linear-to-b from-gray-800 to-gray-900 flex items-center justify-center">
                        <button className="size-20 bg-brand-500 hover:bg-brand-600 rounded-full flex items-center justify-center transition-colors shadow-lg">
                            <Play
                                className="size-8 text-white ml-1"
                                fill="white"
                            />
                        </button>
                    </div>
                </div>

                {/* Session Info */}
                <div className="flex flex-col gap-4">
                    {/* Tags Row */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                            <span className="bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-medium px-2.5 py-1 rounded">
                                {session.course.title}
                            </span>
                            <span className="bg-brand-50 dark:bg-brand-500/10 text-brand-500 text-xs font-medium px-2.5 py-1 rounded border border-brand-200 dark:border-brand-500/30">
                                Term {session.term.id}
                            </span>
                            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs">
                                <Clock className="size-3.5" />
                                <span>{session.duration || 60} min</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs">
                                <Calendar className="size-3.5" />
                                <span>{formatDate(session.sessionDate)}</span>
                            </div>
                        </div>
                        <span className="bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-medium px-2.5 py-1 rounded">
                            {t("recording.completedSession")}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {session.topic}
                    </h1>

                    {/* Lesson Summary */}
                    {session.description && (
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <BookOpen className="size-4" />
                                <span className="text-sm font-medium">
                                    {t("recording.lessonSummary")}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {session.description}
                            </p>
                        </div>
                    )}
                </div>

                {/* CTA Banner */}
                <div className="relative bg-linear-to-r from-brand-50 to-brand-100 dark:from-brand-500/10 dark:to-brand-500/5 rounded-2xl p-6 overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 size-24 bg-warning-200/30 rounded-full blur-2xl" />
                    <div className="absolute bottom-4 right-20 size-16 bg-brand-200/30 rounded-full blur-xl" />

                    <div className="relative flex flex-col items-center gap-4 text-center">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            {t("recording.finishedWatching")}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
                            {t("recording.keepMomentum")}
                        </p>
                        <button
                            onClick={handleWatchLessonVideos}
                            className="bg-warning-500 hover:bg-warning-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center gap-2"
                        >
                            <Sparkles className="size-5" />
                            {t("recording.watchLessonVideos")}
                        </button>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <span>↑</span>
                            {t("recording.goToLessonVideos")}{" "}
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                                {t("recording.selfStudyContent")}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}

export default RecordingPage;
