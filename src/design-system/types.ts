/**
 * Design System - Shared Types
 *
 * Common types used across design system components.
 */

import type { ReactNode } from "react";

// ============================================================================
// Size Types
// ============================================================================

/**
 * Standard size options
 */
export type Size = "sm" | "md" | "lg" | "xl";

/**
 * Compact size options
 */
export type CompactSize = "sm" | "md" | "lg";

// ============================================================================
// Variant Types
// ============================================================================

/**
 * Color variants
 */
export type ColorVariant =
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "info";

/**
 * State variants
 */
export type StateVariant =
    | "default"
    | "loading"
    | "error"
    | "empty"
    | "success";

// ============================================================================
// Layout Types
// ============================================================================

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
    label: string;
    href?: string;
    icon?: ReactNode;
}

/**
 * Action button config
 */
export interface ActionButton {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "outline" | "ghost";
    icon?: ReactNode;
    disabled?: boolean;
    loading?: boolean;
}

// ============================================================================
// Table Types
// ============================================================================

/**
 * Column definition for DataTable
 */
export interface ColumnDef<T> {
    id: string;
    header: string | ReactNode;
    accessorKey?: keyof T;
    accessorFn?: (row: T) => unknown;
    cell?: (info: { row: T; value: unknown }) => ReactNode;
    sortable?: boolean;
    filterable?: boolean;
    width?: string | number;
}

/**
 * Pagination info
 */
export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
}

// ============================================================================
// State Types
// ============================================================================

/**
 * Loading state props
 */
export interface LoadingStateProps {
    message?: string;
    size?: CompactSize;
    fullScreen?: boolean;
    overlay?: boolean;
}

/**
 * Error state props
 */
export interface ErrorStateProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    showIcon?: boolean;
    variant?: "inline" | "card" | "fullPage";
}

/**
 * Empty state props
 */
export interface EmptyStateProps {
    title?: string;
    message?: string;
    icon?: ReactNode;
    action?: ActionButton;
}

// ============================================================================
// Common Props
// ============================================================================

/**
 * Base component props
 */
export interface BaseComponentProps {
    className?: string;
    testId?: string;
}
