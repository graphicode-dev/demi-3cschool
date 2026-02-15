import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FileQuestion, Loader2 } from "lucide-react";
import {
    PageWrapper,
    ConfirmDialog,
    LoadingState,
    ErrorState,
} from "@/design-system";
import {
    MissionPath,
    VideoQuizModal,
    LessonTabs,
    LessonContent,
} from "../components/lesson";
import type { LessonTabType, LessonVideo } from "../types";
import { useVideo } from "@/features/dashboard/shared";
import { BunnyStreamPlayer } from "@/features/dashboard/shared/components/BunnyStreamPlayer";

const MAX_ATTEMPTS = 3;

function LessonPage() {
    const { t } = useTranslation("selfStudy");
    const {
        selectedVideoId,
        selectedVideo,
        videos,
        setVideos,
        isLoadingLesson,
        isLoadingVideos,
        lesson,
        lessonData,
        setSelectedVideoId,
        setVideoEnded,
        overallProgressPercent,
        setWatchInEnglish,
        watchInEnglish,
        handlePlayerState,
        videoEnded,
    } = useVideo();
    const [activeTab, setActiveTab] = useState<LessonTabType>("about");
    const [quizAttempts, setQuizAttempts] = useState<Record<number, number>>(
        {}
    );
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [showAttemptsExhaustedDialog, setShowAttemptsExhaustedDialog] =
        useState(false);
    const currentAttempts = selectedVideoId
        ? quizAttempts[selectedVideoId] || 0
        : 0;

    // Update video statuses based on progress
    useEffect(() => {
        if (videos.length === 0) return;

        setVideos((prevVideos) => {
            const updatedVideos = [...prevVideos];

            // Sort by order to process sequentially
            const sortedVideos = [...updatedVideos].sort(
                (a, b) => a.order - b.order
            );

            sortedVideos.forEach((video, index) => {
                const videoIndex = updatedVideos.findIndex(
                    (v) => v.id === video.id
                );

                if (videoIndex === -1) return;

                // First video is always unlocked
                if (index === 0) {
                    updatedVideos[videoIndex].status = video.progress
                        ?.isCompleted
                        ? "completed"
                        : "current";
                    updatedVideos[videoIndex].quizStatus = video.progress
                        ?.isCompleted
                        ? "passed"
                        : "pending";
                    return;
                }

                // Check previous video completion
                const prevVideo = sortedVideos[index - 1];
                const isPrevCompleted = prevVideo?.progress?.isCompleted;

                if (isPrevCompleted) {
                    // Current video is unlocked
                    updatedVideos[videoIndex].status = video.progress
                        ?.isCompleted
                        ? "completed"
                        : "current";
                    updatedVideos[videoIndex].quizStatus = video.progress
                        ?.isCompleted
                        ? "passed"
                        : "pending";
                } else {
                    // Video is locked
                    updatedVideos[videoIndex].status = "locked";
                    updatedVideos[videoIndex].quizStatus = "locked";
                }
            });

            return updatedVideos;
        });
    }, [videos.map((v) => `${v.id}-${v.progress?.isCompleted}`).join(",")]);

    const handleQuizComplete = useCallback(
        (passed: boolean) => {
            const newAttemptCount = (quizAttempts[selectedVideoId] || 0) + 1;

            // Increment attempt count
            setQuizAttempts((prev) => ({
                ...prev,
                [selectedVideoId]: newAttemptCount,
            }));

            if (passed && selectedVideo) {
                // Update video status and unlock next video
                setVideos((prevVideos) => {
                    const updatedVideos = [...prevVideos];
                    const currentIndex = updatedVideos.findIndex(
                        (v) => v.id === selectedVideoId
                    );

                    if (currentIndex !== -1) {
                        // Mark current video as completed with quiz passed
                        updatedVideos[currentIndex] = {
                            ...updatedVideos[currentIndex],
                            status: "completed",
                            quizStatus: "passed",
                            progress: {
                                ...updatedVideos[currentIndex].progress!,
                                isCompleted: true,
                                progressPercentage: 100,
                            },
                        };

                        // Unlock next video if exists
                        if (currentIndex + 1 < updatedVideos.length) {
                            updatedVideos[currentIndex + 1] = {
                                ...updatedVideos[currentIndex + 1],
                                status: "current",
                                quizStatus: "pending",
                            };
                            // Auto-select next video
                            setSelectedVideoId(
                                updatedVideos[currentIndex + 1].id
                            );
                        }
                    }

                    return updatedVideos;
                });
                setShowQuizModal(false);
                setVideoEnded(false);
            } else if (!passed && newAttemptCount >= MAX_ATTEMPTS) {
                // Show exhausted attempts dialog when all 3 attempts used
                setShowQuizModal(false);
                setShowAttemptsExhaustedDialog(true);
            }
        },
        [
            quizAttempts,
            selectedVideoId,
            selectedVideo,
            setVideos,
            setSelectedVideoId,
            setVideoEnded,
        ]
    );
    const handleQuizRetry = useCallback(() => {
        // Don't increment here - it's incremented in handleQuizComplete
    }, []);
    const handleQuizClose = useCallback(() => {
        setShowQuizModal(false);
        // Don't reset videoEnded so user can click quiz button again
    }, []);
    const handleVideoSelect = useCallback(
        (videoId: number) => {
            setVideos((currentVideos: LessonVideo[]) => {
                const video = currentVideos.find((v) => v.id === videoId);
                if (video && video.status !== "locked") {
                    setSelectedVideoId(videoId);
                    setVideoEnded(false);
                    setShowQuizModal(false);
                }
                return currentVideos;
            });
        },
        [setVideos, setSelectedVideoId, setVideoEnded]
    );

    // Show loading state
    if (isLoadingLesson || isLoadingVideos) return <LoadingState />;

    if (!lessonData || !lesson)
        return <ErrorState message={t("lesson.notFound")} />;

    return (
        <PageWrapper
            pageHeaderProps={{
                backButton: true,
                title: selectedVideo?.title,
            }}
        >
            {/* Progress */}
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {t("lesson.about.yourProgress")}
                    </span>
                    <span className="text-sm font-bold text-brand-500">
                        {overallProgressPercent}% {t("lesson.about.complete")}
                    </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-brand-500 rounded-full transition-all"
                        style={{ width: `${overallProgressPercent}%` }}
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex gap-4">
                {/* Video Player Section */}
                <div className="flex-1">
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
                    {selectedVideo?.contentable?.embedHtml ? (
                        <div className="relative bg-gray-900 rounded-2xl aspect-video flex items-center justify-center mb-4 overflow-hidden">
                            <BunnyStreamPlayer
                                embedHtml={selectedVideo.contentable.embedHtml}
                                onState={handlePlayerState}
                            />
                            {/* Quiz Button - Shows after video ends */}
                            {videoEnded &&
                                selectedVideo?.quiz &&
                                selectedVideo.quizStatus === "pending" && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl">
                                        <button
                                            onClick={() =>
                                                setShowQuizModal(true)
                                            }
                                            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg"
                                        >
                                            <FileQuestion className="size-5" />
                                            {t("lesson.takeQuiz")} (
                                            {selectedVideo.quiz.totalQuestions}{" "}
                                            {t("lesson.questions")})
                                        </button>
                                    </div>
                                )}
                        </div>
                    ) : (
                        <div className="w-full aspect-video bg-gray-700 rounded-2xl flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg">
                            <p className="text-white text-sm">
                                {t("lesson.videoLocked")}
                            </p>
                        </div>
                    )}

                    {/* Lesson Info Card */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-theme-sm p-6 overflow-visible">
                        {/* Tabs */}
                        <LessonTabs
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                        />

                        {/* Tab Content */}
                        <div className="mt-6 overflow-visible">
                            <LessonContent
                                lesson={lesson}
                                activeTab={activeTab}
                            />
                        </div>
                    </div>
                </div>

                {/* Videos List Sidebar */}
                <MissionPath
                    videos={videos}
                    currentVideoId={selectedVideoId}
                    onVideoSelect={handleVideoSelect}
                    onQuizClick={(videoId) => {
                        const video = videos.find((v) => v.id === videoId);
                        if (
                            video?.progress?.isCompleted &&
                            video.quizStatus === "pending"
                        ) {
                            setSelectedVideoId(videoId);
                            setShowQuizModal(true);
                        }
                    }}
                />
            </div>

            {/* Quiz Modal */}
            {showQuizModal && selectedVideo?.quiz && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2">
                                <div className="bg-brand-500 rounded-lg size-8 flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">
                                        {selectedVideo.order}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-900 dark:text-white">
                                        {selectedVideo.title}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {selectedVideo.duration}{" "}
                                        {t("common.min")}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleQuizClose}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Quiz Content */}
                        <VideoQuizModal
                            quiz={selectedVideo.quiz}
                            videoTitle={selectedVideo.title}
                            attemptsUsed={currentAttempts}
                            onComplete={handleQuizComplete}
                            onRetry={handleQuizRetry}
                            onClose={handleQuizClose}
                        />
                    </div>
                </div>
            )}
            {/* Attempts Exhausted Dialog */}
            <ConfirmDialog
                isOpen={showAttemptsExhaustedDialog}
                onClose={() => setShowAttemptsExhaustedDialog(false)}
                title={t("lesson.attemptsExhausted")}
                message={t("lesson.comeBackTomorrow")}
                variant="warning"
                confirmText={t("lesson.understood")}
                onConfirm={() => setShowAttemptsExhaustedDialog(false)}
                buttons={[
                    {
                        text: t("lesson.understood"),
                        variant: "primary",
                        onClick: () => setShowAttemptsExhaustedDialog(false),
                    },
                ]}
            />
        </PageWrapper>
    );
}

export default LessonPage;
