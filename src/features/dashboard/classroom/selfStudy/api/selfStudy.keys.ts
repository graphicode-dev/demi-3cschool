export const selfStudyKeys = {
    all: ["selfStudy"] as const,

    // Online sessions by program
    onlineSessions: (programId: number | string) =>
        [...selfStudyKeys.all, "onlineSessions", programId] as const,
};
