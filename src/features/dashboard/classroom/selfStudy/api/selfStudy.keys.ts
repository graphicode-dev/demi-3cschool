export const selfStudyKeys = {
    all: ["selfStudy"] as const,

    // Online sessions by program
    mySessions: (programId: number | string) =>
        [...selfStudyKeys.all, "mySessions", programId] as const,

    // Session reviews
    contentReview: (sessionId: number | string) =>
        [...selfStudyKeys.all, "contentReview", sessionId] as const,
    teacherReview: (sessionId: number | string) =>
        [...selfStudyKeys.all, "teacherReview", sessionId] as const,
};
