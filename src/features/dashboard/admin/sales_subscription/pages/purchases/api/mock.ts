import { InvoiceItem, PaginatedInvoiceData, InvoiceStats } from "../types";

export const mockInvoiceItem: InvoiceItem = {
    id: "INV-1001",
    studentName: "John Doe",
    programType: "standard",
    courseName: "English B1",
    courseLevel: "Intermediate",
    groupType: "regular",
    total: 150.00,
    installments: 3,
    status: "paid",
    createdAt: new Date().toISOString()
};

export const mockPaginatedInvoices: PaginatedInvoiceData = {
    perPage: 10,
    currentPage: 1,
    lastPage: 1,
    nextPageUrl: null,
    items: [
        mockInvoiceItem,
        {
            ...mockInvoiceItem,
            id: "INV-1002",
            studentName: "Jane Smith",
            programType: "professional",
            courseName: "Business English",
            courseLevel: "Advanced",
            groupType: "private",
            total: 300.00,
            installments: 1,
            status: "unpaid"
        }
    ]
};

export const mockInvoiceStats: InvoiceStats = {
    totalInvoices: 150,
    totalInvoicesTrend: 12,
    totalRevenue: 25000,
    totalRevenueTrend: 5,
    pendingPayments: 45,
    pendingPaymentsTrend: -2,
    paidInvoices: 105,
    paidInvoicesTrend: 8
};
