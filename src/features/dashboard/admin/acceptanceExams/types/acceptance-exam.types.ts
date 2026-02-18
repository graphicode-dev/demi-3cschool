export interface NewAcceptanceExamData {
    gradeId: string;
    title: string;
    description: string;
    timeLimit: number;
    passingScore: number;
    maxAttempts: number;
    shuffleQuestions: boolean;
    showAnswers: boolean;
}

// Quiz Question
export interface AcceptanceExamQuestion {
    id: string;
    quiz: {
        id: string;
    };
    question: string;
    type: "single_choice" | "multiple_choice" | "true_false" | "short_answer";
    points: number;
    order: number;
    explanation?: string;
    isActive?: boolean;
}
export interface NewAcceptanceExamQuestionData {
    quizId: string;
    question: string;
    type: "single_choice" | "multiple_choice" | "true_false" | "short_answer";
    points: number;
    order: number;
    explanation: string;
    isActive: boolean;
}

// Quiz Option
export interface AcceptanceExamQuestionOption {
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

export interface AcceptanceExamQuestionWithOptions extends Omit<
    AcceptanceExamQuestion,
    "quiz"
> {
    options: QuestionOptionUI[];
}

export interface AcceptanceExamWithQuestions {
    id: string;
    levelId: string;
    title: string;
    description: string;
    timeLimit: number;
    passingScore: number;
    maxAttempts: number;
    shuffleQuestions: boolean;
    showAnswers: boolean;
    questions: AcceptanceExamQuestionWithOptions[];
}

export interface NewAcceptanceExamQuestionFormData {
    quizId: string;
    question: string;
    type: "single_choice" | "multiple_choice" | "true_false" | "short_answer";
    points: number;
    order: number;
    explanation: string;
    isActive: boolean;
    options: QuestionOptionUI[];
}
