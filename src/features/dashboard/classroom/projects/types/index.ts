export type ProjectStatus = "new" | "under_review" | "reviewed" | "completed";

export interface Project {
    id: number;
    assignmentId?: string;
    groupId?: number;
    lessonId: number;
    lessonTitle: string;
    lessonOrder: number;
    title: string;
    description: string;
    status: ProjectStatus;
    submissionDate?: string;
    grade?: number;
    maxGrade?: number;
    feedback?: string;
    homeworkFile?: {
        name: string;
        type: string;
        size: string;
        url: string;
        previewUrl?: string;
    };
}

export interface Lesson {
    id: number;
    title: string;
    order: number;
}
