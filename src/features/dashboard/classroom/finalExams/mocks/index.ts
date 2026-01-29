import type { FinalExam } from "../types";

export const MOCK_FINAL_EXAMS: FinalExam[] = [
    {
        id: 1,
        title: "Final Exam – Period 1",
        period: 1,
        duration: 90,
        questionsCount: 35,
        status: "completed",
        takenDate: "Oct 15",
        score: 85,
        totalScore: 100,
    },
    {
        id: 2,
        title: "Final Exam – Period 2",
        period: 2,
        duration: 90,
        questionsCount: 35,
        status: "available",
        takenDate: "Oct 15",
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

export const USE_MOCK_DATA = true;
