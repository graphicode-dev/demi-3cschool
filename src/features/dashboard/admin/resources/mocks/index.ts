/**
 * Resources Feature - Mock Data
 *
 * Mock data for development and testing.
 * TODO: Replace with real API integration
 */

import type { ResourceFolder, Resource, GradeRef, TermRef } from "../types";

// ============================================================================
// Mock Grades and Terms
// ============================================================================

export const MOCK_GRADES: GradeRef[] = [
    { id: "grade-1", name: "Grade 1" },
    { id: "grade-2", name: "Grade 2" },
    { id: "grade-3", name: "Grade 3" },
    { id: "grade-4", name: "Grade 4" },
    { id: "grade-5", name: "Grade 5" },
    { id: "grade-6", name: "Grade 6" },
];

export const MOCK_TERMS: TermRef[] = [
    { id: "term-1", name: "First Term" },
    { id: "term-2", name: "Second Term" },
];

// ============================================================================
// Mock Folders
// ============================================================================

export const MOCK_FOLDERS: ResourceFolder[] = [
    {
        id: "folder-1",
        name: "Folder 1: Introduction to Mathematics",
        description: "Basic math concepts and exercises",
        grade: MOCK_GRADES[3], // Grade 4
        term: MOCK_TERMS[0], // First Term
        resourceCount: 3,
        createdAt: "2023-10-01T10:00:00Z",
        updatedAt: "2023-10-15T14:30:00Z",
    },
    {
        id: "folder-2",
        name: "Folder 2: Python Basics",
        description: "Introduction to Python programming",
        grade: MOCK_GRADES[3],
        term: MOCK_TERMS[0],
        resourceCount: 5,
        createdAt: "2023-10-02T09:00:00Z",
        updatedAt: "2023-10-16T11:00:00Z",
    },
    {
        id: "folder-3",
        name: "Folder 3: Science Experiments",
        description: "Hands-on science activities",
        grade: MOCK_GRADES[3],
        term: MOCK_TERMS[0],
        resourceCount: 2,
        createdAt: "2023-10-03T08:00:00Z",
        updatedAt: "2023-10-17T16:00:00Z",
    },
    {
        id: "folder-4",
        name: "Folder 4: English Grammar",
        description: "Grammar rules and exercises",
        grade: MOCK_GRADES[3],
        term: MOCK_TERMS[0],
        resourceCount: 2,
        createdAt: "2023-10-04T07:00:00Z",
        updatedAt: "2023-10-18T10:00:00Z",
    },
    {
        id: "folder-5",
        name: "Folder 5: Art & Creativity",
        description: "Creative art projects",
        grade: MOCK_GRADES[3],
        term: MOCK_TERMS[0],
        resourceCount: 0,
        createdAt: "2023-10-05T06:00:00Z",
        updatedAt: "2023-10-19T09:00:00Z",
    },
];

// ============================================================================
// Mock Resources
// ============================================================================

export const MOCK_RESOURCES: Resource[] = [
    {
        id: "resource-1",
        title: "Introduction to Numbers",
        description: "A comprehensive guide to basic numbers",
        type: "file",
        fileUrl: "/files/intro-numbers.pdf",
        fileName: "intro-numbers.pdf",
        fileSize: 1024000,
        folderId: "folder-1",
        uploadedAt: "2023-10-24T10:00:00Z",
        createdAt: "2023-10-24T10:00:00Z",
        updatedAt: "2023-10-24T10:00:00Z",
    },
    {
        id: "resource-2",
        title: "Math Workbook Chapter 1",
        description: "Practice exercises for chapter 1",
        type: "video",
        fileUrl: "/videos/math-workbook-1.mp4",
        fileName: "math-workbook-1.mp4",
        fileSize: 52428800,
        folderId: "folder-1",
        uploadedAt: "2023-10-24T11:00:00Z",
        createdAt: "2023-10-24T11:00:00Z",
        updatedAt: "2023-10-24T11:00:00Z",
    },
    {
        id: "resource-3",
        title: "Math Workbook Chapter 1",
        description: "Visual aids for math concepts",
        type: "image",
        fileUrl: "/images/math-visual.png",
        fileName: "math-visual.png",
        fileSize: 2048000,
        folderId: "folder-1",
        uploadedAt: "2023-10-24T12:00:00Z",
        createdAt: "2023-10-24T12:00:00Z",
        updatedAt: "2023-10-24T12:00:00Z",
    },
    {
        id: "resource-4",
        title: "Python Tutorial Video",
        description: "Getting started with Python",
        type: "video",
        fileUrl: "/videos/python-tutorial.mp4",
        fileName: "python-tutorial.mp4",
        fileSize: 104857600,
        folderId: "folder-2",
        uploadedAt: "2023-10-25T10:00:00Z",
        createdAt: "2023-10-25T10:00:00Z",
        updatedAt: "2023-10-25T10:00:00Z",
    },
    {
        id: "resource-5",
        title: "Python Cheat Sheet",
        description: "Quick reference for Python syntax",
        type: "file",
        fileUrl: "/files/python-cheatsheet.pdf",
        fileName: "python-cheatsheet.pdf",
        fileSize: 512000,
        folderId: "folder-2",
        uploadedAt: "2023-10-25T11:00:00Z",
        createdAt: "2023-10-25T11:00:00Z",
        updatedAt: "2023-10-25T11:00:00Z",
    },
    {
        id: "resource-6",
        title: "Introduction to Numbers Video",
        description: "A comprehensive video introducing number concepts",
        type: "video",
        fileUrl: "/videos/intro-numbers.mp4",
        fileName: "intro-numbers.mp4",
        fileSize: 78643200,
        folderId: "folder-1",
        uploadedAt: "2026-01-15T10:00:00Z",
        createdAt: "2026-01-15T10:00:00Z",
        updatedAt: "2026-01-15T10:00:00Z",
    },
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get folders filtered by grade and term
 */
export function getMockFolders(
    gradeId?: string,
    termId?: string
): ResourceFolder[] {
    return MOCK_FOLDERS.filter((folder) => {
        if (gradeId && folder.grade.id !== gradeId) return false;
        if (termId && folder.term.id !== termId) return false;
        return true;
    });
}

/**
 * Get folder by ID
 */
export function getMockFolderById(id: string): ResourceFolder | undefined {
    return MOCK_FOLDERS.find((folder) => folder.id === id);
}

/**
 * Get resources by folder ID and optional type filter
 */
export function getMockResources(
    folderId: string,
    type?: string,
    search?: string
): Resource[] {
    return MOCK_RESOURCES.filter((resource) => {
        if (resource.folderId !== folderId) return false;
        if (type && type !== "all" && resource.type !== type) return false;
        if (
            search &&
            !resource.title.toLowerCase().includes(search.toLowerCase())
        ) {
            return false;
        }
        return true;
    });
}

/**
 * Get resource by ID
 */
export function getMockResourceById(id: string): Resource | undefined {
    return MOCK_RESOURCES.find((resource) => resource.id === id);
}
