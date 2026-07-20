import { User, Role } from "@/auth/auth.types";

export const mockAdminRole: Role = {
    id: "role-admin",
    name: "admin",
    caption: "Administrator",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
};

export const mockTeacherRole: Role = {
    id: "role-teacher",
    name: "teacher",
    caption: "Teacher",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
};

export const mockStudentRole: Role = {
    id: "role-student",
    name: "student",
    caption: "Student",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
};

export const mockAdminUser: User = {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    phoneCode: "+20",
    phoneNumber: "1234567890",
    role: mockAdminRole,
    permissions: [
        "users.view",
        "users.create",
        "users.edit",
        "users.delete",
        "courses.view",
        "courses.create",
        "courses.edit",
        "courses.delete",
        "settings.view",
        "settings.edit",
    ],
    token: "mock-admin-token",
    isActive: true,
    emailVerified: true,
    phoneVerified: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
};

export const mockTeacherUser: User = {
    id: "2",
    name: "Teacher User",
    email: "teacher@example.com",
    phoneCode: "+20",
    phoneNumber: "9876543210",
    role: mockTeacherRole,
    permissions: [
        "courses.view",
        "courses.edit",
        "lessons.view",
        "lessons.create",
        "lessons.edit",
        "students.view",
    ],
    token: "mock-teacher-token",
    isActive: true,
    emailVerified: true,
    phoneVerified: true,
    specialization: "Computer Science",
    bio: "Experienced developer and instructor.",
    createdAt: "2026-01-02T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
};

export const mockStudentUser: User = {
    id: "3",
    name: "Student User",
    email: "student@example.com",
    phoneCode: "+20",
    phoneNumber: "5555555555",
    role: mockStudentRole,
    permissions: [
        "courses.view",
        "lessons.view",
        "assignments.view",
        "assignments.submit",
    ],
    token: "mock-student-token",
    isActive: true,
    emailVerified: true,
    phoneVerified: true,
    gender: "male",
    createdAt: "2026-01-03T00:00:00.000Z",
    updatedAt: "2026-01-03T00:00:00.000Z",
};

export const mockUsersMap: Record<string, User> = {
    "admin@example.com": mockAdminUser,
    "teacher@example.com": mockTeacherUser,
    "student@example.com": mockStudentUser,
};

export const getMockUserByEmail = (email: string): User | null => {
    return mockUsersMap[email.toLowerCase()] || null;
};

export const getMockUserByToken = (token: string): User | null => {
    return Object.values(mockUsersMap).find((user) => user.token === token) || null;
};
