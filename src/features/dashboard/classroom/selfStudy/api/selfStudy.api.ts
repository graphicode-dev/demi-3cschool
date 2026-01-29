import { api } from "@/shared/api/client";
import type {
    SelfStudyContent,
    Course,
    CourseSession,
    Lesson,
    LessonVideo,
    VideoQuiz,
    PlayerState,
    UpdateVideoProgressPayload,
    UpdateVideoProgressResponse,
    MarkVideoCompletePayload,
    MarkVideoCompleteResponse,
    SubmitQuizAnswerPayload,
    SubmitQuizAnswerResponse,
    CompleteQuizPayload,
    CompleteQuizResponse,
} from "../types";

// ============================================
// API Response Types
// ============================================


// ============================================
// Self Study Content API
// ============================================
export const selfStudyContentApi = {
    // Get self study content for current user - GET /api/self-study/content
    getContent: async () => {
        const response = await api.get<SelfStudyContent>("/self-study/content");
        return response.data;
    },

    // Get content by term - GET /api/self-study/content/term/{termId}
    getContentByTerm: async (termId: number) => {
        const response = await api.get<SelfStudyContent>(
            `/self-study/content/term/${termId}`
        );
        return response.data;
    },

    // Get course details - GET /api/self-study/courses/{courseId}
    getCourse: async (courseId: number) => {
        const response = await api.get<Course>(
            `/self-study/courses/${courseId}`
        );
        return response.data;
    },

    // Get session details - GET /api/self-study/sessions/{sessionId}
    getSession: async (sessionId: number) => {
        const response = await api.get<CourseSession>(
            `/self-study/sessions/${sessionId}`
        );
        return response.data;
    },
};

// ============================================
// Lesson API
// ============================================
export const selfStudyLessonApi = {
    // Get lesson by session ID - GET /api/self-study/lessons/{sessionId}
    getLesson: async (sessionId: number) => {
        const response = await api.get<Lesson>(
            `/self-study/lessons/${sessionId}`
        );
        return response.data;
    },

    // Get lesson videos - GET /api/self-study/lessons/{lessonId}/videos
    getLessonVideos: async (lessonId: number) => {
        const response = await api.get<LessonVideo[]>(
            `/self-study/lessons/${lessonId}/videos`
        );
        return response.data;
    },

    // Get single video - GET /api/self-study/videos/{videoId}
    getVideo: async (videoId: number) => {
        const response = await api.get<LessonVideo>(
            `/self-study/videos/${videoId}`
        );
        return response.data;
    },
};

// ============================================
// Video Progress API
// ============================================
export const selfStudyVideoProgressApi = {
    // Update video progress - POST /api/self-study/videos/{videoId}/progress
    updateProgress: async (
        videoId: number,
        data: UpdateVideoProgressPayload
    ) => {
        const response = await api.post<UpdateVideoProgressResponse>(
            `/self-study/videos/${videoId}/progress`,
            data
        );
        return response.data;
    },

    // Mark video as complete - POST /api/self-study/videos/{videoId}/complete
    markComplete: async (videoId: number, data: MarkVideoCompletePayload) => {
        const response = await api.post<MarkVideoCompleteResponse>(
            `/self-study/videos/${videoId}/complete`,
            data
        );
        return response.data;
    },

    // Get video progress - GET /api/self-study/videos/{videoId}/progress
    getProgress: async (videoId: number) => {
        const response = await api.get<{
            progress: number;
            isCompleted: boolean;
        }>(`/self-study/videos/${videoId}/progress`);
        return response.data;
    },

    // Get all video progress for a lesson - GET /api/self-study/lessons/{lessonId}/progress
    getLessonProgress: async (lessonId: number) => {
        const response = await api.get<
            { videoId: number; progress: number; isCompleted: boolean }[]
        >(`/self-study/lessons/${lessonId}/progress`);
        return response.data;
    },
};

// ============================================
// Quiz API
// ============================================
export const selfStudyQuizApi = {
    // Get quiz for video - GET /api/self-study/videos/{videoId}/quiz
    getVideoQuiz: async (videoId: number) => {
        const response = await api.get<VideoQuiz>(
            `/self-study/videos/${videoId}/quiz`
        );
        return response.data;
    },

    // Submit single answer - POST /api/self-study/quizzes/{quizId}/answer
    submitAnswer: async (quizId: number, data: SubmitQuizAnswerPayload) => {
        const response = await api.post<SubmitQuizAnswerResponse>(
            `/self-study/quizzes/${quizId}/answer`,
            data
        );
        return response.data;
    },

    // Complete quiz (submit all answers) - POST /api/self-study/quizzes/{quizId}/complete
    completeQuiz: async (quizId: number, data: CompleteQuizPayload) => {
        const response = await api.post<CompleteQuizResponse>(
            `/self-study/quizzes/${quizId}/complete`,
            data
        );
        return response.data;
    },

    // Get quiz result - GET /api/self-study/quizzes/{quizId}/result
    getQuizResult: async (quizId: number) => {
        const response = await api.get<CompleteQuizResponse>(
            `/self-study/quizzes/${quizId}/result`
        );
        return response.data;
    },

    // Retry quiz - POST /api/self-study/quizzes/{quizId}/retry
    retryQuiz: async (quizId: number) => {
        const response = await api.post<{ success: boolean }>(
            `/self-study/quizzes/${quizId}/retry`
        );
        return response.data;
    },
};
