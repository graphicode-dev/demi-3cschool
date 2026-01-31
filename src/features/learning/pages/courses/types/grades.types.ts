export type Grade = {
    id: string;
    name: string;
    code: string;
    description: string;
    minAge: number;
    maxAge: number;
    ageRange: string;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

export type GradeCreatePayload = {
    name: string;
    code: string;
    description: string;
    min_age: number;
    max_age: number;
    order: number;
    is_active: 0 | 1;
};

export type GradeUpdatePayload = {
    name: string;
    code: string;
    description: string;
    min_age: number;
    max_age: number;
    order: number;
    is_active: 0 | 1;
};
