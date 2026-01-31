export interface GroupStudent {
    id: string;
    enrolledAt: string;
    leftAt: string | null;
    status: StudentStatus;
    note: string;
    student: {
        id: string;
        name: string;
    };
    group?: {
        id: number;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
}

export type StudentStatus = "active" | "inactive" | "transferred" | "completed";

export interface AssignStudentPayload {
    student_id: string;
    note?: string;
}

export interface UpdateStudentEnrollmentPayload {
    status?: StudentStatus;
    enrolledAt?: string;
    leftAt?: string;
    note?: string;
}

export interface TransferStudentPayload {
    newGroupId: number;
    note?: string;
}

export interface GetGroupStudentsResponse {
    success: boolean;
    message: string;
    data: GroupStudent[];
}

export interface AssignStudentResponse {
    success: boolean;
    message: string;
    data: GroupStudent;
}

export interface UpdateStudentEnrollmentResponse {
    success: boolean;
    message: string;
    data: GroupStudent;
}

export interface TransferStudentResponse {
    success: boolean;
    message: string;
    data: GroupStudent;
}

export interface DeleteStudentResponse {
    success: boolean;
    message: string;
}
