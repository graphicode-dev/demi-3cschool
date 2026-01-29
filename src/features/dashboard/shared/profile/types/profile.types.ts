/**
 * Profile Types
 */

export interface StudentProfile {
    id: string;
    fullName: string;
    avatar?: string;
    dateOfBirth: string;
    age: number;
    parentName: string;
    phone: string;
    email: string;
    registrationDate: string;
    status: "active" | "inactive";
    learningType: string;
}

export interface AcademicDetails {
    programType: string;
    course: string;
    groupType: string;
    groupName: string;
    instructor: string;
    schedule: string;
}

export interface GroupHistoryItem {
    id: string;
    groupName: string;
    period: string;
    instructor: string;
    status: "current" | "completed";
}

export interface AttendanceStats {
    present: number;
    absent: number;
    late: number;
    attendanceRate: number;
}

export interface AttendanceRecord {
    id: string;
    date: string;
    lesson: string;
    instructor: string;
    status: "present" | "absent" | "late";
}

export interface AssignmentRecord {
    id: string;
    title: string;
    course: string;
    lesson: string;
    dueDate: string;
    submissionDate?: string;
    status: "submitted" | "missing" | "late";
}

export interface InvoiceRecord {
    id: string;
    invoiceId: string;
    programType: string;
    courseLevel: string;
    totalAmount: number;
    paidAmount: number;
    remaining: number;
    status: "paid" | "partial" | "unpaid";
    createdAt: string;
    action?: string;
}

export interface InstallmentRecord {
    id: string;
    invoiceId: string;
    amount: number;
    dueDate: string;
    paymentDate?: string;
    status: "paid" | "pending" | "overdue";
}

export type ProfileTabType =
    | "personal"
    | "academic"
    | "groups"
    | "attendance"
    | "assignments"
    | "invoices"
    | "installments";
