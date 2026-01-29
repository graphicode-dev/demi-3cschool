export type ExamStatus = "completed" | "available" | "locked";

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
}
