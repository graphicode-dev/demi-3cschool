/**
 * Form Types
 *
 * Shared types for form handling with React Hook Form.
 */

import type {
    FieldValues,
    UseFormReturn,
    UseFormSetError,
    Path,
} from "react-hook-form";
import type { UseMutationResult } from "@tanstack/react-query";
import type { ZodSchema } from "zod";

// ============================================================================
// API Error Types
// ============================================================================

/**
 * API validation error response format
 */
export interface ApiValidationError {
    message?: string;
    errors?: Record<string, string | string[]>;
}

/**
 * Check if error is an API validation error
 */
export function isApiValidationError(
    error: unknown
): error is ApiValidationError {
    return (
        typeof error === "object" &&
        error !== null &&
        "errors" in error &&
        typeof (error as ApiValidationError).errors === "object"
    );
}

// ============================================================================
// Form Hook Types
// ============================================================================

/**
 * Options for useFormWithValidation
 */
export interface UseFormWithValidationOptions<T extends FieldValues> {
    schema: ZodSchema<T>;
    defaultValues?: Partial<T>;
    mode?: "onChange" | "onBlur" | "onSubmit" | "onTouched" | "all";
}

/**
 * Options for useFormSubmit
 */
export interface UseFormSubmitOptions<
    T extends FieldValues,
    TResponse = unknown,
> {
    form: UseFormReturn<T>;
    mutation: UseMutationResult<TResponse, Error, T>;
    onSuccess?: (data: TResponse) => void;
    onError?: (error: Error) => void;
    resetOnSuccess?: boolean;
}

/**
 * Return type for useFormSubmit
 */
export interface UseFormSubmitReturn {
    handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    isSubmitting: boolean;
}

// ============================================================================
// Field Types
// ============================================================================

/**
 * Form field error
 */
export interface FormFieldError {
    type: "validation" | "server" | "custom";
    message: string;
}

/**
 * Server error mapping options
 */
export interface MapApiErrorOptions {
    /** Prefix for nested field paths */
    fieldPrefix?: string;
    /** Custom field name mapping */
    fieldMapping?: Record<string, string>;
    /** Whether to set a root error for unmapped fields */
    setRootError?: boolean;
}
