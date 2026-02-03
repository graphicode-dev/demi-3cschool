import { useState, useCallback, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { FileQuestion, Loader2 } from "lucide-react";
import PageWrapper from "@/design-system/components/PageWrapper";
import { ConfirmDialog } from "@/design-system";
import {
    MissionPath,
    VideoPlayer,
    VideoQuizModal,
    LessonTabs,
    LessonContent,
} from "../components/lesson";
import {
    useLesson,
    useLessonVideosByLesson,
} from "@/features/dashboard/admin/learning/pages/lessons/api";
import type { PlayerState, LessonTabType, LessonVideo } from "../types";

const MAX_ATTEMPTS = 3;

function LessonPage() {
    const { t } = useTranslation("selfStudy");
    const { sessionId: lessonId } = useParams<{ sessionId: string }>();

    // Fetch lesson data
    const { data: lessonData, isLoading: isLoadingLesson } =
        useLesson(lessonId);

    // Fetch lesson videos
    const { data: videosData, isLoading: isLoadingVideos } =
        useLessonVideosByLesson(lessonId);

    // Transform API data to UI format
    const lesson = useMemo(() => {
        if (!lessonData) return null;

        const apiVideos = videosData?.items ?? [];
        const transformedVideos: LessonVideo[] = apiVideos.map(
            (video, index) => ({
                id: Number(video.id),
                lesson: {
                    id: Number(video.lesson.id),
                    title: video.lesson.title,
                },
                contentType: "video",
                contentableType: "video",
                contentableId: Number(video.id),
                contentable: {
                    id: Number(video.id),
                    videoUrl:
                        video.videoReferenceAr || video.videoReferenceEn || "",
                    videoUrlEn: video.videoReferenceEn,
                    videoProvider: video.provider,
                    duration: Number(video.duration) || 0,
                    embedHtml: video.embedHtml || "",
                },
                title: video.title,
                description: video.description || "",
                order: index + 1,
                duration: Number(video.duration) || 0,
                isRequired: true,
                isPublished: video.isActive === 1,
                createdAt: video.createdAt,
                updatedAt: video.updatedAt,
                contentProgress: {
                    progressPercentage: 0,
                    isCompleted: false,
                    lastPosition: 0,
                    watchTime: 0,
                },
                status: index === 0 ? "current" : "locked",
                quizStatus: "pending",
            })
        );

        return {
            id: Number(lessonData.id),
            sessionId: Number(lessonId),
            title: lessonData.title,
            description: lessonData.description || "",
            videos: transformedVideos,
            currentVideoId: transformedVideos[0]?.id ?? 0,
        };
    }, [lessonData, videosData, lessonId]);

    const [selectedVideoId, setSelectedVideoId] = useState<number>(0);
    const [activeTab, setActiveTab] = useState<LessonTabType>("about");
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [videoEnded, setVideoEnded] = useState(false);
    const [videos, setVideos] = useState<LessonVideo[]>([]);
    const [quizAttempts, setQuizAttempts] = useState<Record<number, number>>(
        {}
    );
    const [showAttemptsExhaustedDialog, setShowAttemptsExhaustedDialog] =
        useState(false);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (lesson && !initialized) {
            setVideos(lesson.videos);
            setSelectedVideoId(lesson.currentVideoId);
            setInitialized(true);
        }
    }, [lesson, initialized]);

    const currentAttempts = selectedVideoId
        ? quizAttempts[selectedVideoId] || 0
        : 0;
    const hasAttemptsRemaining = currentAttempts < MAX_ATTEMPTS;

    const selectedVideo = videos.find((v) => v.id === selectedVideoId);

    const handleVideoSelect = useCallback((videoId: number) => {
        setVideos((currentVideos) => {
            const video = currentVideos.find((v) => v.id === videoId);
            if (video && video.status !== "locked") {
                setSelectedVideoId(videoId);
                setVideoEnded(false);
                setShowQuizModal(false);
            }
            return currentVideos;
        });
    }, []);

    const handlePlayerStateChange = useCallback((state: PlayerState) => {
        // Track video progress here if needed
        console.log("Player state:", state);
    }, []);

    const handleVideoEnd = useCallback(() => {
        setVideoEnded(true);

        // Mark video as watched (completed) but keep quiz pending
        setVideos((prevVideos) => {
            const updatedVideos = [...prevVideos];
            const currentIndex = updatedVideos.findIndex(
                (v) => v.id === selectedVideoId
            );
            if (
                currentIndex !== -1 &&
                updatedVideos[currentIndex].contentProgress
            ) {
                updatedVideos[currentIndex] = {
                    ...updatedVideos[currentIndex],
                    contentProgress: {
                        ...updatedVideos[currentIndex].contentProgress,
                        isCompleted: true,
                        progressPercentage: 100,
                    },
                };
            }
            return updatedVideos;
        });

        // Show quiz modal when video ends if quiz exists and not passed
        if (selectedVideo?.quiz && selectedVideo.quizStatus === "pending") {
            setShowQuizModal(true);
        }
    }, [selectedVideo, selectedVideoId]);

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
        [quizAttempts, selectedVideoId, selectedVideo]
    );

    const handleQuizRetry = useCallback(() => {
        // Don't increment here - it's incremented in handleQuizComplete
    }, []);

    const handleQuizClose = useCallback(() => {
        setShowQuizModal(false);
        // Don't reset videoEnded so user can click quiz button again
    }, []);

    // Show loading state
    if (isLoadingLesson || isLoadingVideos) {
        return (
            <PageWrapper>
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="size-8 animate-spin text-brand-500" />
                </div>
            </PageWrapper>
        );
    }

    if (!lesson) {
        return null;
    }

    return (
        <PageWrapper>
            <div className="flex flex-col gap-6 max-w-6xl mx-auto px-4 py-6">
                {/* Main Content Area */}
                <div className="flex gap-4">
                    {/* Video Player Section */}
                    <div className="flex-1">
                        {selectedVideo?.contentable?.embedHtml ? (
                            <div className="relative">
                                <VideoPlayer
                                    embedHtml={
                                        selectedVideo.contentable.embedHtml
                                    }
                                    onStateChange={handlePlayerStateChange}
                                    onVideoEnd={handleVideoEnd}
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
                                                {
                                                    selectedVideo.quiz
                                                        .totalQuestions
                                                }{" "}
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
                    </div>

                    {/* Mission Path Sidebar */}
                    <MissionPath
                        videos={videos}
                        currentVideoId={selectedVideoId}
                        onVideoSelect={handleVideoSelect}
                        onQuizClick={(videoId) => {
                            const video = videos.find((v) => v.id === videoId);
                            if (
                                video?.contentProgress?.isCompleted &&
                                video.quizStatus === "pending"
                            ) {
                                setSelectedVideoId(videoId);
                                setShowQuizModal(true);
                            }
                        }}
                    />
                </div>

                {/* Lesson Info Card */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-theme-sm p-6">
                    {/* Tabs */}
                    <LessonTabs
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />

                    {/* Tab Content */}
                    <div className="mt-6">
                        <LessonContent lesson={lesson} activeTab={activeTab} />
                    </div>
                </div>
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
                                        {selectedVideo.duration} min
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
