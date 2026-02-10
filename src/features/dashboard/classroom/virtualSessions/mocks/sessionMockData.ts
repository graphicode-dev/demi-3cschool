export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export interface StudentAttendance {
    id: number;
    name: string;
    avatar?: string;
    status: AttendanceStatus;
}

export interface StudentReview {
    id: number;
    studentId: number;
    studentName: string;
    studentAvatar?: string;
    rating: number;
    comment?: string;
    createdAt: string;
}

export const MOCK_STUDENTS_ATTENDANCE: StudentAttendance[] = [
    { id: 1, name: "Ahmed Hassan", status: "present" },
    { id: 2, name: "Sara Mohamed", status: "present" },
    { id: 3, name: "Omar Ali", status: "late" },
    { id: 4, name: "Fatima Youssef", status: "absent" },
    { id: 5, name: "Youssef Ibrahim", status: "excused" },
    { id: 6, name: "Nour Ahmed", status: "present" },
    { id: 7, name: "Khaled Mahmoud", status: "present" },
    { id: 8, name: "Layla Samir", status: "absent" },
];

export const MOCK_STUDENT_REVIEWS: StudentReview[] = [
    {
        id: 1,
        studentId: 1,
        studentName: "Ahmed Hassan",
        rating: 5,
        comment: "Excellent session! Very clear explanations.",
        createdAt: "2024-01-15T10:30:00Z",
    },
    {
        id: 2,
        studentId: 2,
        studentName: "Sara Mohamed",
        rating: 4,
        comment: "Good content, would like more examples.",
        createdAt: "2024-01-15T11:00:00Z",
    },
    {
        id: 3,
        studentId: 3,
        studentName: "Omar Ali",
        rating: 5,
        createdAt: "2024-01-15T11:15:00Z",
    },
    {
        id: 4,
        studentId: 6,
        studentName: "Nour Ahmed",
        rating: 3,
        comment: "The pace was a bit fast for me.",
        createdAt: "2024-01-15T12:00:00Z",
    },
    {
        id: 5,
        studentId: 7,
        studentName: "Khaled Mahmoud",
        rating: 4,
        comment: "Very helpful session!",
        createdAt: "2024-01-15T12:30:00Z",
    },
];

export const MOCK_CURRENT_STUDENT_ATTENDANCE: AttendanceStatus = "present";
