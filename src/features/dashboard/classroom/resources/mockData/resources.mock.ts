/**
 * Learning Resources Feature - Mock Data
 *
 * Mock data for development and testing.
 */

import type { Session, Resource } from "../types";

export const mockResources: Resource[] = [
    // Session 1 resources
    {
        id: "res-1",
        title: "Welcome Guide",
        type: "file",
        size: "2.5 MB",
        url: "/files/welcome-guide.pdf",
        sessionId: "session-1",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
    },
    {
        id: "res-2",
        title: "What is Coding?",
        type: "video",
        duration: "5:00",
        url: "/videos/what-is-coding.mp4",
        thumbnailUrl: "/thumbnails/what-is-coding.jpg",
        sessionId: "session-1",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
    },
    {
        id: "res-3",
        title: "Computer Parts",
        type: "image",
        size: "1.2 MB",
        url: "/images/computer-parts.png",
        thumbnailUrl: "/thumbnails/computer-parts.jpg",
        sessionId: "session-1",
        createdAt: "2024-01-15T11:00:00Z",
        updatedAt: "2024-01-15T11:00:00Z",
    },
    // Session 2 resources
    {
        id: "res-4",
        title: "Algorithm Basics",
        type: "video",
        duration: "8:30",
        url: "/videos/algorithm-basics.mp4",
        thumbnailUrl: "/thumbnails/algorithm-basics.jpg",
        sessionId: "session-2",
        createdAt: "2024-01-16T10:00:00Z",
        updatedAt: "2024-01-16T10:00:00Z",
    },
    {
        id: "res-5",
        title: "Flowchart Examples",
        type: "image",
        size: "800 KB",
        url: "/images/flowchart-examples.png",
        sessionId: "session-2",
        createdAt: "2024-01-16T10:30:00Z",
        updatedAt: "2024-01-16T10:30:00Z",
    },
    {
        id: "res-6",
        title: "Algorithm Cheatsheet",
        type: "file",
        size: "1.1 MB",
        url: "/files/algorithm-cheatsheet.pdf",
        sessionId: "session-2",
        createdAt: "2024-01-16T11:00:00Z",
        updatedAt: "2024-01-16T11:00:00Z",
    },
    {
        id: "res-7",
        title: "Sorting Explained",
        type: "video",
        duration: "12:00",
        url: "/videos/sorting-explained.mp4",
        sessionId: "session-2",
        createdAt: "2024-01-16T11:30:00Z",
        updatedAt: "2024-01-16T11:30:00Z",
    },
    {
        id: "res-8",
        title: "Algorithm Audio Guide",
        type: "audio",
        duration: "15:00",
        url: "/audio/algorithm-guide.mp3",
        sessionId: "session-2",
        createdAt: "2024-01-16T12:00:00Z",
        updatedAt: "2024-01-16T12:00:00Z",
    },
    // Session 3 resources
    {
        id: "res-9",
        title: "Variables Introduction",
        type: "video",
        duration: "6:45",
        url: "/videos/variables-intro.mp4",
        sessionId: "session-3",
        createdAt: "2024-01-17T10:00:00Z",
        updatedAt: "2024-01-17T10:00:00Z",
    },
    {
        id: "res-10",
        title: "Variable Types Diagram",
        type: "image",
        size: "500 KB",
        url: "/images/variable-types.png",
        sessionId: "session-3",
        createdAt: "2024-01-17T10:30:00Z",
        updatedAt: "2024-01-17T10:30:00Z",
    },
    // Session 4 resources
    {
        id: "res-11",
        title: "Advanced Variables",
        type: "video",
        duration: "10:00",
        url: "/videos/advanced-variables.mp4",
        sessionId: "session-4",
        createdAt: "2024-01-18T10:00:00Z",
        updatedAt: "2024-01-18T10:00:00Z",
    },
    {
        id: "res-12",
        title: "Practice Exercises",
        type: "file",
        size: "3.0 MB",
        url: "/files/practice-exercises.pdf",
        sessionId: "session-4",
        createdAt: "2024-01-18T10:30:00Z",
        updatedAt: "2024-01-18T10:30:00Z",
    },
    // Session 5 has no resources
];

export const mockSessions: Session[] = [
    {
        id: "session-1",
        title: "Session 1: Intro to Coding",
        order: 1,
        resourceCount: 3,
        resources: mockResources.filter((r) => r.sessionId === "session-1"),
        createdAt: "2024-01-15T09:00:00Z",
        updatedAt: "2024-01-15T11:00:00Z",
    },
    {
        id: "session-2",
        title: "Session 2: Algorithms",
        order: 2,
        resourceCount: 5,
        resources: mockResources.filter((r) => r.sessionId === "session-2"),
        createdAt: "2024-01-16T09:00:00Z",
        updatedAt: "2024-01-16T12:00:00Z",
    },
    {
        id: "session-3",
        title: "Session 3: Variables",
        order: 3,
        resourceCount: 2,
        resources: mockResources.filter((r) => r.sessionId === "session-3"),
        createdAt: "2024-01-17T09:00:00Z",
        updatedAt: "2024-01-17T10:30:00Z",
    },
    {
        id: "session-4",
        title: "Session 4: Variables",
        order: 4,
        resourceCount: 2,
        resources: mockResources.filter((r) => r.sessionId === "session-4"),
        createdAt: "2024-01-18T09:00:00Z",
        updatedAt: "2024-01-18T10:30:00Z",
    },
    {
        id: "session-5",
        title: "Session 5: Conditionals",
        order: 5,
        resourceCount: 0,
        resources: [],
        createdAt: "2024-01-19T09:00:00Z",
        updatedAt: "2024-01-19T09:00:00Z",
    },
];

export const getSessionById = (id: string): Session | undefined => {
    return mockSessions.find((session) => session.id === id);
};

export const getResourcesBySessionId = (sessionId: string): Resource[] => {
    return mockResources.filter((resource) => resource.sessionId === sessionId);
};

export const getResourcesByType = (
    sessionId: string,
    type: string
): Resource[] => {
    if (type === "all") {
        return getResourcesBySessionId(sessionId);
    }
    return mockResources.filter(
        (resource) => resource.sessionId === sessionId && resource.type === type
    );
};
