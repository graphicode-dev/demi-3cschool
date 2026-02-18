import type { PermissionDefinition, MockUser } from "../types";

export const AVAILABLE_PERMISSIONS: PermissionDefinition[] = [
    {
        id: "view_dashboard",
        label: "Access Dashboard",
        category: "System",
        description:
            "Allows viewing of global metrics and system status.",
    },
    {
        id: "manage_blocks",
        label: "Manage Blocks",
        category: "Infrastructure",
        description:
            "Can create, edit, or decommission hub blocks.",
    },
    {
        id: "manage_groups",
        label: "Manage Groups",
        category: "Infrastructure",
        description:
            "Full control over student cohorts and assignments.",
    },
    {
        id: "edit_users",
        label: "Modify Personnel",
        category: "Personnel",
        description: "Change user details, roles, and status.",
    },
    {
        id: "delete_users",
        label: "Terminate Users",
        category: "Personnel",
        description:
            "Archiving and deleting user digital identities.",
    },
    {
        id: "manage_roles",
        label: "Schema Control",
        category: "Personnel",
        description:
            "Modify the 5-level hierarchy and role permissions.",
    },
    {
        id: "create_post",
        label: "Publish Content",
        category: "Community",
        description:
            "Post to the public feed or specific channels.",
    },
    {
        id: "moderate_content",
        label: "Moderate Feed",
        category: "Community",
        description:
            "Approve, reject, or delete community posts.",
    },
    {
        id: "manage_finances",
        label: "Audit Finances",
        category: "Admin",
        description:
            "Access to financial logs and billing infrastructure.",
    },
    {
        id: "view_exams",
        label: "Exam Access",
        category: "Academy",
        description: "View and grade final student exams.",
    },
];

const INSTRUCTORS: MockUser[] = Array.from({ length: 20 }).map((_, i) => ({
    id: `i${i + 1}`,
    name: `Prof. ${
        [
            "Smith",
            "Jones",
            "Taylor",
            "Brown",
            "Wilson",
            "Evans",
            "Thomas",
            "Roberts",
            "Walker",
            "Snape",
            "Dumbledore",
            "McGonagall",
            "Lupin",
            "Moody",
            "Flitwick",
            "Sprout",
            "Slughorn",
            "Trelawney",
            "Hagrid",
            "Sinistra",
        ][i]
    }`,
    level: "agent" as const,
    role: "instructor" as const,
    blockId: i % 2 === 0 ? "bl1" : "bl2",
    avatar: `https://i.pravatar.cc/150?u=instructor${i}`,
    email: `instructor${i + 1}@academy.com`,
    permissions: ["view_dashboard", "create_post", "view_exams"],
}));

const STUDENTS: MockUser[] = Array.from({ length: 150 }).map((_, i) => ({
    id: `s${i + 1}`,
    name: `Student ${i + 1}`,
    level: "user" as const,
    role: "student" as const,
    blockId: i < 75 ? "bl1" : "bl2",
    avatar: `https://i.pravatar.cc/150?u=student${i}`,
    email: `student${i + 1}@academy.com`,
    permissions: ["create_post"],
}));

export const MOCK_USERS: MockUser[] = [
    {
        id: "a1",
        name: "Dr. Sarah Smith",
        level: "admin",
        role: "block_admin",
        blockId: "bl1",
        avatar: "https://i.pravatar.cc/150?u=sarah",
        email: "sarah.admin@academy.com",
        permissions: ["view_dashboard", "manage_blocks", "create_post"],
    },
    {
        id: "a2",
        name: "Dr. James Ford",
        level: "admin",
        role: "block_admin",
        blockId: "bl2",
        avatar: "https://i.pravatar.cc/150?u=james",
        email: "james.admin@academy.com",
        permissions: ["view_dashboard", "manage_blocks"],
    },
    ...INSTRUCTORS,
    ...STUDENTS,
];

export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
    manager: AVAILABLE_PERMISSIONS.map((p) => p.id),
    cx_leader: [
        "view_dashboard",
        "manage_blocks",
        "manage_groups",
        "edit_users",
        "create_post",
        "moderate_content",
    ],
    block_admin: [
        "view_dashboard",
        "manage_blocks",
        "create_post",
        "moderate_content",
    ],
    instructor: ["view_dashboard", "create_post", "view_exams"],
    student: ["create_post"],
};

export const CATEGORY_COLORS: Record<
    string,
    { text: string; bg: string; darkText: string; darkBg: string }
> = {
    System: {
        text: "text-blue-600",
        bg: "bg-blue-600",
        darkText: "text-blue-400",
        darkBg: "bg-blue-500",
    },
    Infrastructure: {
        text: "text-indigo-600",
        bg: "bg-indigo-600",
        darkText: "text-indigo-400",
        darkBg: "bg-indigo-500",
    },
    Personnel: {
        text: "text-emerald-600",
        bg: "bg-emerald-600",
        darkText: "text-emerald-400",
        darkBg: "bg-emerald-500",
    },
    Community: {
        text: "text-purple-600",
        bg: "bg-purple-600",
        darkText: "text-purple-400",
        darkBg: "bg-purple-500",
    },
    Admin: {
        text: "text-amber-600",
        bg: "bg-amber-600",
        darkText: "text-amber-400",
        darkBg: "bg-amber-500",
    },
    Academy: {
        text: "text-rose-600",
        bg: "bg-rose-600",
        darkText: "text-rose-400",
        darkBg: "bg-rose-500",
    },
};
