export interface Project {
    id: number;
    lessonId: number;
    lessonTitle: string;
    title: string;
    description: string;
    status: "pending" | "submitted" | "graded";
    submissionDate?: string;
    grade?: number;
    feedback?: string;
}

export interface Lesson {
    id: number;
    title: string;
    order: number;
}
