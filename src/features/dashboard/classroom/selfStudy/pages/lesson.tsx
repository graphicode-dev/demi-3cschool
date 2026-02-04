import { useState, useCallback, useMemo, useEffect, useRef, memo } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useSearchParams } from "react-router-dom";
import { FileQuestion, Loader2 } from "lucide-react";
import PageWrapper from "@/design-system/components/PageWrapper";
import { ConfirmDialog } from "@/design-system";
import { api } from "@/shared/api/client";
import {
    MissionPath,
    VideoQuizModal,
    LessonTabs,
    LessonContent,
} from "../components/lesson";
import {
    useLesson,
    useLessonVideosByLesson,
} from "@/features/dashboard/admin/learning/pages/lessons/api";
import type { LessonTabType, LessonVideo } from "../types";

const MAX_ATTEMPTS = 3;

const StableEmbedPlayer = memo(function StableEmbedPlayer({
    embedHtml,
}: {
    embedHtml: string;
}) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const lastHtmlRef = useRef<string>("");

    // keep the string stable + apply small transform once
    const html = useMemo(() => {
        return (embedHtml || "").replace("autoplay=true", "autoplay=false");
    }, [embedHtml]);

    useEffect(() => {
        if (!containerRef.current) return;
        if (lastHtmlRef.current === html) return; // ✅ don't touch DOM if unchanged

        lastHtmlRef.current = html;
        containerRef.current.innerHTML = html;
    }, [html]);

    return <div ref={containerRef} className="w-full h-full" />;
});

function getIframeSrcFromEmbedHtml(embedHtml: string): string | null {
    // grabs src="..."
    const m = embedHtml.match(/src="([^"]+)"/i);
    return m?.[1] ?? null;
}

function setQueryParam(url: string, key: string, value: string) {
    try {
        const u = new URL(url);
        u.searchParams.set(key, value);
        return u.toString();
    } catch {
        return url;
    }
}

type PlayerState = {
    isPlaying: boolean;
    isEnded: boolean;
    currentTime: number; // seconds
    duration: number; // seconds
};

interface PlayerJsInstance {
    on: (event: string, callback: (...args: unknown[]) => void) => void;
    getDuration: (callback: (duration: number) => void) => void;
    getCurrentTime: (callback: (time: number) => void) => void;
}

function useUpdateProgress() {
    const mutate = useCallback(
        (
            payload: {
                lessonContentId: number;
                groupId?: number;
                progressPercentage: number;
                lastPosition: number;
                watchTime: number;
            },
            options?: { onSuccess?: () => void; onError?: () => void }
        ) => {
            api.post("/content-progress", payload)
                .then(() => options?.onSuccess?.())
                .catch(() => options?.onError?.());
        },
        []
    );

    return { mutate };
}

function useMarkAsCompleted() {
    const mutate = useCallback(
        (
            payload: { lessonContentId: string; groupId?: number },
            options?: { onSuccess?: () => void; onError?: () => void }
        ) => {
            api.post("/content-progress/complete", payload)
                .then(() => options?.onSuccess?.())
                .catch(() => options?.onError?.());
        },
        []
    );

    return { mutate };
}

function useGetContentProgress(
    lessonContentId: string,
    groupId: string | null,
    enabled: boolean
) {
    const [data, setData] = useState<unknown>(undefined);

    useEffect(() => {
        if (!enabled) return;

        let cancelled = false;
        api.get(`/content-progress/${lessonContentId}`, {
            params: groupId ? { groupId } : undefined,
        })
            .then((res) => {
                if (cancelled) return;
                setData((res as any)?.data ?? res);
            })
            .catch(() => {
                if (cancelled) return;
                setData(undefined);
            });

        return () => {
            cancelled = true;
        };
    }, [enabled, groupId, lessonContentId]);

    return { data };
}

function useGetGroupProgress(groupId: string | null, enabled: boolean) {
    const [data, setData] = useState<unknown>(undefined);

    useEffect(() => {
        if (!enabled || !groupId) return;

        let cancelled = false;
        api.get("/content-progress", { params: { groupId } })
            .then((res) => {
                if (cancelled) return;
                setData((res as any)?.data ?? res);
            })
            .catch(() => {
                if (cancelled) return;
                setData(undefined);
            });

        return () => {
            cancelled = true;
        };
    }, [enabled, groupId]);

    return { data };
}

