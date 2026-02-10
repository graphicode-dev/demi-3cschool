/**
 * Final Exams Query Keys
 * Centralized query key factory for TanStack Query
 */
export const finalExamsKeys = {
    all: ["final-exams"] as const,

    /** My final exams list */
    myFinalExams: () => [...finalExamsKeys.all, "my-final-exams"] as const,

    /** Attempts history for a quiz */
    attemptsHistory: (quizId: string) =>
        [...finalExamsKeys.all, "attempts-history", quizId] as const,

    /** Single attempt */
    attempt: (attemptId: string) =>
        [...finalExamsKeys.all, "attempt", attemptId] as const,
};
