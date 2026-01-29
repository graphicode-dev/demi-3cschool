import type {
    AcceptanceExam,
    AcceptanceExamQuestion,
    AcceptanceExamAttempt,
    AcceptanceExamStatus,
} from "../types";

// ============================================
// MOCK CONFIGURATION - Change these to test different states
// ============================================

/**
 * Set this to control which acceptance exam status to simulate
 * Options: "pending" | "waiting" | "rejected" | "accepted"
 */
export const MOCK_ACCEPTANCE_STATUS: AcceptanceExamStatus = "pending";

/**
 * Enable/disable mock data (set to false to use real API)
 */
export const USE_MOCK_DATA = true;

// ============================================
// Mock Questions
// ============================================

export const MOCK_QUESTIONS: AcceptanceExamQuestion[] = [
    {
        id: 1,
        acceptanceExamId: 1,
        question: "What is the capital of France?",
        type: "single_choice",
        points: 10,
        order: 1,
        explanation: "Paris is the capital and largest city of France.",
        isActive: true,
        options: [
            {
                id: 1,
                questionId: 1,
                optionText: "London",
                isCorrect: false,
                order: 1,
            },
            {
                id: 2,
                questionId: 1,
                optionText: "Paris",
                isCorrect: true,
                order: 2,
            },
            {
                id: 3,
                questionId: 1,
                optionText: "Berlin",
                isCorrect: false,
                order: 3,
            },
            {
                id: 4,
                questionId: 1,
                optionText: "Madrid",
                isCorrect: false,
                order: 4,
            },
        ],
    },
    {
        id: 2,
        acceptanceExamId: 1,
        question: "Which planet is known as the Red Planet?",
        type: "single_choice",
        points: 10,
        order: 2,
        explanation:
            "Mars is called the Red Planet due to its reddish appearance.",
        isActive: true,
        options: [
            {
                id: 5,
                questionId: 2,
                optionText: "Venus",
                isCorrect: false,
                order: 1,
            },
            {
                id: 6,
                questionId: 2,
                optionText: "Mars",
                isCorrect: true,
                order: 2,
            },
            {
                id: 7,
                questionId: 2,
                optionText: "Jupiter",
                isCorrect: false,
                order: 3,
            },
            {
                id: 8,
                questionId: 2,
                optionText: "Saturn",
                isCorrect: false,
                order: 4,
            },
        ],
    },
    {
        id: 3,
        acceptanceExamId: 1,
        question: "What is 2 + 2?",
        type: "single_choice",
        points: 5,
        order: 3,
        explanation: "Basic arithmetic: 2 + 2 = 4",
        isActive: true,
        options: [
            {
                id: 9,
                questionId: 3,
                optionText: "3",
                isCorrect: false,
                order: 1,
            },
            {
                id: 10,
                questionId: 3,
                optionText: "4",
                isCorrect: true,
                order: 2,
            },
            {
                id: 11,
                questionId: 3,
                optionText: "5",
                isCorrect: false,
                order: 3,
            },
            {
                id: 12,
                questionId: 3,
                optionText: "6",
                isCorrect: false,
                order: 4,
            },
        ],
    },
    {
        id: 4,
        acceptanceExamId: 1,
        question: "Who wrote 'Romeo and Juliet'?",
        type: "single_choice",
        points: 10,
        order: 4,
        explanation:
            "William Shakespeare wrote Romeo and Juliet around 1594-1596.",
        isActive: true,
        options: [
            {
                id: 13,
                questionId: 4,
                optionText: "Charles Dickens",
                isCorrect: false,
                order: 1,
            },
            {
                id: 14,
                questionId: 4,
                optionText: "William Shakespeare",
                isCorrect: true,
                order: 2,
            },
            {
                id: 15,
                questionId: 4,
                optionText: "Jane Austen",
                isCorrect: false,
                order: 3,
            },
            {
                id: 16,
                questionId: 4,
                optionText: "Mark Twain",
                isCorrect: false,
                order: 4,
            },
        ],
    },
    {
        id: 5,
        acceptanceExamId: 1,
        question: "What is the largest ocean on Earth?",
        type: "single_choice",
        points: 10,
        order: 5,
        explanation:
            "The Pacific Ocean is the largest and deepest ocean on Earth.",
        isActive: true,
        options: [
            {
                id: 17,
                questionId: 5,
                optionText: "Atlantic Ocean",
                isCorrect: false,
                order: 1,
            },
            {
                id: 18,
                questionId: 5,
                optionText: "Indian Ocean",
                isCorrect: false,
                order: 2,
            },
            {
                id: 19,
                questionId: 5,
                optionText: "Pacific Ocean",
                isCorrect: true,
                order: 3,
            },
            {
                id: 20,
                questionId: 5,
                optionText: "Arctic Ocean",
                isCorrect: false,
                order: 4,
            },
        ],
    },
];

// ============================================
// Mock Exam
// ============================================

export const MOCK_EXAM: AcceptanceExam = {
    id: 1,
    gradeId: 1,
    grade: {
        id: "1",
        name: "Grade 10",
        code: "G10",
    },
    title: "Acceptance Exam - Grade 10",
    description:
        "This is a sample acceptance exam to test your knowledge before joining our platform.",
    timeLimit: 30, // 30 minutes
    passingScore: 60, // 60%
    maxAttempts: 3,
    shuffleQuestions: false,
    showAnswers: false,
    isActive: true,
    questionsCount: MOCK_QUESTIONS.length,
    questions: MOCK_QUESTIONS,
};

// ============================================
// Mock Attempt (for when exam is started)
// ============================================

export const MOCK_ATTEMPT: AcceptanceExamAttempt = {
    id: 1,
    acceptanceExamId: 1,
    studentId: 1,
    attemptNumber: 1,
    status: "in_progress",
    startedAt: new Date().toISOString(),
    quiz: MOCK_EXAM,
    questions: MOCK_QUESTIONS,
};

// ============================================
// Helper function to get mock data based on status
// ============================================

export function getMockAcceptanceStatus(): AcceptanceExamStatus {
    return MOCK_ACCEPTANCE_STATUS;
}

export function getMockExam(): AcceptanceExam {
    return MOCK_EXAM;
}

export function getMockAttempt(): AcceptanceExamAttempt {
    return MOCK_ATTEMPT;
}
