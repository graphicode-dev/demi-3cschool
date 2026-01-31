import type { Project, Lesson } from "../types";

export const MOCK_LESSONS: Lesson[] = [
    { id: 1, title: "Intro to Coding", order: 1 },
    { id: 2, title: "Intro to Logic", order: 2 },
    { id: 3, title: "Variables", order: 3 },
    { id: 4, title: "Loops & Repetition", order: 4 },
    { id: 5, title: "Functions & Methods", order: 5 },
];

export const MOCK_PROJECTS: Project[] = [
    {
        id: 1,
        lessonId: 3,
        lessonTitle: "Variables",
        lessonOrder: 3,
        title: "Create Your First Variable",
        description:
            "Create a variable named 'score' and assign it a value of 100.",
        status: "new",
        homeworkFile: {
            name: "Variables_Homework.pdf",
            type: "PDF",
            size: "2.5 MB",
            url: "#",
            previewUrl: "#",
        },
    },
    {
        id: 2,
        lessonId: 3,
        lessonTitle: "Variables",
        lessonOrder: 3,
        title: "Create Your First Variable",
        description:
            "Create a variable named 'score' and assign it a value of 100.",
        status: "under_review",
        submissionDate: "2026-01-28",
        homeworkFile: {
            name: "Variables_Homework.pdf",
            type: "PDF",
            size: "2.5 MB",
            url: "#",
            previewUrl: "#",
        },
    },
    {
        id: 3,
        lessonId: 1,
        lessonTitle: "Intro to Coding",
        lessonOrder: 1,
        title: "Binary Code Secret",
        description: "Decode the secret message written in binary.",
        status: "reviewed",
        submissionDate: "2026-01-25",
        grade: 8,
        maxGrade: 10,
        feedback:
            "Excellent work on the loop logic, Jamie! You used variables correctly to track the player's score. Try adding a custom sound effect next time to make it even more fun!",
        homeworkFile: {
            name: "Binary_Homework.pdf",
            type: "PDF",
            size: "1.8 MB",
            url: "#",
            previewUrl: "#",
        },
    },
];

export const USE_MOCK_DATA = true;
