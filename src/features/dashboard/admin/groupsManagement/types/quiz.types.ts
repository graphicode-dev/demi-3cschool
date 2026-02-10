export interface NewQuizData {
    levelId: string;
    timeLimit: number;
    passingScore: number;
    maxAttempts: number;
    shuffleQuestions: boolean;
    showAnswers: boolean;
}

// Quiz Question
export interface QuizQuestion {
    id: string;
    quiz: {
        id: string;
    };
    question: string;
    type: "single_choice" | "multiple_choice" | "true_false" | "short_answer";
    points: number;
    order: number;
    explanation: string;
    isActive?: number;
}
export interface NewQuestionData {
    quizId: string;
    question: string;
    type: "single_choice" | "multiple_choice" | "true_false" | "short_answer";
    points: number;
    order: number;
    explanation: string;
    isActive: boolean;
}

// Quiz Option
export interface QuizQuestionOption {
    id: string;
    question: {
        id: string;
        question: string;
    };
    optionText: string;
    isCorrect: boolean;
    order: number;
}
export interface MultipleQuestionOptionPayload {
    questionId: string;
    options: QuestionOption[];
}
export type SingleQuestionOptionPayload = QuestionOption & {
    questionId: string;
};
export interface QuestionOption {
    optionText: string;
    isCorrect: boolean;
    order: number;
}

// UI Types for components
export interface QuestionOptionUI {
    id?: string;
    text: string;
    isCorrect: boolean;
    order?: number;
}

export interface QuizQuestionWithOptions extends Omit<QuizQuestion, "quiz"> {
    options: QuestionOptionUI[];
}

export interface LevelQuizWithQuestions {
    id: string;
    levelId: string;
    timeLimit: number;
    passingScore: number;
    maxAttempts: number;
    shuffleQuestions: boolean;
    showAnswers: boolean;
    questions: QuizQuestionWithOptions[];
}

export interface NewQuestionFormData {
    quizId: string;
    question: string;
    type: "single_choice" | "multiple_choice" | "true_false" | "short_answer";
    points: number;
    order: number;
    explanation: string;
    isActive: boolean;
    options: QuestionOptionUI[];
}
