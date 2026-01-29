export type VideoStatus = "completed" | "current" | "locked";
export type QuizStatus = "passed" | "pending" | "locked";

export interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
}

export interface VideoQuiz {
    id: number;
    videoId: number;
    questions: QuizQuestion[];
    totalQuestions: number;
    passingScore: number;
}

export interface VideoContentable {
    id: number;
    videoUrl: string;
    videoUrlEn?: string;
    videoProvider: string;
    duration: number;
    embedHtml: string;
}

export interface ContentProgress {
    progressPercentage: number;
    isCompleted: boolean;
    lastPosition: number;
    watchTime: number;
}

export interface LessonInfo {
    id: number;
    title: string;
}

export interface LessonVideo {
    id: number;
    lesson: LessonInfo;
    contentType: string;
    contentableType: string;
    contentableId: number;
    contentable: VideoContentable;
    title: string;
    description: string;
    order: number;
    duration: number;
    isRequired: boolean;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
    contentProgress: ContentProgress;
    // UI computed fields
    status?: VideoStatus;
    quiz?: VideoQuiz;
    quizStatus?: QuizStatus;
}

export interface Lesson {
    id: number;
    sessionId: number;
    title: string;
    description: string;
    videos: LessonVideo[];
    currentVideoId: number;
}

export interface PlayerState {
    isPlaying: boolean;
    isEnded: boolean;
    currentTime: number;
    duration: number;
}

export type LessonTabType = "about" | "assignments" | "quiz" | "materials";
