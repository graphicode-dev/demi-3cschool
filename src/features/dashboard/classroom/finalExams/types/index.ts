// ============================================================================
// API Response Types - Matching exact API structure
// ============================================================================

/**
 * Level reference in final exam
 */
export interface FinalExamLevel {
    id: number;
    name: string;
}

/**
 * Quiz option in question
 */
export interface FinalExamQuestionOption {
    id: number;
    optionText: string;
}

/**
 * Quiz question
 */
export interface FinalExamQuestion {
    id: number;
    question: string;
    questionType: string | null;
    points: number;
    options: FinalExamQuestionOption[];
}

/**
 * Quiz details in final exam
 */
export interface FinalExamQuiz {
    id: number;
    timeLimit: number;
    passingScore: number;
    maxAttempts: number;
    shuffleQuestions: number;
    showAnswers: number;
    questionsCount: number;
    questions: FinalExamQuestion[];
}

/**
 * Last attempt reference
 */
export interface FinalExamLastAttempt {
    id: number;
    status: "in_progress" | "completed";
    score: string;
    totalPoints: string;
    scorePercentage: number;
    isPassed: boolean;
    completedAt: string | null;
}

/**
 * Final Exam entity from /level-quiz-attempts/my-final-exam
 */
export interface FinalExam {
    id: number;
    level: FinalExamLevel;
    assignedAt: string;
    quiz: FinalExamQuiz;
    attemptsCount: number;
    canAttempt: boolean;
    hasPassed: boolean;
    lastAttempt: FinalExamLastAttempt | null;
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// Attempt Types
// ============================================================================

/**
 * User reference in attempt
 */
export interface AttemptUser {
    id: number;
    name: string;
    email: string;
}

/**
 * Level quiz reference in attempt
 */
export interface AttemptLevelQuiz {
    id: number;
    timeLimit: number;
    passingScore: number;
    maxAttempts: number;
}

/**
 * Quiz attempt from /level-quiz-attempts
 */
export interface QuizAttempt {
    id: number;
    user: AttemptUser;
    levelQuiz: AttemptLevelQuiz;
    startedAt: string;
    completedAt: string | null;
    score: string | null;
    totalPoints: string;
    scorePercentage: number;
    isPassed: boolean | null;
    attemptNumber: number;
    status: "in_progress" | "completed";
    answersCount: number;
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// Answer Types
// ============================================================================

/**
 * Question reference in answer response
 */
export interface AnswerQuestion {
    id: number;
    question: string;
    type: string;
    points: number;
}

/**
 * Answer response from /level-quiz-attempts/:id/answer
 */
export interface QuizAnswerResponse {
    id: number;
    levelQuizAttemptId: number;
    question: AnswerQuestion;
    selectedOptionId: number;
    textAnswer: string | null;
    isCorrect: boolean;
    pointsEarned: string;
    answeredAt: string;
    createdAt: string;
}

// ============================================================================
// Payload Types
// ============================================================================

/**
 * Start attempt payload
 */
export interface StartAttemptPayload {
    levelQuizId: number;
}

/**
 * Submit answer payload
 */
export interface SubmitAnswerPayload {
    level_quiz_question_id: number;
    selected_option_id: number;
    text_answer?: string;
}

// ============================================================================
// Legacy types for backward compatibility (to be removed)
// ============================================================================

export type ExamStatus = "completed" | "available" | "locked";
export type ExamResultStatus = "passed" | "failed" | "under_review";

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
