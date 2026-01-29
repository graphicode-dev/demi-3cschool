export const acceptanceTestKeys = {
    all: ["acceptanceTest"] as const,

    // Student keys
    studentExam: () => [...acceptanceTestKeys.all, "studentExam"] as const,
    examById: (examId: string) =>
        [...acceptanceTestKeys.all, "exam", examId] as const,
    myAttempts: () => [...acceptanceTestKeys.all, "myAttempts"] as const,
    attemptResult: (attemptId: string) =>
        [...acceptanceTestKeys.all, "attemptResult", attemptId] as const,

    // Admin - Exams keys
    adminExams: () => [...acceptanceTestKeys.all, "admin", "exams"] as const,
    adminExamsList: (params?: { page?: number; search?: string }) =>
        [...acceptanceTestKeys.adminExams(), "list", params] as const,
    adminExamDetail: (id: string) =>
        [...acceptanceTestKeys.adminExams(), "detail", id] as const,
    adminExamAttempts: (examId: string) =>
        [...acceptanceTestKeys.adminExams(), "attempts", examId] as const,

    // Admin - Questions keys
    adminQuestions: () =>
        [...acceptanceTestKeys.all, "admin", "questions"] as const,

    // Admin - Students keys
    adminStudents: () =>
        [...acceptanceTestKeys.all, "admin", "students"] as const,
    adminStudentsList: (params?: {
        status?: string;
        search?: string;
        page?: number;
    }) => [...acceptanceTestKeys.adminStudents(), "list", params] as const,
    adminStudentAttemptResult: (attemptId: string) =>
        [
            ...acceptanceTestKeys.adminStudents(),
            "attemptResult",
            attemptId,
        ] as const,
};