declare global {
    interface Window {
        playerjs?: {
            Player: new (iframe: HTMLIFrameElement) => PlayerJsInstance;
        };
    }
}

const BunnyStreamPlayer = memo(function BunnyStreamPlayer({
    embedHtml,
    onState,
}: {
    embedHtml: string;
    onState: (s: PlayerState) => void;
}) {
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const playerRef = useRef<PlayerJsInstance | null>(null);

    const srcRaw = useMemo(
        () => getIframeSrcFromEmbedHtml(embedHtml),
        [embedHtml]
    );

    // IMPORTANT: stop autoplay so "playing" is real user action
    const src = useMemo(() => {
        if (!srcRaw) return null;
        let next = srcRaw;
        next = setQueryParam(next, "autoplay", "false");
        next = setQueryParam(next, "loop", "false");
        return next;
    }, [srcRaw]);

    useEffect(() => {
        if (!iframeRef.current || !src) return;

        let destroyed = false;

        const ensurePlayerJs = () =>
            new Promise<void>((resolve, reject) => {
                if (window.playerjs?.Player) return resolve();

                const existing = document.querySelector(
                    'script[data-playerjs="1"]'
                ) as HTMLScriptElement | null;

                if (existing) {
                    existing.addEventListener("load", () => resolve(), {
                        once: true,
                    });
                    return;
                }

                const s = document.createElement("script");
                // from Bunny/mediadelivery (PlayerJS bridge)
                s.src =
                    "https://assets.mediadelivery.net/playerjs/player-0.1.0.min.js";
                s.async = true;
                s.dataset.playerjs = "1";
                s.onload = () => resolve();
                s.onerror = () => reject(new Error("Failed to load PlayerJS"));
                document.body.appendChild(s);
            });

        ensurePlayerJs()
            .then(() => {
                if (destroyed) return;

                const P = window.playerjs;
                if (!P?.Player) {
                    console.error("playerjs.Player not ready");
                    return;
                }

                const iframe = iframeRef.current!;
                const player = new P.Player(iframe);
                playerRef.current = player;

                let duration = 0;
                let isPlaying = false;
                let currentTime = 0;

                player.on("ready", () => {
                    // ask duration once
                    player.getDuration((d: number) => {
                        duration = Number(d) || 0;
                        onState({
                            isPlaying,
                            isEnded: false,
                            currentTime: 0,
                            duration,
                        });
                    });
                });

                player.on("play", () => {
                    isPlaying = true;
                    onState({
                        isPlaying: true,
                        isEnded: false,
                        currentTime,
                        duration,
                    });
                });

                player.on("pause", () => {
                    isPlaying = false;
                    onState({
                        isPlaying: false,
                        isEnded: false,
                        currentTime,
                        duration,
                    });
                });

                // Bunny emits timeupdate - use getCurrentTime() for accurate time
                player.on("timeupdate", () => {
                    player.getCurrentTime((t: number) => {
                        currentTime = Number(t) || 0;
                        onState({
                            isPlaying,
                            isEnded:
                                duration > 0
                                    ? currentTime >= duration - 0.25
                                    : false,
                            currentTime,
                            duration,
                        });
                    });
                });

                // (some players emit ended, but timeupdate is enough)
                player.on?.("ended", () => {
                    isPlaying = false;
                    onState({
                        isPlaying: false,
                        isEnded: true,
                        currentTime: duration,
                        duration,
                    });
                });
            })
            .catch((err) => {
                console.error(err);
            });

        return () => {
            destroyed = true;
            playerRef.current = null;
        };
    }, [src, onState]);

    if (!src) return <StableEmbedPlayer embedHtml={embedHtml} />;

    return (
        <iframe
            ref={iframeRef}
            src={src}
            className="w-full h-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            style={{ border: 0 }}
            title="bunny-stream-player"
        />
    );
});

