/**
 * useFormApiErrors Hook
 *
 * A reusable hook for handling API validation errors in forms.
 * Maps API error field names to form field names and sets errors using react-hook-form's setError.
 */

import { useCallback } from "react";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { useToast } from "../../design-system/hooks/useToast";
import { useTranslation } from "react-i18next";

/**
 * API error structure from the backend
 */
export interface ApiValidationError {
    message?: string;
    errors?: Record<string, string[]>;
    details?: {
        message?: string;
        errors?: Record<string, string[]>;
    };
}

/**
 * Options for the useFormApiErrors hook
 */
export interface UseFormApiErrorsOptions<TFieldValues extends FieldValues> {
    /** react-hook-form's setError function */
    setError: UseFormSetError<TFieldValues>;
    /** Optional mapping from API field names to form field names */
    fieldMap?: Record<string, Path<TFieldValues>>;
    /** Whether to show a toast notification for the main error message */
    showToast?: boolean;
    /** Custom error title for toast */
    errorTitle?: string;
    /** Custom fallback error message */
    fallbackMessage?: string;
}

/**
 * Hook for handling API validation errors in forms
 *
 * @example
 * ```tsx
 * const { handleApiError } = useFormApiErrors({
 *     setError,
 *     fieldMap: {
 *         group_type: "groupType",
 *         max_installments: "max_installments",
 *     },
 * });
 *
 * try {
 *     await mutation.mutateAsync(payload);
 * } catch (error) {
 *     handleApiError(error);
 * }
 * ```
 */
export function useFormApiErrors<TFieldValues extends FieldValues>({
    setError,
    fieldMap = {},
    showToast = true,
    errorTitle,
    fallbackMessage,
}: UseFormApiErrorsOptions<TFieldValues>) {
    const { addToast } = useToast();
    const { t } = useTranslation();

    const handleApiError = useCallback(
        (error: unknown) => {
            const apiError = error as ApiValidationError;

            // Extract errors from the API response structure
            // Errors may be in error.errors or error.details.errors
            const apiErrors = apiError?.details?.errors || apiError?.errors;

            if (apiErrors && typeof apiErrors === "object") {
                Object.entries(apiErrors).forEach(([field, messages]) => {
                    // Map API field name to form field name, or use as-is
                    const formField = (fieldMap[field] ||
                        field) as Path<TFieldValues>;

                    if (Array.isArray(messages) && messages.length > 0) {
                        setError(
                            formField,
                            {
                                type: "server",
                                message: messages[0],
                            },
                            { shouldFocus: false }
                        );
                    }
                });
            }

            // Show toast with main error message
            if (showToast) {
                const message =
                    apiError?.message ||
                    apiError?.details?.message ||
                    fallbackMessage ||
                    t("common.error.generic", "An error occurred");

                addToast({
                    type: "error",
                    title: errorTitle || t("common.error", "Error"),
                    message,
                });
            }
        },
        [
            setError,
            fieldMap,
            showToast,
            errorTitle,
            fallbackMessage,
            addToast,
            t,
        ]
    );

    return { handleApiError };
}

export default useFormApiErrors;
