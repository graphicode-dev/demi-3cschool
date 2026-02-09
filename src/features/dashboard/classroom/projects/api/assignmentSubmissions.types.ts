/**
 * Assignment Submissions Types
 */

export interface AssignmentFile {
    id: number;
    name: string;
    url: string;
    size: number;
    mimeType: string;
}

export interface AssignmentInfo {
    id: number;
    title: string;
    lessonId: number;
    lesson: Record<string, unknown>;
    fileUrl: string;
}

export interface StudentInfo {
    id: number;
    name: string;
    email?: string;
}

export interface ReviewerInfo {
    id: number;
    name: string;
}

export type SubmissionStatus = "submitted" | "reviewed" | "pending";
export type SubmissionResult = "passed" | "failed" | "needs_revision";

export interface AssignmentSubmission {
    id: number;
    studentNotes: string;
    status: SubmissionStatus;
    submittedAt: string | null;
    reviewedAt: string | null;
    teacherComment: string | null;
    starsRating: number | null;
    result: SubmissionResult | null;
    score: number | null;
    maxScore: number | null;
    scorePercentage: number | null;
    assignment: AssignmentInfo;
    student: StudentInfo;
    reviewer: ReviewerInfo | Record<string, unknown>;
    files: AssignmentFile[];
    createdAt: string;
    updatedAt: string;
}

export interface AssignmentGroup {
    groupId: number;
    groupName: string;
    levelId: number;
    levelName: string | null;
    studentsCount: number;
    students: StudentInfo[];
}

export interface SubmitAssignmentPayload {
    student_notes: string;
    files: File[];
}

export interface ReviewAssignmentPayload {
    teacher_comment: string;
    stars_rating: string;
    result: SubmissionResult;
    score: string;
    max_score: string;
}
