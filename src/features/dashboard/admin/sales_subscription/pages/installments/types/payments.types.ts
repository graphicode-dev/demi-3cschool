/**
 * Payments Feature - Types
 *
 * TypeScript types for the payments domain.
 */

/**
 * Payment status enum
 */
export type PaymentStatus = "pending" | "approved" | "rejected";

/**
 * Payment method enum
 */
export type PaymentMethod = "cash" | "card" | "bank_transfer" | "online";

/**
 * Reviewer reference in payment
 */
export interface PaymentReviewer {
    id: number;
    name: string;
}

/**
 * Student reference in subscription
 */
export interface PaymentStudent {
    id: number;
    name: string;
}

/**
 * Level reference in subscription
 */
export interface PaymentLevel {
    id: number;
    title: string;
}

/**
 * Subscription reference in installment
 */
export interface PaymentSubscription {
    id: number;
    student: PaymentStudent;
    level: PaymentLevel;
}

/**
 * Installment reference in payment
 */
export interface PaymentInstallment {
    id: number;
    installmentNumber: number;
    amount: string;
    dueDate: string;
    subscription: PaymentSubscription;
}

/**
 * Payment entity
 */
export interface Payment {
    id: number;
    installmentId: number;
    studentId: number;
    amount: number;
    paymentMethod: PaymentMethod;
    paymentMethodLabel: string;
    paymentStatus: PaymentStatus;
    paymentStatusLabel: string;
    transactionReference: string | null;
    paymentDate: string;
    reviewer: PaymentReviewer | null;
    reviewedAt: string | null;
    reviewNotes: string | null;
    rejectionReason: string | null;
    createdAt: string;
    updatedAt: string;
}

/**
 * Payload for submitting a payment
 */
export interface PaymentSubmitPayload {
    amount: number;
    paymentMethod: PaymentMethod;
}

/**
 * Payload for changing payment status
 */
export interface PaymentChangeStatusPayload {
    status: "approved" | "rejected";
    notes?: string;
    rejectionReason?: string;
}

/**
 * List params for payments
 */
export interface PaymentListParams {
    page?: number;
    perPage?: number;
    status?: PaymentStatus;
    studentId?: string | number;
}

/**
 * Paginated response for payments
 */
export interface PaginatedPaymentData {
    perPage: number;
    currentPage: number;
    lastPage: number;
    nextPageUrl: string | null;
    items: Payment[];
}

/**
 * Installment status enum
 */
export type InstallmentStatus =
    | "pending"
    | "partially_paid"
    | "paid"
    | "overdue";

/**
 * Installment entity (from /subscriptions/installments endpoint)
 */
export interface Installment {
    id: number;
    levelSubscription: {
        id: number;
        student: {
            id: number;
            name: string;
            email: string;
            image: string | null;
            phone: string | null;
        };
        level: {
            id: number;
            title: string;
            course: {
                id: number;
                title: string;
            };
        };
        levelPrice: {
            id: number;
            price: string;
            name: string;
            description: string;
            maxInstallments: number;
        };
        originalAmount: string;
        coupon: {
            id: number;
            code: string;
        } | null;
        discountAmount: string;
        totalAmount: string;
        subscriptionStatus: string;
        activatedAt: string | null;
        frozenAt: string | null;
        freezeReason: string | null;
        createdAt: string;
        updatedAt: string;
    };
    installmentNumber: number;
    amount: number;
    paidAmount: number;
    remainingAmount: number;
    dueDate: string;
    status: InstallmentStatus;
    statusLabel: string;
    isPaid: boolean;
    isOverdue: boolean;
    paidAt: string | null;
    createdAt: string;
}

/**
 * List params for installments
 */
export interface InstallmentListParams {
    page?: number;
    perPage?: number;
    status?: InstallmentStatus;
    levelSubscriptionId?: string | number;
}
