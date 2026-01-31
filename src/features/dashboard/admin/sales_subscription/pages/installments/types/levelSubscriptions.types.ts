/**
 * Level Subscriptions Feature - Types
 *
 * TypeScript types for the level subscriptions domain.
 */

/**
 * Subscription status enum
 */
export type SubscriptionStatus =
    | "pending"
    | "active"
    | "frozen"
    | "paused"
    | "cancelled"
    | "completed";

/**
 * Student reference in subscription
 */
export interface SubscriptionStudent {
    id: number;
    name: string;
    email: string;
}

/**
 * Course reference in level
 */
export interface SubscriptionCourse {
    id: number;
    title: string;
}

/**
 * Level reference in subscription
 */
export interface SubscriptionLevel {
    id: number;
    title: string;
    course: SubscriptionCourse;
}

/**
 * Level price reference in subscription
 */
export interface SubscriptionLevelPrice {
    id: number;
    price: string;
    name: string;
    description: string;
    maxInstallments: number;
}

/**
 * Coupon reference in subscription
 */
export interface SubscriptionCoupon {
    id: number;
    code: string;
}

/**
 * Level Subscription entity
 */
export interface LevelSubscription {
    id: number;
    student: SubscriptionStudent;
    level: SubscriptionLevel;
    levelPrice: SubscriptionLevelPrice;
    originalAmount: string;
    coupon: SubscriptionCoupon | null;
    discountAmount: string;
    totalAmount: string;
    subscriptionStatus: SubscriptionStatus;
    activatedAt: string | null;
    frozenAt: string | null;
    freezeReason: string | null;
    createdAt: string;
    updatedAt: string;
}

/**
 * Payload for creating a level subscription
 */
export interface LevelSubscriptionCreatePayload {
    studentId: string | number;
    levelId: string | number;
    levelPriceId: number;
    couponId?: number;
    notes?: string;
}

/**
 * Payload for updating subscription status
 */
export interface LevelSubscriptionStatusPayload {
    status: SubscriptionStatus;
    reason?: string;
}

/**
 * List params for level subscriptions
 */
export interface LevelSubscriptionListParams {
    page?: number;
    perPage?: number;
    studentId?: string | number;
    levelId?: string | number;
    status?: SubscriptionStatus;
    search?: string;
}

/**
 * Paginated response for level subscriptions
 */
export interface PaginatedLevelSubscriptionData {
    perPage: number;
    currentPage: number;
    lastPage: number;
    nextPageUrl: string | null;
    items: LevelSubscription[];
}
