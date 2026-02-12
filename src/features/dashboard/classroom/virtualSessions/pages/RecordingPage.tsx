import { useEffect } from "react";
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
import { PageWrapper } from "@/design-system";
import { CLASSROOM_PATH } from "../../navigation/constant";
import { useLessonVideo } from "@/features/dashboard/admin/learning/pages/lessons/api";
import { useDynamicBreadcrumb } from "@/navigation";
import { BunnyStreamPlayer } from "@/features/dashboard/shared/components/BunnyStreamPlayer";
import { useVideo } from "@/features/dashboard/shared";

// Format date - returns key or formatted date
function formatDateKey(dateStr: string): {
    isYesterday: boolean;
    formatted: string;
} {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === yesterday.toDateString()) {
        return { isYesterday: true, formatted: "" };
    }

    return {
        isYesterday: false,
        formatted: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }),
    };
}

function RecordingPage() {
    const { t } = useTranslation("virtualSessions");
    const navigate = useNavigate();
    const { sessionId } = useParams<{ sessionId: string }>();
    const { setLabel: setDynamicBreadcrumb } = useDynamicBreadcrumb();

    const { data: lessonVideo, isLoading } = useLessonVideo(sessionId!);

    // Set dynamic breadcrumb with recording title
    useEffect(() => {
        if (lessonVideo?.title) {
            setDynamicBreadcrumb(lessonVideo.title);
        }
        return () => {
            setDynamicBreadcrumb(null);
        };
    }, [lessonVideo?.title, setDynamicBreadcrumb]);

    const handleGoBack = () => {
        navigate(`${CLASSROOM_PATH}/virtual-sessions`);
    };

    const handleWatchLessonVideos = () => {
        // Navigate to self study lesson
        navigate(
            `${CLASSROOM_PATH}/self-study/lesson/${lessonVideo?.lesson.id}`
        );
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

                {/* Zoom Recording Link - Kid-Friendly Version */}
                <div className="relative bg-linear-to-br from-purple-100 via-pink-50 to-blue-100 dark:from-purple-900/30 dark:via-pink-900/20 dark:to-blue-900/30 rounded-3xl p-8 overflow-hidden border-4 border-white dark:border-gray-700 shadow-xl">
                    {/* Decorative floating elements */}
                    <div className="absolute top-4 right-8 w-16 h-16 bg-yellow-300/40 rounded-full blur-xl animate-pulse"></div>
                    <div className="absolute bottom-8 left-12 w-20 h-20 bg-pink-300/40 rounded-full blur-xl animate-pulse delay-700"></div>
                    <div className="absolute top-1/2 left-8 w-12 h-12 bg-blue-300/40 rounded-full blur-lg animate-pulse delay-500"></div>

                    <div className="relative text-center space-y-6">
                        {/* Fun Video Icon */}
                        <div className="w-24 h-24 flex items-center justify-center rounded-full bg-linear-to-br from-purple-400 to-pink-400 mx-auto shadow-lg transform hover:scale-110 transition-transform">
                            <Play className="w-12 h-12 text-white fill-white" />
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <h3 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                                {t(
                                    "recording.zoomRecording",
                                    "Watch Your Class!"
                                )}
                            </h3>
                            <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
                                {t(
                                    "recording.zoomRecordingDescription",
                                    "Click the button below to watch 🎬"
                                )}
                            </p>
                        </div>

                        {/* Recording Link Button */}
                        {lessonVideo?.videoReferenceAr ||
                        lessonVideo?.videoReferenceEn ? (
                            <div className="flex justify-center pt-4">
                                <a
                                    href={
                                        lessonVideo.videoReferenceAr ||
                                        lessonVideo.videoReferenceEn
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative inline-flex items-center gap-3 px-8 py-5 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-2xl transition-all transform hover:scale-105 shadow-lg hover:shadow-2xl text-lg"
                                >
                                    <Play className="w-6 h-6 fill-white" />
                                    <span>
                                        {t(
                                            "recording.openInZoom",
                                            "Watch Now!"
                                        )}
                                    </span>
                                    <svg
                                        className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={3}
                                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                                        />
                                    </svg>
                                    {/* Fun sparkle effect */}
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full animate-ping"></div>
                                </a>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-400 mx-auto mb-4">
                                    <svg
                                        className="w-10 h-10"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                                    {t(
                                        "recording.noZoomRecording",
                                        "No video yet! 😊"
                                    )}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Session Info */}
                <div className="flex flex-col gap-4">
                    {/* Tags Row */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                            <span className="bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-medium px-2.5 py-1 rounded">
                                {lessonVideo?.title}
                            </span>
                            {/* <span className="bg-brand-50 dark:bg-brand-500/10 text-brand-500 text-xs font-medium px-2.5 py-1 rounded border border-brand-200 dark:border-brand-500/30">
                                Term {lessonVideo?.term?.name}
                            </span> */}
                            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs">
                                <Clock className="size-3.5" />
                                <span>
                                    {lessonVideo?.duration || 60}{" "}
                                    {t("common.min")}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs">
                                <Calendar className="size-3.5" />
                                <span>
                                    {lessonVideo?.createdAt &&
                                        (() => {
                                            const dateInfo = formatDateKey(
                                                lessonVideo.createdAt
                                            );
                                            return dateInfo.isYesterday
                                                ? t("common.yesterday")
                                                : dateInfo.formatted;
                                        })()}
                                </span>
                            </div>
                        </div>
                        <span className="bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-medium px-2.5 py-1 rounded">
                            {t("recording.completedSession")}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {lessonVideo?.title}
                    </h1>

                    {/* Lesson Summary */}
                    {lessonVideo?.description && (
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <BookOpen className="size-4" />
                                <span className="text-sm font-medium">
                                    {t("recording.lessonSummary")}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {lessonVideo.description}
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