function LessonPage() {
    const { t } = useTranslation("selfStudy");
    const { sessionId: lessonId } = useParams<{ sessionId: string }>();
    const [searchParams] = useSearchParams();
    const groupId = searchParams.get("group_id") ?? searchParams.get("groupId");

    const [watchInEnglish, setWatchInEnglish] = useState(false);
    const [videoProgress, setVideoProgress] = useState<Record<number, number>>(
        {}
    );
    const [lastPositions, setLastPositions] = useState<Record<number, number>>(
        {}
    );
    const [playerState, setPlayerState] = useState<PlayerState>({
        isPlaying: false,
        isEnded: false,
        currentTime: 0,
        duration: 0,
    });
    const playerStateRef = useRef<PlayerState>(playerState);
    // Store actual video durations from player
    const [videoDurations, setVideoDurations] = useState<
        Record<number, number>
    >({});
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
    const currentVideoIdRef = useRef<number | null>(null);

    // Callback that updates both state and ref simultaneously
    const handlePlayerState = useCallback((newState: PlayerState) => {
        playerStateRef.current = newState; // Update ref immediately
        setPlayerState(newState); // Update state for UI

        // Store duration when video loads and has valid duration
        if (currentVideoIdRef.current && newState.duration > 0) {
            setVideoDurations((prev) => ({
                ...prev,
                [currentVideoIdRef.current!]: newState.duration,
            }));
        }
    }, []);

    const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
        null
    );
    const hasMarkedCompleteRef = useRef<Record<number, boolean>>({});

    // Refs to hold latest values for interval callback (avoids stale closures)
    const videoProgressRef = useRef(videoProgress);
    const lastPositionsRef = useRef(lastPositions);

    // Keep refs in sync with state
    useEffect(() => {
        videoProgressRef.current = videoProgress;
    }, [videoProgress]);
    useEffect(() => {
        lastPositionsRef.current = lastPositions;
    }, [lastPositions]);

    // Fetch lesson data
    const { data: lessonData, isLoading: isLoadingLesson } =
        useLesson(lessonId);

    // Fetch lesson videos
    const { data: videosData, isLoading: isLoadingVideos } =
        useLessonVideosByLesson(lessonId);
    const { mutate: updateProgress } = useUpdateProgress();
    const { mutate: markAsCompleted } = useMarkAsCompleted();

    const { data: groupProgressData } = useGetGroupProgress(
        groupId,
        Boolean(groupId)
    );

    // Build progress map and last positions from API data
    useEffect(() => {
        if (groupProgressData) {
            const progressMap: Record<number, number> = {};
            const positionsMap: Record<number, number> = {};
            const progressItems = Array.isArray(groupProgressData)
                ? groupProgressData
                : (groupProgressData as any)?.data || [];
            progressItems.forEach((item: any) => {
                progressMap[item.lesson_content_id] = item.progress_percentage;
                positionsMap[item.lesson_content_id] = item.last_position || 0;
                // Mark as already completed if progress is 100
                if (item.progress_percentage === 100 || item.is_completed) {
                    hasMarkedCompleteRef.current[item.lesson_content_id] = true;
                }
            });
            setVideoProgress(progressMap);
            setLastPositions(positionsMap);
        }
    }, [groupProgressData]);

    const lesson = useMemo(() => {
        if (!lessonData) return null;
        return {
            id: Number(lessonData.id),
            sessionId: Number(lessonId),
            title: String(lessonData.title ?? ""),
            description: String((lessonData as any).description ?? ""),
            videos,
            currentVideoId: selectedVideoId,
        };
    }, [lessonData, lessonId, selectedVideoId, videos]);

    const overallProgressPercent = useMemo(() => {
        if (videos.length === 0) return 0;

        const perVideoPercents = videos.map((v) => {
            if (v.contentProgress?.isCompleted) return 100;

            const fromMap = videoProgress[v.id];
            if (typeof fromMap === "number" && Number.isFinite(fromMap)) {
                return Math.max(0, Math.min(100, fromMap));
            }

            const fromContent = v.contentProgress?.progressPercentage;
            if (
                typeof fromContent === "number" &&
                Number.isFinite(fromContent)
            ) {
                return Math.max(0, Math.min(100, fromContent));
            }

            return 0;
        });

        const sum = perVideoPercents.reduce((acc, p) => acc + p, 0);
        return Math.floor(sum / perVideoPercents.length);
    }, [videoProgress, videos]);

    // Utility to format duration in seconds to MM:SS format
    const formatDuration = (duration: number | string | undefined | null) => {
        if (duration === undefined || duration === null) return "0:00";
        if (typeof duration === "string") return duration || "0:00";
        if (typeof duration !== "number" || isNaN(duration) || duration <= 0)
            return "0:00";
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const selectedVideo = useMemo(
        () => videos.find((v) => v.id === selectedVideoId),
        [videos, selectedVideoId]
    );

    // Update current video ID ref when selection changes
    useEffect(() => {
        currentVideoIdRef.current = selectedVideo?.id || null;
    }, [selectedVideo]);

    useEffect(() => {
        const apiVideos = videosData?.items ?? [];
        if (apiVideos.length === 0) {
            setVideos([]);
            setSelectedVideoId(0);
            return;
        }

        const transformedVideos: LessonVideo[] = apiVideos.map(
            (video: any, index: number) => {
                const id = Number(video.id);
                const actualDuration = videoDurations[id];
                const durationNum =
                    Number(actualDuration || video.duration) || 0;

                const embedHtmlAr =
                    String(
                        video.embedHtmlAr ??
                            video.embed_html_ar ??
                            video.embedHtmlAR ??
                            ""
                    ) || String(video.embedHtml ?? video.embed_html ?? "");
                const embedHtmlEn =
                    String(
                        video.embedHtmlEn ??
                            video.embed_html_en ??
                            video.embedHtmlEN ??
                            ""
                    ) || String(video.embedHtml ?? video.embed_html ?? "");

                return {
                    id,
                    lesson: {
                        id: Number(video.lesson?.id ?? 0),
                        title: String(video.lesson?.title ?? ""),
                    },
                    contentType: "video",
                    contentableType: "video",
                    contentableId: id,
                    contentable: {
                        id,
                        videoUrl: String(video.videoReferenceAr ?? ""),
                        videoUrlEn: String(video.videoReferenceEn ?? ""),
                        videoProvider: String(video.provider ?? ""),
                        duration: durationNum,
                        embedHtml: watchInEnglish ? embedHtmlEn : embedHtmlAr,
                    },
                    title: String(video.title ?? video.name ?? ""),
                    description: String(video.description ?? ""),
                    order: index + 1,
                    duration: durationNum,
                    isRequired: true,
                    isPublished: Number(video.isActive) === 1,
                    createdAt: String(video.createdAt ?? ""),
                    updatedAt: String(video.updatedAt ?? ""),
                    contentProgress: {
                        progressPercentage:
                            Number(video.contentProgress?.progressPercentage) ||
                            0,
                        isCompleted: Boolean(
                            video.contentProgress?.isCompleted
                        ),
                        lastPosition:
                            Number(video.contentProgress?.lastPosition) || 0,
                        watchTime:
                            Number(video.contentProgress?.watchTime) || 0,
                    },
                    status: index === 0 ? "current" : "locked",
                    quizStatus: "pending",
                } as LessonVideo;
            }
        );

        setVideos(transformedVideos);
        setSelectedVideoId((prev) => prev || transformedVideos[0]!.id);

        const progressFromApi: Record<number, number> = {};
        const positionsFromApi: Record<number, number> = {};
        transformedVideos.forEach((v) => {
            if (v.contentProgress) {
                progressFromApi[v.id] =
                    v.contentProgress.progressPercentage || 0;
                positionsFromApi[v.id] = v.contentProgress.lastPosition || 0;
                if (v.contentProgress.isCompleted) {
                    hasMarkedCompleteRef.current[v.id] = true;
                }
            }
        });
        setVideoProgress((prev) => ({ ...prev, ...progressFromApi }));
        setLastPositions((prev) => ({ ...prev, ...positionsFromApi }));
    }, [videosData, videoDurations, watchInEnglish]);

    // Cleanup on unmount
    useEffect(() => {
        return () => stopProgressTracking();
    }, []);

    // Auto-mark as complete when progress reaches 95% or more
    const autoMarkAsComplete = useCallback(
        (videoId: number) => {
            if (hasMarkedCompleteRef.current[videoId]) return;

            hasMarkedCompleteRef.current[videoId] = true;

            markAsCompleted(
                {
                    lessonContentId: String(videoId),
                    groupId: groupId ? parseInt(groupId) : undefined,
                },
                {
                    onSuccess: () => {
                        setVideoProgress((prev) => ({
                            ...prev,
                            [videoId]: 100,
                        }));
                    },
                }
            );
        },
        [groupId, markAsCompleted]
    );

    // Helper to stop progress tracking
    const stopProgressTracking = () => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
        // Clear player state ref to prevent affecting next video
        playerStateRef.current = {
            isPlaying: false,
            currentTime: 0,
            duration: 0,
            isEnded: false,
        };
    };

    // Fetch individual content progress when video is selected (to get last_position for resume)
    const { data: currentContentProgress } = useGetContentProgress(
        selectedVideo ? String(selectedVideo.id) : "",
        groupId,
        Boolean(selectedVideo)
    );

    // Update last position from individual content progress API
    useEffect(() => {
        if (currentContentProgress && selectedVideo) {
            const progressData =
                (currentContentProgress as any)?.data || currentContentProgress;
            if (progressData?.last_position !== undefined) {
                setLastPositions((prev) => ({
                    ...prev,
                    [selectedVideo.id]: progressData.last_position,
                }));
            }
            if (progressData?.progress_percentage !== undefined) {
                setVideoProgress((prev) => ({
                    ...prev,
                    [selectedVideo.id]: progressData.progress_percentage,
                }));
            }
        }
    }, [currentContentProgress, selectedVideo]);

    // Start tracking when video changes - sends progress every 15 seconds
    useEffect(() => {
        if (!selectedVideo) return;

        stopProgressTracking();

        const videoId = selectedVideo.id;
        const parsedGroupId = groupId != null ? Number(groupId) : undefined;
        const safeGroupId = Number.isFinite(parsedGroupId)
            ? parsedGroupId
            : undefined;

        // Reset tracking state for new video
        let lastSentPos = lastPositionsRef.current[videoId] || 0;
        let lastSentAt: number | undefined = undefined; // Reset to undefined for new video

        // tick often, but only SEND when interval reached
        progressIntervalRef.current = setInterval(() => {
            const ps = playerStateRef.current;

            // Debug: log current player state

            const dur = ps.duration || 0;
            const currentTime = ps.currentTime || 0;

            // stop when ended - check this first!
            if (ps.isEnded) {
                // Stop tracking IMMEDIATELY to prevent affecting next video
                stopProgressTracking();

                setVideoEnded(true);

                // Send final progress update as 100% when video ends
                const finalPayload = {
                    lessonContentId: videoId,
                    groupId: safeGroupId,
                    progressPercentage: 100,
                    lastPosition: Math.floor(currentTime),
                    watchTime: Math.max(
                        0,
                        Math.floor(currentTime) - lastSentPos
                    ),
                };
                updateProgress(finalPayload);

                autoMarkAsComplete(videoId);
                return;
            }

            // only while playing
            // only while playing
            if (!ps.isPlaying) return;

            // Skip if we don't have valid duration yet
            if (dur <= 0) {
                return;
            }

            const updateEvery = dur <= 30 ? 2 : 15; // Reduced to 2 seconds for short videos

            const now = Date.now();

            // Initialize lastSentAt on first run
            if (lastSentAt === undefined) {
                lastSentAt = now;
            }

            const elapsedSec = (now - lastSentAt) / 1000;
            if (elapsedSec < updateEvery) return;

            const currentTimeInt = Math.floor(currentTime);
            const progress = Math.min((currentTime / dur) * 100, 100);

            // If video is ended, ensure 100% progress
            const finalProgress = ps.isEnded ? 100 : progress;

            const payload = {
                lessonContentId: videoId,
                groupId: safeGroupId,
                progressPercentage: Math.floor(finalProgress),
                lastPosition: currentTimeInt,
                watchTime: Math.max(0, currentTimeInt - lastSentPos),
            };

            updateProgress(payload);

            // Progress bar is synced with API via useGetGroupProgress cache updates
            // No local state updates needed here

            if (progress >= 95) autoMarkAsComplete(videoId);

            lastSentAt = now;
            lastSentPos = currentTimeInt;
        }, 500);

        return () => stopProgressTracking();
    }, [selectedVideo?.id, groupId, updateProgress, autoMarkAsComplete]);

    const currentAttempts = selectedVideoId
        ? quizAttempts[selectedVideoId] || 0
        : 0;

    const handleVideoSelect = useCallback((videoId: number) => {
        setVideos((currentVideos: LessonVideo[]) => {
            const video = currentVideos.find((v) => v.id === videoId);
            if (video && video.status !== "locked") {
                setSelectedVideoId(videoId);
                setVideoEnded(false);
                setShowQuizModal(false);
            }
            return currentVideos;
        });
    }, []);

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

    if (!lessonData || !lesson) {
        return null;
    }

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
            <div className="flex flex-col gap-6 max-w-6xl mx-auto px-4 py-6">
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
                                    embedHtml={
                                        selectedVideo.contentable.embedHtml
                                    }
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
