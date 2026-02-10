/**
 * Assignment Submissions Types
 */

export interface SubmissionFile {
    id: number;
    name: string;
    url: string;
}

export type AssignmentStatus = "not_started" | "submitted" | "reviewed";
export type AssignmentResult = "passed" | "failed" | "needs_revision";

export interface Assignment {
    assignmentId: number;
    assignmentTitle: string;
    assignmentFileUrl: string | null;
    submissionId: number | null;
    status: AssignmentStatus;
    result: AssignmentResult | null;
    starsRating: number | null;
    score: number | null;
    maxScore: number | null;
    teacherComment: string | null;
    submittedAt: string | null;
    reviewedAt: string | null;
    files: SubmissionFile[];
}

export interface Lesson {
    lessonId: number;
    lessonTitle: string;
    assignments: Assignment[];
}

export interface AssignmentGroup {
    groupId: number;
    groupName: string;
    levelId: number;
    levelName: string | null;
    enrolledAt: string;
    lessons: Lesson[];
}

export interface SubmitAssignmentPayload {
    student_notes: string;
    files: File[];
}

export interface ReviewAssignmentPayload {
    teacher_comment: string;
    stars_rating: string;
    result: AssignmentResult;
    score: string;
    max_score: string;
}

export interface AssignmentSubmissionResponse {
    id: number;
    studentNotes: string;
    status: AssignmentStatus;
    submittedAt: string | null;
    reviewedAt: string | null;
    teacherComment: string | null;
    starsRating: number | null;
    result: AssignmentResult | null;
    score: number | null;
    maxScore: number | null;
    files: SubmissionFile[];
}
