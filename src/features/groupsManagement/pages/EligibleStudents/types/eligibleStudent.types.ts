export interface EligibleStudent {
    id: string;
    name: string;
    age: number;
    program: {
        id: string;
        title: string;
        type: "standard" | "professional";
    };
    course: {
        id: string;
        title: string;
    };
    level: {
        id: string;
        title: string;
    };
    groupType: "regular" | "semi_private" | "private";
    registrationDate: string;
}

export interface EligibleStudentsListParams {
    page?: number;
    perPage?: number;
    search?: string;
}

export interface EligibleStudentsResponse {
    items: EligibleStudent[];
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
}
