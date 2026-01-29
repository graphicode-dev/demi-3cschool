/**
 * useFormSubmit Hook
 *
 * Enhanced form submission with automatic error mapping.
 *
 * @example
 * ```tsx
 * const form = useForm<CourseFormData>({ resolver: zodResolver(schema) });
 * const mutation = useCreateCourse();
 *
 * const { handleSubmit, isSubmitting } = useFormSubmit({
 *     form,
 *     mutation,
 *     onSuccess: () => navigate('/courses'),
 * });
 *
 * return (
 *     <form onSubmit={handleSubmit}>
 *         ...
 *         <button disabled={isSubmitting}>Submit</button>
 *     </form>
 * );
 * ```
 */

import { useCallback } from "react";
import type { FieldValues } from "react-hook-form";
import { mapApiErrorToRHF } from "./mapApiErrorToRHF";
import type { UseFormSubmitOptions, UseFormSubmitReturn } from "./types";

/**
 * Hook for form submission with automatic error mapping
 */
export function useFormSubmit<T extends FieldValues, TResponse = unknown>({
    form,
    mutation,
    onSuccess,
    onError,
    resetOnSuccess = false,
}: UseFormSubmitOptions<T, TResponse>): UseFormSubmitReturn {
    const { handleSubmit: rhfHandleSubmit, setError, reset } = form;

    const handleSubmit = useCallback(
        async (e?: React.BaseSyntheticEvent) => {
            e?.preventDefault();

            await rhfHandleSubmit(async (data) => {
                try {
                    const response = await mutation.mutateAsync(data);

                    if (resetOnSuccess) {
                        reset();
                    }

                    onSuccess?.(response);
                } catch (error) {
                    // Map API errors to form fields
                    mapApiErrorToRHF(error, setError);

                    // Call error callback
                    onError?.(error as Error);
                }
            })(e);
        },
        [
            rhfHandleSubmit,
            setError,
            reset,
            mutation,
            onSuccess,
            onError,
            resetOnSuccess,
        ]
    );

    return {
        handleSubmit,
        isSubmitting: mutation.isPending,
    };
}

export default useFormSubmit;
