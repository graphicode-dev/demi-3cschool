export const myScheduleKeys = {
    all: ["mySchedule"] as const,

    myAllSessions: () => [...myScheduleKeys.all, "myAllSessions"] as const,

    myCurrentSession: () =>
        [...myScheduleKeys.all, "myCurrentSession"] as const,
};
