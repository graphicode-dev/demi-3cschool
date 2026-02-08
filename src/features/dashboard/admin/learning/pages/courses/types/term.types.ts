// ================== TERM TYPES ==================

export interface Term {
    id: number;
    name: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface TermCreatePayload {
    name: string;
    description: string;
}

export interface TermUpdatePayload {
    name: string;
    description: string;
    isActive: 0 | 1;
}
