/**
 * Lesson Quiz UI Types
 *
 * Types for the lesson quiz management UI components.
 */

// UI Types for components
export interface LessonQuestionOptionUI {
    id?: string;
    text: string;
    isCorrect: boolean;
    order?: number;
}

export interface LessonQuizQuestionWithOptions {
    id: string;
    question: string;
    type: "single_choice" | "multiple_choice" | "true_false" | "short_answer";
    points: number;
    order: number;
    explanation?: string;
    isActive?: number | boolean;
    options: LessonQuestionOptionUI[];
}

export interface LessonQuizWithQuestions {
    id: string;
    lessonId: string;
    timeLimit: number;
    passingScore: number;
    maxAttempts: number;
    shuffleQuestions: boolean;
    showAnswers: boolean;
    questions: LessonQuizQuestionWithOptions[];
}

export interface NewLessonQuizData {
    lessonId: string;
    timeLimit: number;
    passingScore: number;
    maxAttempts: number;
    shuffleQuestions: boolean;
    showAnswers: boolean;
}

export interface NewLessonQuestionFormData {
    quizId: string;
    question: string;
    type: "single_choice" | "multiple_choice" | "true_false" | "short_answer";
    points: number;
    order: number;
    explanation: string;
    isActive: boolean;
    options: LessonQuestionOptionUI[];
}
