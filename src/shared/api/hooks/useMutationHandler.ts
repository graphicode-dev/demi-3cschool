/**
 * Mutation Handler Hook
 *
 * Reusable hook for handling API mutations with:
 * - Success toast notifications
 * - Error toast notifications
 * - Form validation error mapping (react-hook-form compatible)
 * - No try/catch boilerplate needed
 *
 * @example
 * ```tsx
 * const { execute } = useMutationHandler();
 * const form = useForm<CouponCreatePayload>();
 * const { mutateAsync } = useCreateCoupon();
 *
 * const onSubmit = (data: CouponCreatePayload) => {
 *     execute(
 *         () => mutateAsync(data),
 *         {
 *             successMessage: 'Coupon created!',
 *             setError: form.setError,
 *             onSuccess: (result) => navigate('/coupons'),
 *         }
 *     );
 * };
 * ```
 */

import { useCallback } from "react";
import { useToast } from "@/design-system";
import { toFormErrors } from "@/shared/api/client";
import type { ApiError } from "@/shared/api/types";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

interface ExecuteOptions<TData, TForm extends FieldValues = FieldValues> {
    successMessage?: string;
    errorMessage?: string;
    setError?: UseFormSetError<TForm>;
    /** Custom field mapping from API field names to form field names */
    fieldMapping?: Record<string, string>;
    onSuccess?: (data: TData) => void;
    onError?: (error: ApiError) => void;
    showSuccessToast?: boolean;
    showErrorToast?: boolean;
}

interface UseMutationHandlerReturn {
    execute: <TData, TForm extends FieldValues = FieldValues>(
        mutationFn: () => Promise<TData>,
        options?: ExecuteOptions<TData, TForm>
    ) => Promise<TData | undefined>;
}

export function useMutationHandler(): UseMutationHandlerReturn {
    const toast = useToast();

    const execute = useCallback(
        async <TData, TForm extends FieldValues = FieldValues>(
            mutationFn: () => Promise<TData>,
            options: ExecuteOptions<TData, TForm> = {}
        ): Promise<TData | undefined> => {
            const {
                successMessage,
                errorMessage,
                setError,
                fieldMapping,
                onSuccess,
                onError,
                showSuccessToast = true,
                showErrorToast = true,
            } = options;

            try {
                const result = await mutationFn();

                if (showSuccessToast) {
                    toast.addToast({
                        type: "success",
                        message:
                            successMessage ||
                            "Operation completed successfully",
                    });
                }

                onSuccess?.(result);
                return result;
            } catch (error) {
                const apiError = error as ApiError;

                // Debug: Log the error structure
                console.log("[useMutationHandler] Error caught:", {
                    error,
                    apiError,
                    isValidationError: apiError?.isValidationError,
                    validationErrors: apiError?.validationErrors,
                    message: apiError?.message,
                });

                // Handle validation errors - map to form fields if setError is provided
                // Check both isValidationError flag and presence of validationErrors
                const isValidationErrorResponse =
                    apiError?.isValidationError ||
                    (apiError?.validationErrors &&
                        Object.keys(apiError.validationErrors).length > 0);

                const hasValidationErrors =
                    isValidationErrorResponse &&
                    apiError.validationErrors &&
                    setError;

                if (hasValidationErrors) {
                    const formErrors = toFormErrors(
                        apiError.validationErrors,
                        fieldMapping
                    );
                    Object.entries(formErrors).forEach(
                        ([field, fieldError]) => {
                            setError(field as Path<TForm>, fieldError);
                        }
                    );
                }

                // Show error toast if:
                // - showErrorToast is true AND
                // - Either it's NOT a validation error, OR validation errors couldn't be mapped
                const shouldShowErrorToast =
                    showErrorToast &&
                    (!hasValidationErrors ||
                        Object.keys(
                            toFormErrors(
                                apiError.validationErrors,
                                fieldMapping
                            )
                        ).length === 0);

                if (shouldShowErrorToast) {
                    toast.addToast({
                        type: "error",
                        message:
                            errorMessage ||
                            apiError?.message ||
                            "An error occurred",
                    });
                }

                onError?.(apiError);
                return undefined;
            }
        },
        [toast]
    );

    return { execute };
}

export default useMutationHandler;
