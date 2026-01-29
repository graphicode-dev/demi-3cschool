/**
 * Profile Mock Data
 * TODO: Replace with actual API calls
 */

import type {
    StudentProfile,
    AcademicDetails,
    GroupHistoryItem,
    AttendanceStats,
    AttendanceRecord,
    AssignmentRecord,
    InvoiceRecord,
    InstallmentRecord,
} from "../types/profile.types";

export const mockStudentProfile: StudentProfile = {
    id: "1",
    fullName: "Ahmed Ali",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    dateOfBirth: "May 15, 2012",
    age: 12,
    parentName: "Ali Mohamed",
    phone: "+20 100 123 4567",
    email: "mohamed.ahmed@email.com",
    registrationDate: "September 1, 2023",
    status: "active",
    learningType: "Professional Learning",
};

export const mockAcademicDetails: AcademicDetails = {
    programType: "Professional Learning",
    course: "Full Stack Course",
    groupType: "Semi Private",
    groupName: "WebDev-SP-2024-A",
    instructor: "Ahmed Hasan",
    schedule: "Mon & Wed, 4:00 PM - 5:30 PM",
};

export const mockGroupHistory: GroupHistoryItem[] = [
    {
        id: "1",
        groupName: "WebDev-SP-2024-A",
        period: "Jan 2024 - Present",
        instructor: "Ahmed Hasan",
        status: "current",
    },
    {
        id: "2",
        groupName: "Intro-Programming-R-2023",
        period: "Sep 2023 - Dec 2023",
        instructor: "Sara Ahmed",
        status: "completed",
    },
];

export const mockAttendanceStats: AttendanceStats = {
    present: 45,
    absent: 22,
    late: 2,
    attendanceRate: 92,
};

export const mockAttendanceRecords: AttendanceRecord[] = [
    {
        id: "1",
        date: "Jan 15, 2024",
        lesson: "L5: HELLO WORLD",
        instructor: "Sara Ahmed",
        status: "present",
    },
    {
        id: "2",
        date: "Jan 17, 2024",
        lesson: "L7: HELLO WORLD",
        instructor: "Sara Ahmed",
        status: "absent",
    },
    {
        id: "3",
        date: "Jan 19, 2024",
        lesson: "L9: HELLO WORLD",
        instructor: "Sara Ahmed",
        status: "late",
    },
];

export const mockAssignments: AssignmentRecord[] = [
    {
        id: "1",
        title: "Python Basics",
        course: "Python for Beginners",
        lesson: "L5: Loops",
        dueDate: "Jan 15, 2024",
        submissionDate: "Jan 14, 2024",
        status: "submitted",
    },
    {
        id: "2",
        title: "Python Basics",
        course: "Python for Beginners",
        lesson: "L5: Loops",
        dueDate: "Jan 15, 2024",
        submissionDate: "Feb 15, 2024",
        status: "missing",
    },
    {
        id: "3",
        title: "Python Basics",
        course: "Python for Beginners",
        lesson: "L5: Loops",
        dueDate: "Jan 15, 2024",
        submissionDate: "Mar 14, 2024",
        status: "late",
    },
];

export const mockInvoices: InvoiceRecord[] = [
    {
        id: "1",
        invoiceId: "INV-2024-001",
        programType: "Standard",
        courseLevel: "Web Development Fundamentals",
        totalAmount: 5000,
        paidAmount: 5000,
        remaining: 0,
        status: "paid",
        createdAt: "Jan 15, 2024",
    },
    {
        id: "2",
        invoiceId: "INV-2024-002",
        programType: "Premium",
        courseLevel: "Python Programming",
        totalAmount: 2000,
        paidAmount: 1000,
        remaining: 1000,
        status: "partial",
        createdAt: "Feb 20, 2024",
    },
    {
        id: "3",
        invoiceId: "INV-2024-003",
        programType: "Standard",
        courseLevel: "Web Development",
        totalAmount: 3500,
        paidAmount: 0,
        remaining: 3500,
        status: "unpaid",
        createdAt: "Mar 10, 2024",
    },
];

export const mockInstallments: InstallmentRecord[] = [
    {
        id: "1",
        invoiceId: "INV-2024-001",
        amount: 6000,
        dueDate: "Jan 15, 2024",
        paymentDate: "Jan 15, 2024",
        status: "paid",
    },
    {
        id: "2",
        invoiceId: "INV-2024-001",
        amount: 5999,
        dueDate: "Jan 15, 2024",
        paymentDate: "Feb 15, 2024",
        status: "paid",
    },
    {
        id: "3",
        invoiceId: "INV-2024-001",
        amount: 7000,
        dueDate: "Jan 15, 2024",
        paymentDate: "Mar 14, 2024",
        status: "pending",
    },
];
