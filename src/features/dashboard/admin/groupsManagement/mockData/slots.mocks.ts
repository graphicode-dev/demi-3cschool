export type MockLocationType = "online" | "offline";

export type MockScheduleSlot = {
    startTime: string;
    endTime: string;
};

const MOCK_SLOTS: Record<MockLocationType, Record<string, MockScheduleSlot[]>> = {
    online: {
        friday: [
            { startTime: "08:30:00", endTime: "10:00:00" },
            { startTime: "10:30:00", endTime: "12:00:00" },
        ],
        saturday: [
            { startTime: "09:00:00", endTime: "10:30:00" },
            { startTime: "11:00:00", endTime: "12:30:00" },
        ],
    },
    offline: {
        friday: [
            { startTime: "13:00:00", endTime: "14:30:00" },
            { startTime: "15:00:00", endTime: "16:30:00" },
        ],
        saturday: [
            { startTime: "08:00:00", endTime: "09:30:00" },
            { startTime: "10:00:00", endTime: "11:30:00" },
        ],
    },
};

export function getMockScheduleSlots(params: {
    day: string;
    locationType: MockLocationType;
}): MockScheduleSlot[] {
    const slotsByDay = MOCK_SLOTS[params.locationType];
    return slotsByDay[params.day] ?? [];
}
