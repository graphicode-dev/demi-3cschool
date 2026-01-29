import type { SelfStudyContent, Term, Course, CourseSession } from "../types";

export const MOCK_TERMS: Term[] = [
    {
        id: 1,
        name: "firstTerm",
        order: 1,
        status: "completed",
    },
    {
        id: 2,
        name: "secondTerm",
        order: 2,
        status: "current",
    },
    {
        id: 3,
        name: "summerTerm",
        order: 3,
        status: "locked",
    },
];

// First term sessions (all completed)
export const MOCK_FIRST_TERM_SESSIONS: CourseSession[] = [
    {
        id: 101,
        courseId: 100,
        title: "Introduction to Programming",
        type: "online",
        order: 1,
        status: "completed",
    },
    {
        id: 102,
        courseId: 100,
        title: "Basic Syntax",
        type: "online",
        order: 2,
        status: "completed",
    },
    {
        id: 103,
        courseId: 100,
        title: "Variables Basics",
        type: "online",
        order: 3,
        status: "completed",
    },
    {
        id: 104,
        courseId: 100,
        title: "Input & Output",
        type: "online",
        order: 4,
        status: "completed",
    },
    {
        id: 105,
        courseId: 100,
        title: "Basic Operations",
        type: "online",
        order: 5,
        status: "completed",
    },
    {
        id: 106,
        courseId: 100,
        title: "String Manipulation",
        type: "online",
        order: 6,
        status: "completed",
    },
    {
        id: 107,
        courseId: 100,
        title: "Simple Functions",
        type: "online",
        order: 7,
        status: "completed",
    },
    {
        id: 108,
        courseId: 100,
        title: "Review Session",
        type: "online",
        order: 8,
        status: "completed",
    },
    {
        id: 109,
        courseId: 100,
        title: "First Term Project",
        type: "offline",
        order: 9,
        status: "completed",
        location: "atTrainingCenter",
    },
];

// Second term sessions (current term)
export const MOCK_SESSIONS: CourseSession[] = [
    {
        id: 1,
        courseId: 1,
        title: "Thinking Like a Computer",
        type: "online",
        order: 1,
        status: "completed",
    },
    {
        id: 2,
        courseId: 1,
        title: "Variables & Data Types",
        type: "online",
        order: 2,
        status: "completed",
    },
    {
        id: 3,
        courseId: 1,
        title: "Conditionals: If & Else",
        type: "online",
        order: 3,
        status: "current",
    },
    {
        id: 4,
        courseId: 1,
        title: "Looping Structures",
        type: "online",
        order: 4,
        status: "locked",
    },
    {
        id: 5,
        courseId: 1,
        title: "Functions & Methods",
        type: "online",
        order: 5,
        status: "locked",
    },
    {
        id: 6,
        courseId: 1,
        title: "Lists & Arrays",
        type: "online",
        order: 6,
        status: "locked",
    },
    {
        id: 7,
        courseId: 1,
        title: "Dictionaries",
        type: "online",
        order: 7,
        status: "locked",
    },
    {
        id: 8,
        courseId: 1,
        title: "File Handling",
        type: "online",
        order: 8,
        status: "locked",
    },
    {
        id: 9,
        courseId: 1,
        title: "Final Project Workshop",
        type: "offline",
        order: 9,
        status: "locked",
        location: "atTrainingCenter",
    },
];

export const MOCK_FIRST_TERM_COURSE: Course = {
    id: 100,
    termId: 1,
    title: "Programming Fundamentals",
    description:
        "This is the official course for your grade this term. When you complete it, you will automatically move to the next course.",
    onlineSessionsCount: 8,
    offlineSessionsCount: 1,
    sessions: MOCK_FIRST_TERM_SESSIONS,
};

export const MOCK_COURSE: Course = {
    id: 1,
    termId: 2,
    title: "Introduction to Python Logic",
    description:
        "This is the official course for your grade this term. When you complete it, you will automatically move to the next course.",
    onlineSessionsCount: 8,
    offlineSessionsCount: 1,
    sessions: MOCK_SESSIONS,
};

export const MOCK_SELF_STUDY_CONTENT: SelfStudyContent = {
    terms: MOCK_TERMS,
    currentTermId: 2,
    course: MOCK_COURSE,
};

export const USE_MOCK_DATA = true;
