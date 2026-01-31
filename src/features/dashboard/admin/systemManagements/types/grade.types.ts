/**
 * Grade Types
 *
 * Type definitions for grades in the system managements feature.
 */

export interface Grade {
    id: number;
    name: string;
    code: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface GradesResponse {
    success: boolean;
    message: string;
    data: Grade[];
}
