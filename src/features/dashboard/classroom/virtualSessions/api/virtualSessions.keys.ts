export const virtualSessionsKeys = {
    all: ["virtualSessions"] as const,

    // Online sessions by program
    onlineSessions: (programId: number | string) =>
        [...virtualSessionsKeys.all, "onlineSessions", programId] as const,
};
