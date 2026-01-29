/**
 * Map API Error to React Hook Form
 *
 * Utility to map server validation errors to form field errors.
 *
 * @example
 * ```tsx
 * const { setError } = useForm<FormData>();
 *
 * try {
 *     await mutation.mutateAsync(data);
 * } catch (error) {
 *     mapApiErrorToRHF(error, setError);
 * }
 * ```
 */

import type { FieldValues, UseFormSetError, Path } from "react-hook-form";
import { isApiValidationError, type MapApiErrorOptions } from "./types";

/**
 * Map API validation errors to React Hook Form field errors
 *
 * @param error - The error from API call
 * @param setError - React Hook Form setError function
 * @param options - Mapping options
 */
export function mapApiErrorToRHF<T extends FieldValues>(
    error: unknown,
    setError: UseFormSetError<T>,
    options: MapApiErrorOptions = {}
): boolean {
    const {
        fieldPrefix = "",
        fieldMapping = {},
        setRootError = true,
    } = options;

    // Check if it's an API validation error
    if (!isApiValidationError(error)) {
        // If it's a regular Error, set as root error
        if (setRootError && error instanceof Error) {
            setError("root" as Path<T>, {
                type: "server",
                message: error.message,
            });
        }
        return false;
    }

    const { errors } = error;
    if (!errors) {
        return false;
    }

    let hasSetError = false;

    Object.entries(errors).forEach(([field, messages]) => {
        // Get the first message if it's an array
        const message = Array.isArray(messages) ? messages[0] : messages;

        // Apply field mapping if defined
        const mappedField = fieldMapping[field] || field;

        // Build full field path with prefix
        // Supports nested paths like "address.city" from API
        const fieldPath = fieldPrefix
            ? `${fieldPrefix}.${mappedField}`
            : mappedField;

        // Convert snake_case to camelCase if needed
        const normalizedPath = fieldPath.replace(/_([a-z])/g, (_, letter) =>
            letter.toUpperCase()
        );

        // Set the error on the form
        setError(normalizedPath as Path<T>, {
            type: "server",
            message,
        });

        hasSetError = true;
    });

    // Set root error with general message if available
    if (setRootError && error.message && !hasSetError) {
        setError("root" as Path<T>, {
            type: "server",
            message: error.message,
        });
    }

    return hasSetError;
}

/**
 * Extract error message from API error
 */
export function getApiErrorMessage(error: unknown): string {
    if (isApiValidationError(error) && error.message) {
        return error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "An unexpected error occurred";
}

/**
 * Check if error has field-level errors
 */
export function hasFieldErrors(error: unknown): boolean {
    if (!isApiValidationError(error)) {
        return false;
    }

    return Object.keys(error.errors || {}).length > 0;
}

export default mapApiErrorToRHF;
