import type { Project, Lesson } from "../types";

export const MOCK_LESSONS: Lesson[] = [
    { id: 1, title: "Introduction to Programming", order: 1 },
    { id: 2, title: "Intro to Logic", order: 2 },
    { id: 3, title: "Variables & Data Types", order: 3 },
    { id: 4, title: "Loops & Repetition", order: 4 },
    { id: 5, title: "Functions & Methods", order: 5 },
];

export const MOCK_PROJECTS: Project[] = [
    {
        id: 1,
        lessonId: 2,
        lessonTitle: "Lesson 2: Intro to Logic",
        title: "Sandwich Algorithm",
        description:
            "Write down the step-by-step instructions (algorithm) to make your favorite sandwich.",
        status: "pending",
    },
    {
        id: 2,
        lessonId: 2,
        lessonTitle: "Lesson 2: Intro to Logic",
        title: "Morning Routine Algorithm",
        description:
            "Create an algorithm that describes your morning routine from waking up to leaving for school.",
        status: "submitted",
        submissionDate: "2026-01-28",
    },
    {
        id: 3,
        lessonId: 3,
        lessonTitle: "Lesson 3: Variables & Data Types",
        title: "Variable Explorer",
        description:
            "Identify and categorize different types of data you encounter in daily life.",
        status: "graded",
        submissionDate: "2026-01-25",
        grade: 95,
        feedback: "Excellent work! Great examples.",
    },
    {
        id: 4,
        lessonId: 4,
        lessonTitle: "Lesson 4: Loops & Repetition",
        title: "Loop Patterns",
        description:
            "Create visual patterns using loops and repetition concepts.",
        status: "pending",
    },
];

export const USE_MOCK_DATA = true;
