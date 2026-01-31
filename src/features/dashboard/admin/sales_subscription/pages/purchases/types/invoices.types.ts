/**
 * Invoices Feature - Domain Types
 *
 * Types for the Invoices domain including:
 * - InvoiceItem entity
 * - Stats types
 * - Create/Update payloads
 * - Query parameters
 */

import type { PaginatedData } from "../../../types/sales.types";

// ============================================================================
// Enums
// ============================================================================

export type PaymentStatus = "paid" | "unpaid";

export type ProgramType = "standard" | "professional";

export type GroupType = "regular" | "semi_private" | "private";

// ============================================================================
// Entity Types
// ============================================================================

/**
 * Invoice entity
 */
export interface InvoiceItem {
    id: string;
    studentName: string;
    programType: ProgramType;
    courseName: string;
    courseLevel: string;
    groupType: GroupType;
    total: number;
    installments: number;
    status: PaymentStatus;
    createdAt: string;
}

// ============================================================================
// Stats Types
// ============================================================================

/**
 * Invoice statistics
 */
export interface InvoiceStats {
    totalInvoices: number;
    totalInvoicesTrend?: number;
    totalRevenue: number;
    totalRevenueTrend?: number;
    pendingPayments: number;
    pendingPaymentsTrend?: number;
    paidInvoices: number;
    paidInvoicesTrend?: number;
}

// ============================================================================
// Query Parameters
// ============================================================================

/**
 * List query parameters for invoices
 */
export interface InvoiceListParams {
    page?: number;
    perPage?: number;
    search?: string;
    status?: PaymentStatus;
    programType?: ProgramType;
    groupType?: GroupType;
}

// ============================================================================
// Response Types
// ============================================================================

/**
 * Paginated invoice data response
 */
export interface PaginatedInvoiceData {
    perPage: number;
    currentPage: number;
    lastPage: number;
    nextPageUrl: string | null;
    items: InvoiceItem[];
}

// ============================================================================
// Payload Types
// ============================================================================

/**
 * Create invoice payload
 */
export interface InvoiceCreatePayload {
    studentName: string;
    programType: ProgramType;
    courseName: string;
    courseLevel: string;
    groupType: GroupType;
    total: number;
    installments: number;
    status?: PaymentStatus;
}

/**
 * Update invoice payload
 */
export interface InvoiceUpdatePayload {
    studentName?: string;
    programType?: ProgramType;
    courseName?: string;
    courseLevel?: string;
    groupType?: GroupType;
    total?: number;
    installments?: number;
    status?: PaymentStatus;
}

// ============================================================================
// Re-export shared types
// ============================================================================

export type { PaginatedData };
