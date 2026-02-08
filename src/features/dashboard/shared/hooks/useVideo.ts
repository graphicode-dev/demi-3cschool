import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PlayerState } from "../types";
import { LessonTabType, LessonVideo } from "../../classroom/selfStudy";
import {
    useLesson,
    useLessonVideosByLesson,
} from "../../admin/learning/pages/lessons/api";
import { useParams, useSearchParams } from "react-router-dom";
import { useDynamicBreadcrumb } from "@/navigation";
import { useUpdateProgress } from "./useUpdateProgress";
import { useMarkAsCompleted } from "./useMarkAsCompleted";
import { useGetGroupProgress } from "./useGetGroupProgress";
import { useGetContentProgress } from "./useGetContentProgress";

export const useVideo = () => {
    const { sessionId: lessonId } = useParams<{ sessionId: string }>();
    const [searchParams] = useSearchParams();
    const groupId = searchParams.get("group_id") ?? searchParams.get("groupId");
    const { setLabel: setDynamicBreadcrumb } = useDynamicBreadcrumb();
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
    const [videoEnded, setVideoEnded] = useState(false);
    const [videos, setVideos] = useState<LessonVideo[]>([]);
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

    // Set dynamic breadcrumb with lesson title
    useEffect(() => {
        if (lessonData?.title) {
            setDynamicBreadcrumb(lessonData.title);
        }
        return () => {
            setDynamicBreadcrumb(null);
        };
    }, [lessonData?.title, setDynamicBreadcrumb]);

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

    return {
        setSelectedVideoId,
        selectedVideoId,
        selectedVideo,
        videos,
        setVideos,
        setVideoEnded,
        isLoadingLesson,
        isLoadingVideos,
        lessonData,
        lesson,
        overallProgressPercent,
        setWatchInEnglish,
        watchInEnglish,
        handlePlayerState,
        videoEnded,
    };
};
