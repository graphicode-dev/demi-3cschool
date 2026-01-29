import { Lesson, VideoQuiz } from "./lesson.types";
import { SelfStudyContent } from "./selfStudy.types";

export interface GetSelfStudyContentResponse {
    data: SelfStudyContent;
}

export interface GetLessonResponse {
    data: Lesson;
}

export interface GetVideoQuizResponse {
    data: VideoQuiz;
}

export interface UpdateVideoProgressPayload {
    videoId: number;
    currentTime: number;
    duration: number;
    isCompleted: boolean;
}

export interface UpdateVideoProgressResponse {
    success: boolean;
    progress: number;
}

export interface SubmitQuizAnswerPayload {
    questionId: number;
    selectedAnswer: number;
}

export interface SubmitQuizAnswerResponse {
    isCorrect: boolean;
    correctAnswer: number;
}

export interface CompleteQuizPayload {
    quizId: number;
    answers: { questionId: number; selectedAnswer: number }[];
}

export interface CompleteQuizResponse {
    passed: boolean;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    nextVideoUnlocked: boolean;
    nextVideoId?: number;
}

export interface MarkVideoCompletePayload {
    videoId: number;
    lessonId: number;
}

export interface MarkVideoCompleteResponse {
    success: boolean;
    videoStatus: "completed" | "current" | "locked";
    nextVideoId?: number;
    nextVideoStatus?: "current" | "locked";
}