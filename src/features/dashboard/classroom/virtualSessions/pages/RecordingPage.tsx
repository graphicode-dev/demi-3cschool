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

    const { setWatchInEnglish, watchInEnglish } = useVideo();

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

                {/* Video Player */}
                <div>
                    <div className="flex items-center justify-end mb-3">
                        <button
                            onClick={() => setWatchInEnglish(false)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                !watchInEnglish
                                    ? "bg-brand-500 text-white"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                        >
                            AR
                        </button>
                        <button
                            onClick={() => setWatchInEnglish(true)}
                            className={`ms-2 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                watchInEnglish
                                    ? "bg-brand-500 text-white"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                        >
                            EN
                        </button>
                    </div>
                    {lessonVideo?.embedHtml ? (
                        <div className="relative bg-gray-900 rounded-2xl aspect-video flex items-center justify-center overflow-hidden">
                            <BunnyStreamPlayer
                                embedHtml={
                                    watchInEnglish
                                        ? lessonVideo.embedHtmlEn!
                                        : lessonVideo.embedHtmlAr!
                                }
                                onState={() => {}}
                            />
                        </div>
                    ) : (
                        <div className="aspect-video bg-gray-900 rounded-xl flex flex-col items-center justify-center">
                            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-800 text-gray-500 mb-3">
                                <Play className="w-8 h-8" />
                            </div>
                            <p className="text-sm text-gray-400">
                                {t(
                                    "lessons:content.fields.noVideoUploaded",
                                    "No video uploaded"
                                )}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {t(
                                    "lessons:content.fields.addVideoUrl",
                                    "Add a video URL to preview"
                                )}
                            </p>
                        </div>
                    )}
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
