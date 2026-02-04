export const selfStudyKeys = {
    all: ["selfStudy"] as const,

    // Online sessions by program
    mySessions: (programId: number | string) =>
        [...selfStudyKeys.all, "mySessions", programId] as const,
};
