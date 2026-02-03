export type GovernorateRef = {
    id: number;
    name: string;
};

export type TrainingCenter = {
    id: number;
    name: string;
    code: string | null;
    governorate: GovernorateRef | null;
    governorateId: number | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    managerName: string | null;
    capacity: number | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

export type TrainingCenterCreatePayload = {
    name: string;
    governorate_id: string;
};

export type TrainingCenterUpdatePayload = TrainingCenterCreatePayload;
