import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    selfStudyContentApi,
    selfStudyLessonApi,
    selfStudyVideoProgressApi,
    selfStudyQuizApi,
    type UpdateVideoProgressPayload,
    type MarkVideoCompletePayload,
    type SubmitQuizAnswerPayload,
    type CompleteQuizPayload,
} from "./selfStudy.api";
import { selfStudyKeys } from "./selfStudy.keys";

// ============================================
// Content Queries
// ============================================

/**
 * Get self study content for current user
 */
export const useSelfStudyContent = () => {
    return useQuery({
        queryKey: selfStudyKeys.content(),
        queryFn: () => selfStudyContentApi.getContent(),
    });
};

/**
 * Get content by term
 */
export const useSelfStudyContentByTerm = (
    termId: number,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: selfStudyKeys.contentByTerm(termId),
        queryFn: () => selfStudyContentApi.getContentByTerm(termId),
        enabled: options?.enabled ?? !!termId,
    });
};

/**
 * Get course details
 */
export const useCourse = (
    courseId: number,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: selfStudyKeys.course(courseId),
        queryFn: () => selfStudyContentApi.getCourse(courseId),
        enabled: options?.enabled ?? !!courseId,
    });
};

/**
 * Get session details
 */
export const useSession = (
    sessionId: number,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: selfStudyKeys.session(sessionId),
        queryFn: () => selfStudyContentApi.getSession(sessionId),
        enabled: options?.enabled ?? !!sessionId,
    });
};

// ============================================
// Lesson Queries
// ============================================

/**
 * Get lesson by session ID
 */
export const useLesson = (
    sessionId: number,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: selfStudyKeys.lesson(sessionId),
        queryFn: () => selfStudyLessonApi.getLesson(sessionId),
        enabled: options?.enabled ?? !!sessionId,
    });
};

/**
 * Get lesson videos
 */
export const useLessonVideos = (
    lessonId: number,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: selfStudyKeys.lessonVideos(lessonId),
        queryFn: () => selfStudyLessonApi.getLessonVideos(lessonId),
        enabled: options?.enabled ?? !!lessonId,
    });
};

/**
 * Get single video
 */
export const useVideo = (videoId: number, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: selfStudyKeys.video(videoId),
        queryFn: () => selfStudyLessonApi.getVideo(videoId),
        enabled: options?.enabled ?? !!videoId,
    });
};

// ============================================
// Video Progress Queries
// ============================================

/**
 * Get video progress
 */
export const useVideoProgress = (
    videoId: number,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: selfStudyKeys.videoProgress(videoId),
        queryFn: () => selfStudyVideoProgressApi.getProgress(videoId),
        enabled: options?.enabled ?? !!videoId,
    });
};

/**
 * Get all video progress for a lesson
 */
export const useLessonProgress = (
    lessonId: number,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: selfStudyKeys.lessonProgress(lessonId),
        queryFn: () => selfStudyVideoProgressApi.getLessonProgress(lessonId),
        enabled: options?.enabled ?? !!lessonId,
    });
};

// ============================================
// Video Progress Mutations
// ============================================

/**
 * Update video progress mutation
 */
export const useUpdateVideoProgress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            videoId,
            data,
        }: {
            videoId: number;
            data: UpdateVideoProgressPayload;
        }) => selfStudyVideoProgressApi.updateProgress(videoId, data),
        onSuccess: (_, { videoId, data }) => {
            queryClient.invalidateQueries({
                queryKey: selfStudyKeys.videoProgress(videoId),
            });
            queryClient.invalidateQueries({
                queryKey: selfStudyKeys.lessonProgress(data.videoId),
            });
        },
    });
};

/**
 * Mark video as complete mutation
 */
export const useMarkVideoComplete = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            videoId,
            data,
        }: {
            videoId: number;
            data: MarkVideoCompletePayload;
        }) => selfStudyVideoProgressApi.markComplete(videoId, data),
        onSuccess: (_, { data }) => {
            queryClient.invalidateQueries({
                queryKey: selfStudyKeys.videos(),
            });
            queryClient.invalidateQueries({
                queryKey: selfStudyKeys.lesson(data.lessonId),
            });
            queryClient.invalidateQueries({
                queryKey: selfStudyKeys.lessonProgress(data.lessonId),
            });
        },
    });
};

// ============================================
// Quiz Queries
// ============================================

/**
 * Get quiz for video
 */
export const useVideoQuiz = (
    videoId: number,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: selfStudyKeys.videoQuiz(videoId),
        queryFn: () => selfStudyQuizApi.getVideoQuiz(videoId),
        enabled: options?.enabled ?? !!videoId,
    });
};

/**
 * Get quiz result
 */
export const useQuizResult = (
    quizId: number,
    options?: { enabled?: boolean }
) => {
    return useQuery({
        queryKey: selfStudyKeys.quizResult(quizId),
        queryFn: () => selfStudyQuizApi.getQuizResult(quizId),
        enabled: options?.enabled ?? !!quizId,
    });
};

// ============================================
// Quiz Mutations
// ============================================

/**
 * Submit single answer mutation
 */
export const useSubmitQuizAnswer = () => {
    return useMutation({
        mutationFn: ({
            quizId,
            data,
        }: {
            quizId: number;
            data: SubmitQuizAnswerPayload;
        }) => selfStudyQuizApi.submitAnswer(quizId, data),
    });
};

/**
 * Complete quiz mutation
 */
export const useCompleteQuiz = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            quizId,
            data,
        }: {
            quizId: number;
            data: CompleteQuizPayload;
        }) => selfStudyQuizApi.completeQuiz(quizId, data),
        onSuccess: (result, { quizId }) => {
            queryClient.invalidateQueries({
                queryKey: selfStudyKeys.quizResult(quizId),
            });
            // If quiz passed and next video unlocked, invalidate videos
            if (result?.passed && result?.nextVideoUnlocked) {
                queryClient.invalidateQueries({
                    queryKey: selfStudyKeys.videos(),
                });
                queryClient.invalidateQueries({
                    queryKey: selfStudyKeys.lessons(),
                });
            }
        },
    });
};

/**
 * Retry quiz mutation
 */
export const useRetryQuiz = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (quizId: number) => selfStudyQuizApi.retryQuiz(quizId),
        onSuccess: (_, quizId) => {
            queryClient.invalidateQueries({
                queryKey: selfStudyKeys.quizResult(quizId),
            });
        },
    });
};
