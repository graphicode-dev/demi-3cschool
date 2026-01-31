import type {
    FinalExam,
    FinalExamQuestion,
    FinalExamAttempt,
    FinalExamResult,
} from "../types";

export const MOCK_FINAL_EXAMS: FinalExam[] = [
    {
        id: 1,
        title: "Final Exam – Period 1",
        period: 1,
        duration: 90,
        questionsCount: 35,
        status: "completed",
        takenDate: "Oct 15",
        score: 28,
        totalScore: 30,
    },
    {
        id: 2,
        title: "Final Exam – Period 2",
        period: 2,
        duration: 90,
        questionsCount: 35,
        status: "available",
        availableUntil: "Today until 4:00 PM",
        maxAttempts: 1,
    },
    {
        id: 3,
        title: "Final Exam – Period 3",
        period: 3,
        duration: 90,
        questionsCount: 35,
        status: "locked",
        opensDate: "Dec 10",
    },
];

export const MOCK_EXAM_QUESTIONS: FinalExamQuestion[] = [
    {
        id: 1,
        examId: 2,
        question: "React is a JavaScript library for building user interfaces.",
        type: "true_false",
        points: 1,
        order: 1,
        options: [
            { id: 1, questionId: 1, optionText: "TRUE", order: 1 },
            { id: 2, questionId: 1, optionText: "FALSE", order: 2 },
        ],
    },
    {
        id: 2,
        examId: 2,
        question:
            "TypeScript is a superset of JavaScript that adds static typing.",
        type: "true_false",
        points: 1,
        order: 2,
        options: [
            { id: 3, questionId: 2, optionText: "TRUE", order: 1 },
            { id: 4, questionId: 2, optionText: "FALSE", order: 2 },
        ],
    },
    {
        id: 3,
        examId: 2,
        question: "CSS stands for Cascading Style Sheets.",
        type: "true_false",
        points: 1,
        order: 3,
        options: [
            { id: 5, questionId: 3, optionText: "TRUE", order: 1 },
            { id: 6, questionId: 3, optionText: "FALSE", order: 2 },
        ],
    },
];

export const MOCK_EXAM_WITH_QUESTIONS: FinalExam = {
    ...MOCK_FINAL_EXAMS[1],
    questions: MOCK_EXAM_QUESTIONS,
};

export const MOCK_ATTEMPT: FinalExamAttempt = {
    id: 1,
    examId: 2,
    studentId: 1,
    attemptNumber: 1,
    status: "in_progress",
    startedAt: new Date().toISOString(),
    exam: MOCK_EXAM_WITH_QUESTIONS,
    questions: MOCK_EXAM_QUESTIONS,
};

export const MOCK_RESULT_PASSED: FinalExamResult = {
    id: 1,
    attemptId: 1,
    status: "passed",
    score: 28,
    totalPoints: 30,
    percentage: 93,
    passed: true,
    completedAt: new Date().toISOString(),
};

export const MOCK_RESULT_UNDER_REVIEW: FinalExamResult = {
    id: 2,
    attemptId: 2,
    status: "under_review",
    score: 0,
    totalPoints: 30,
    percentage: 0,
    passed: false,
    completedAt: new Date().toISOString(),
};

export const USE_MOCK_DATA = true;
