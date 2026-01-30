/**
 * Invoices Feature - Mutation Hooks
 *
 * TanStack Query mutation hooks for creating, updating, and deleting invoices.
 *
 * TODO: Remove mock implementations and uncomment real API calls when backend is ready.
 *
 * @example
 * ```tsx
 * const { mutate: deleteInvoice, isPending } = useDeleteInvoice();
 *
 * const handleDelete = () => {
 *     deleteInvoice(invoiceId, {
 *         onSuccess: () => {
 *             toast.success('Invoice deleted');
 *         },
 *     });
 * };
 * ```
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoiceKeys } from "./invoices.keys";
import type {
    InvoiceItem,
    InvoiceCreatePayload,
    InvoiceUpdatePayload,
} from "../types";
import { ApiError } from "@/shared/api";

// ============================================================================
// Create Mutation
// ============================================================================

/**
 * Hook to create a new invoice
 *
 * @example
 * ```tsx
 * const { mutate, mutateAsync, isPending, error } = useCreateInvoice();
 *
 * const handleSubmit = async (data: InvoiceCreatePayload) => {
 *     try {
 *         const invoice = await mutateAsync(data);
 *         toast.success('Invoice created successfully');
 *     } catch (error) {
 *         // Error toast shown automatically by global handler
 *     }
 * };
 * ```
 */
export function useCreateInvoice() {
    const queryClient = useQueryClient();

    return useMutation<InvoiceItem, ApiError, InvoiceCreatePayload>({
        // TODO: Uncomment when using real API
        // mutationFn: invoicesApi.create,
        mutationFn: (data) => {
            // Mock create - simulate API delay
            return new Promise((resolve) => {
                setTimeout(() => {
                    const newInvoice: InvoiceItem = {
                        id: String(Date.now()),
                        studentName: data.studentName,
                        programType: data.programType,
                        courseName: data.courseName,
                        courseLevel: data.courseLevel,
                        groupType: data.groupType,
                        total: data.total,
                        installments: data.installments,
                        status: data.status ?? "unpaid",
                        createdAt: new Date().toISOString().split("T")[0],
                    };
                    resolve(newInvoice);
                }, 500);
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: invoiceKeys.all });
        },
    });
}

// ============================================================================
// Update Mutation
// ============================================================================

/**
 * Hook to update an existing invoice
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useUpdateInvoice();
 *
 * const handleUpdate = (data: InvoiceUpdatePayload) => {
 *     mutate(
 *         { id: invoiceId, data },
 *         {
 *             onSuccess: () => {
 *                 toast.success('Invoice updated');
 *             },
 *         }
 *     );
 * };
 * ```
 */
export function useUpdateInvoice() {
    const queryClient = useQueryClient();

    return useMutation<
        InvoiceItem,
        ApiError,
        { id: string; data: InvoiceUpdatePayload }
    >({
        // TODO: Uncomment when using real API
        // mutationFn: ({ id, data }) => invoicesApi.update(id, data),
        mutationFn: ({ id, data }) => {
            // Mock update - simulate API delay
            return new Promise((resolve) => {
                setTimeout(() => {
                    const updatedInvoice: InvoiceItem = {
                        id,
                        studentName: data.studentName ?? "Updated Student",
                        programType: data.programType ?? "standard",
                        courseName: data.courseName ?? "Course",
                        courseLevel: data.courseLevel ?? "Level",
                        groupType: data.groupType ?? "regular",
                        total: data.total ?? 0,
                        installments: data.installments ?? 1,
                        status: data.status ?? "unpaid",
                        createdAt: new Date().toISOString().split("T")[0],
                    };
                    resolve(updatedInvoice);
                }, 500);
            });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: invoiceKeys.detail(variables.id),
            });
            queryClient.invalidateQueries({ queryKey: invoiceKeys.stats() });
        },
    });
}

// ============================================================================
// Delete Mutation
// ============================================================================

/**
 * Hook to delete an invoice
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useDeleteInvoice();
 *
 * const handleDelete = () => {
 *     mutate(invoiceId, {
 *         onSuccess: () => {
 *             toast.success('Invoice deleted');
 *         },
 *     });
 * };
 * ```
 */
export function useDeleteInvoice() {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string>({
        // TODO: Uncomment when using real API
        // mutationFn: (id) => invoicesApi.delete(id),
        mutationFn: () => {
            // Mock delete - simulate API delay
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 500);
            });
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: invoiceKeys.all });
            queryClient.removeQueries({ queryKey: invoiceKeys.detail(id) });
        },
    });
}
