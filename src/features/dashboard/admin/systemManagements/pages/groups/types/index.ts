// ============================================================================
// Group Types
// ============================================================================

export interface GroupInstructor {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    avatar?: string;
}

export interface GroupStudent {
    id: number;
    name: string;
    email?: string;
    avatar?: string;
}

export interface GroupBlock {
    id: number;
    name: string;
    location?: string;
}

export interface Group {
    id: number;
    name: string;
    level: string;
    schedule: string;
    instructorId: number;
    instructor?: GroupInstructor;
    primaryTeacher?: GroupInstructor;
    students: GroupStudent[];
    blocks: GroupBlock[];
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedGroupsData {
    perPage: number;
    currentPage: number;
    lastPage: number;
    nextPageUrl: string | null;
    total: number;
    items: Group[];
}

// ============================================================================
// Mutation Payloads
// ============================================================================

export interface CreateGroupPayload {
    name: string;
    level: string;
    schedule: string;
    instructorId: number;
}

export interface UpdateGroupPayload {
    name?: string;
    level?: string;
    schedule?: string;
    instructorId?: number;
}

export interface AssignBlocksPayload {
    block_ids: number[];
}
