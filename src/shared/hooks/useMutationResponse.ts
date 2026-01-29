import { useCallback, useState } from "react";
import { useToast } from "../../design-system/hooks/useToast";

export const useMutationResponse = () => {
    const { addToast } = useToast();
    const [ApiErrors, setApiErrors] = useState<Record<string, string>>({});

    const clearApiErrors = useCallback(() => {
        setApiErrors({});
    }, []);

    /**
     * Handles mutation errors by:
     * 1. Always showing error message in a toast
     * 2. Mapping validation errors to form fields if they exist
     * 3. Logging errors for debugging
     *
     * @param error - The error object from the mutation (any structure)
     * @param setApiErrors - Optional setter function for form field errors
     * @param fallbackMessage - Optional fallback error message if none found
     */

    const handleMutationError = useCallback(
        (error: any, fallbackMessage: string = "An error occurred") => {
            // Log error for debugging
            console.error("⚠️ Mutation Error:", error);

            // Extract error details from various possible structures
            const errorDetails =
                error?.details || error?.response?.data || error;
            const message =
                error?.message || errorDetails?.message || fallbackMessage;
            const validationErrors =
                error?.errors || errorDetails?.errors || null;

            // Always show the main error message in toast
            addToast({
                type: "error",
                title: "Error",
                message: message,
            });

            // If validation errors exist and we have a setter, map them to form fields
            if (validationErrors) {
                const mappedErrors: Record<string, string> = {};

                // Known API field name mappings to form field names
                const fieldMappings: Record<string, string[]> = {
                    mapUrl: ["location_map_url", "locationMapUrl"],
                    locationMapUrl: ["location_map_url", "mapUrl"],
                    location_map_url: ["locationMapUrl", "mapUrl"],
                };

                Object.entries(validationErrors).forEach(([key, messages]) => {
                    // Get first error message for the field
                    const errorMessage = Array.isArray(messages)
                        ? messages[0]
                        : String(messages);

                    // Store both the original key and converted versions to handle both cases
                    // Original key (as-is from API)
                    mappedErrors[key] = errorMessage;

                    // Apply known field mappings
                    if (fieldMappings[key]) {
                        fieldMappings[key].forEach((mappedKey) => {
                            mappedErrors[mappedKey] = errorMessage;
                        });
                    }

                    // Convert camelCase to snake_case (e.g., endDate -> end_date)
                    const snakeCaseKey = key.replace(
                        /([A-Z])/g,
                        (_, letter) => `_${letter.toLowerCase()}`
                    );
                    if (snakeCaseKey !== key) {
                        mappedErrors[snakeCaseKey] = errorMessage;
                    }

                    // Convert snake_case to camelCase (e.g., end_date -> endDate)
                    const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) =>
                        letter.toUpperCase()
                    );
                    if (camelCaseKey !== key) {
                        mappedErrors[camelCaseKey] = errorMessage;
                    }
                });

                setApiErrors(mappedErrors);
            }
        },
        [addToast]
    );

    /**
     * Handles mutation success by showing a success toast and clearing errors
     *
     * @param message - Success message to display
     * @param clearErrors - Optional function to clear API errors
     */
    const handleMutationSuccess = useCallback(
        (res: any, message: string = "Operation completed successfully") => {
            addToast({
                type: "success",
                title: "Success",
                message,
            });

            clearApiErrors();
        },
        [addToast]
    );

    return {
        handleMutationError,
        handleMutationSuccess,
        ApiErrors,
        clearApiErrors,
    };
};
