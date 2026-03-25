import { Coupon, CouponUsage, GenerateCodeResponse, CouponValidateResponse, CouponStats } from "../types";

export const mockCoupons: Coupon[] = [
    {
        id: 1,
        code: "SUMMER2026",
        name: "Summer Sale 2026",
        description: "Special discount for summer courses",
        type: "percentage",
        typeLabel: "Percentage",
        value: "20",
        minPurchaseAmount: "100",
        maxDiscountAmount: "50",
        usageLimit: 100,
        usageLimitPerUser: 1,
        usedCount: 45,
        validFrom: "2026-06-01T00:00:00Z",
        validUntil: "2026-08-31T23:59:59Z",
        status: "active",
        statusLabel: "Active",
        isFirstSubscriptionOnly: false,
        isValid: true,
        levels: [{ id: 1, title: "Beginner Level" }],
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
    },
    {
        id: 2,
        code: "WELCOME50",
        name: "Welcome Bonus",
        description: "Fixed discount for new students",
        type: "fixed",
        typeLabel: "Fixed Amount",
        value: "50",
        minPurchaseAmount: "0",
        maxDiscountAmount: "50",
        usageLimit: 500,
        usageLimitPerUser: 1,
        usedCount: 120,
        validFrom: "2026-01-01T00:00:00Z",
        validUntil: "2026-12-31T23:59:59Z",
        status: "active",
        statusLabel: "Active",
        isFirstSubscriptionOnly: true,
        isValid: true,
        levels: [],
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
    }
];

export const mockCouponUsages: CouponUsage[] = [
    {
        id: 1,
        user: { id: 101, name: "John Doe", email: "john@example.com" },
        coupon: { id: 1, code: "SUMMER2026", name: "Summer Sale 2026" },
        levelSubscription: { id: 201, level: { id: 1, title: "Beginner Level" } },
        originalAmount: "200",
        discountAmount: "40",
        finalAmount: "160",
        createdAt: "2026-06-15T10:30:00Z",
    }
];

export const mockCouponStats: CouponStats = {
    activeCoupons: 12,
    totalUsages: 845,
    expiredCoupons: 4,
    totalRevenue: 15200,
    trend: {
        activeCoupons: 2,
        totalUsages: 15,
        expiredCoupons: 0,
        totalRevenue: 5,
    }
};

export const generateMockCode = (): GenerateCodeResponse => ({
    code: "NEW" + Math.floor(Math.random() * 10000)
});

export const mockValidateResponse: CouponValidateResponse = {
    valid: true,
    message: "Coupon is valid",
    coupon: mockCoupons[0],
};
