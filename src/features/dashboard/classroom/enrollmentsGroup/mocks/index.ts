/**
 * Enrollments Group Mock Data
 */

import type { EnrollmentGroup, EnrollmentState } from "../types";

export const MOCK_ONLINE_GROUPS: EnrollmentGroup[] = [
    {
        id: 1,
        sessionType: "online",
        day: "friday",
        startTime: "4:00 PM",
        endTime: "6:00 PM",
    },
    {
        id: 2,
        sessionType: "online",
        day: "saturday",
        startTime: "4:00 PM",
        endTime: "6:00 PM",
    },
    {
        id: 3,
        sessionType: "online",
        day: "friday",
        startTime: "4:00 PM",
        endTime: "6:00 PM",
    },
    {
        id: 4,
        sessionType: "online",
        day: "friday",
        startTime: "4:00 PM",
        endTime: "6:00 PM",
    },
];

export const MOCK_OFFLINE_GROUPS: EnrollmentGroup[] = [
    {
        id: 5,
        sessionType: "offline",
        day: "friday",
        startTime: "4:00 PM",
        endTime: "6:00 PM",
        location: "Downtown Center",
        address: "45 Creative Ave, Arts Zone",
    },
    {
        id: 6,
        sessionType: "offline",
        day: "friday",
        startTime: "4:00 PM",
        endTime: "6:00 PM",
        location: "Downtown Center",
        address: "45 Creative Ave, Arts Zone",
    },
    {
        id: 7,
        sessionType: "offline",
        day: "friday",
        startTime: "4:00 PM",
        endTime: "6:00 PM",
        location: "Downtown Center",
        address: "45 Creative Ave, Arts Zone",
    },
];

// Mock state for not enrolled user
export const MOCK_NOT_ENROLLED_STATE: EnrollmentState = {
    onlineGroup: null,
    offlineGroup: null,
    offlineUnlocked: false,
    onlineSessionsCompleted: 0,
    requiredOnlineSessions: 8,
};

// Mock state for not enrolled user but offline unlocked (to see offline group cards)
export const MOCK_NOT_ENROLLED_OFFLINE_UNLOCKED: EnrollmentState = {
    onlineGroup: null,
    offlineGroup: null,
    offlineUnlocked: true,
    onlineSessionsCompleted: 8,
    requiredOnlineSessions: 8,
};

// Mock state for enrolled online user
export const MOCK_ENROLLED_ONLINE_STATE: EnrollmentState = {
    onlineGroup: {
        id: 1,
        sessionType: "online",
        day: "friday",
        startTime: "4:00 PM",
        endTime: "6:00 PM",
        isEnrolled: true,
        isActive: true,
    },
    offlineGroup: null,
    offlineUnlocked: false,
    onlineSessionsCompleted: 3,
    requiredOnlineSessions: 8,
};

// Mock state for enrolled offline user
export const MOCK_ENROLLED_OFFLINE_STATE: EnrollmentState = {
    onlineGroup: {
        id: 1,
        sessionType: "online",
        day: "friday",
        startTime: "4:00 PM",
        endTime: "6:00 PM",
        isEnrolled: true,
        isActive: true,
    },
    offlineGroup: {
        id: 5,
        sessionType: "offline",
        day: "friday",
        startTime: "4:00 PM",
        endTime: "6:00 PM",
        location: "Downtown Center",
        address: "45 Creative Ave, Arts Zone",
        isEnrolled: true,
        isActive: true,
    },
    offlineUnlocked: true,
    onlineSessionsCompleted: 8,
    requiredOnlineSessions: 8,
};
