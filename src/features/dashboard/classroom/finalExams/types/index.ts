export type ExamStatus = "completed" | "available" | "locked";
export type ExamResultStatus = "passed" | "failed" | "under_review";
export type QuestionType = "true_false" | "single_choice" | "multiple_choice";

export interface FinalExam {
    id: number;
    title: string;
    period: number;
    duration: number; // in minutes
    questionsCount: number;
    status: ExamStatus;
    takenDate?: string;
    opensDate?: string;
    score?: number;
    totalScore?: number;
    attempts?: number;
    maxAttempts?: number;
    availableUntil?: string;
    questions?: FinalExamQuestion[];
}

export interface FinalExamQuestionOption {
    id: number;
    questionId: number;
    optionText: string;
    isCorrect?: boolean;
    order: number;
}

export interface FinalExamQuestion {
    id: number;
    examId: number;
    question: string;
    type: QuestionType;
    points: number;
    order: number;
    explanation?: string;
    options: FinalExamQuestionOption[];
}

export interface FinalExamAttempt {
    id: number;
    examId: number;
    studentId: number;
    attemptNumber: number;
    status: "in_progress" | "completed";
    score?: number;
    totalPoints?: number;
    percentage?: number;
    passed?: boolean;
    startedAt: string;
    completedAt?: string;
    exam?: FinalExam;
    questions?: FinalExamQuestion[];
}

export interface FinalExamResult {
    id: number;
    attemptId: number;
    status: ExamResultStatus;
    score: number;
    totalPoints: number;
    percentage: number;
    passed: boolean;
    completedAt?: string;
    reviewedAt?: string;
    feedback?: string;
}

export interface FinalExamSubmitAnswerPayload {
    selectedOptionId?: number;
    selectedOptionIds?: number[];
    booleanAnswer?: boolean;
}

export interface FinalExamSubmitAnswerResponse {
    success: boolean;
    message: string;
}
