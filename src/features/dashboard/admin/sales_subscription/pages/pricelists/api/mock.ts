import { LevelPrice, LevelPricesPaginatedResponse } from "../types";

export const mockLevelPrices: LevelPrice[] = [
    {
        id: 1,
        level: { id: 1, title: "Beginner English" },
        name: "Standard Monthly",
        description: "Monthly subscription for beginner level",
        price: "50",
        groupType: "regular",
        originalPrice: "60",
        maxInstallments: 1,
        isDefault: true,
        isActive: true,
        isValid: true,
        validFrom: "2026-01-01T00:00:00Z",
        validUntil: "2026-12-31T23:59:59Z",
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
    },
    {
        id: 2,
        level: { id: 2, title: "Intermediate English" },
        name: "Premium Quarterly",
        description: "Quarterly subscription with premium features",
        price: "120",
        groupType: "premium",
        originalPrice: "150",
        maxInstallments: 3,
        isDefault: false,
        isActive: true,
        isValid: true,
        validFrom: "2026-01-01T00:00:00Z",
        validUntil: "2026-12-31T23:59:59Z",
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
    }
];

export const mockLevelPricesPaginated: LevelPricesPaginatedResponse = {
    perPage: 15,
    currentPage: 1,
    lastPage: 1,
    nextPageUrl: null,
    items: mockLevelPrices
};
