export type Governorate = {
    id: string;
    name: string;
    code: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export type GovernorateUpsertPayload = {
    name: string;
    code: string;
};
