import {
    LevelSubscription,
    PaginatedLevelSubscriptionData,
    Payment,
    PaginatedPaymentData,
    Installment,
} from "../types";

export const mockLevelSubscription: LevelSubscription = {
    id: 1,
    student: { id: 101, name: "Alice Student", email: "alice@example.com" },
    level: { id: 1, title: "Level 1", course: { id: 10, title: "English" } },
    levelPrice: {
        id: 1,
        price: "100",
        name: "Monthly",
        description: "Per month",
        maxInstallments: 1,
    },
    originalAmount: "100",
    coupon: null,
    discountAmount: "0",
    totalAmount: "100",
    subscriptionStatus: "active",
    activatedAt: new Date().toISOString(),
    frozenAt: null,
    freezeReason: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

export const mockPaginatedSubscriptions: PaginatedLevelSubscriptionData = {
    perPage: 10,
    currentPage: 1,
    lastPage: 1,
    nextPageUrl: null,
    items: [mockLevelSubscription],
};

export const mockPayment: Payment = {
    id: 1,
    installmentId: 1,
    studentId: 101,
    amount: 100,
    paymentMethod: "card",
    paymentMethodLabel: "Credit Card",
    paymentStatus: "approved",
    paymentStatusLabel: "Approved",
    transactionReference: "TXN123456",
    paymentDate: new Date().toISOString(),
    reviewer: { id: 1, name: "Admin" },
    reviewedAt: new Date().toISOString(),
    reviewNotes: "",
    rejectionReason: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

export const mockPaginatedPayments: PaginatedPaymentData = {
    perPage: 10,
    currentPage: 1,
    lastPage: 1,
    nextPageUrl: null,
    items: [mockPayment],
};

export const mockInstallment: Installment = {
    id: 1,
    levelSubscription: {
        id: 1,
        student: {
            id: 101,
            name: "Alice Student",
            email: "alice@example.com",
            image: null,
            phone: null,
        },
        level: {
            id: 1,
            title: "Level 1",
            course: { id: 10, title: "English" },
        },
        levelPrice: {
            id: 1,
            price: "100",
            name: "Monthly",
            description: "Per month",
            maxInstallments: 1,
        },
        originalAmount: "100",
        coupon: null,
        discountAmount: "0",
        totalAmount: "100",
        subscriptionStatus: "active",
        activatedAt: new Date().toISOString(),
        frozenAt: null,
        freezeReason: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    installmentNumber: 1,
    amount: 100,
    paidAmount: 100,
    remainingAmount: 0,
    dueDate: new Date().toISOString(),
    status: "pending",
    statusLabel: "Pending",
    isPaid: false,
    isOverdue: false,
    paidAt: null,
    createdAt: new Date().toISOString(),
};
