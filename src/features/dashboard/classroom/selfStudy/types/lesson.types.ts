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

export type LessonTabType =
    | "about"
    | "review"
    | "materials"
    | "lessonQuiz"
    | "assignments"
    | "editor";

export type AssignmentStatus = "pending" | "submitted" | "graded";
export type LessonQuizStatus = "new" | "completed";

export interface LessonMaterial {
    id: number;
    name: string;
    type: "PDF" | "IMAGE" | "VIDEO" | "DOCUMENT";
    size: string;
    url: string;
}

export interface LessonAssignment {
    id: number;
    title: string;
    description: string;
    status: AssignmentStatus;
    dueDate?: string;
    submittedAt?: string;
    grade?: number;
    maxGrade?: number;
}

export interface LessonQuizItem {
    id: number;
    title: string;
    questionsCount: number;
    duration: number;
    status: LessonQuizStatus;
    score?: number;
    maxScore?: number;
}

export interface LessonReview {
    rating: number;
    totalRatings: number;
    averageRating: number;
    userRating?: number;
    userFeedback?: string;
}
