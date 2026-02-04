export const physicalSessionsKeys = {
    all: ["physicalSessions"] as const,

    // Offline sessions by program
    offlineSessions: (programId: number | string) =>
        [...physicalSessionsKeys.all, "offlineSessions", programId] as const,
};
