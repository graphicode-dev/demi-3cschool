/**
 * Installments List Page
 *
 * Main page for managing student payments.
 * Displays a data table with payment information.
 */

import { useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { LoadingState, ErrorState, EmptyState } from "@/design-system";
import { DynamicTable } from "@/design-system/components/table";
import type { TableColumn, TableData } from "@/shared/types";
import { useInstallmentsList } from "../api";
import type { Installment, InstallmentStatus } from "../types";
import { paths } from "@/router";
import PageWrapper from "@/design-system/components/PageWrapper";

/**
 * Transform Installment data to TableData format
 */
const transformInstallmentToTableData = (
    installment: Installment
): TableData => ({
    id: String(installment.id),
    columns: {
        installmentNumber: installment.installmentNumber,
        amount: installment.amount,
        paidAmount: installment.paidAmount,
        remainingAmount: installment.remainingAmount,
        dueDate: installment.dueDate,
        status: installment.status,
        statusLabel: installment.statusLabel,
        isPaid: installment.isPaid,
        isOverdue: installment.isOverdue,
        createdAt: installment.createdAt,
    },
});

export default function InstallmentsListPage() {
    const { t } = useTranslation("salesSubscription");
    const navigate = useNavigate();

    // Fetch installments list
    const {
        data: installments,
        isLoading,
        error,
        refetch,
    } = useInstallmentsList();

    // Transform installments to table data
    const tableData: TableData[] = useMemo(
        () => (installments || []).map(transformInstallmentToTableData),
        [installments]
    );

    const handlePayNow = useCallback(
        (id: string) => {
            navigate(paths.dashboard.salesSubscription.paymentsPay(id));
        },
        [navigate]
    );

    // Get status badge styling
    const getStatusBadge = (
        status: InstallmentStatus,
        statusLabel: string,
        isOverdue: boolean
    ) => {
        let bgColor = "bg-gray-100 text-gray-600";
        if (isOverdue) {
            bgColor =
                "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
        } else if (status === "paid") {
            bgColor =
                "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
        } else if (status === "partially_paid") {
            bgColor =
                "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400";
        } else if (status === "pending") {
            bgColor =
                "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
        }
        return (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}
            >
                {statusLabel}
            </span>
        );
    };

    // Table columns configuration
    const columns: TableColumn[] = useMemo(
        () => [
            {
                id: "installmentNumber",
                header: t(
                    "installments.table.installmentNumber",
                    "Installment #"
                ),
                accessorKey: "installmentNumber",
                sortable: true,
                cell: ({ row }: { row: TableData }) => (
                    <span className="font-medium text-gray-900 dark:text-white">
                        #{row.columns.installmentNumber}
                    </span>
                ),
            },
            {
                id: "amount",
                header: t("installments.table.amount", "Amount"),
                accessorKey: "amount",
                sortable: true,
                cell: ({ row }: { row: TableData }) => (
                    <span className="font-semibold text-gray-900 dark:text-white">
                        ${row.columns.amount}
                    </span>
                ),
            },
            {
                id: "paidAmount",
                header: t("installments.table.paidAmount", "Paid"),
                accessorKey: "paidAmount",
                sortable: true,
                cell: ({ row }: { row: TableData }) => (
                    <span className="text-green-600 dark:text-green-400">
                        ${row.columns.paidAmount}
                    </span>
                ),
            },
            {
                id: "remainingAmount",
                header: t("installments.table.remainingAmount", "Remaining"),
                accessorKey: "remainingAmount",
                sortable: true,
                cell: ({ row }: { row: TableData }) => (
                    <span className="text-orange-600 dark:text-orange-400">
                        ${row.columns.remainingAmount}
                    </span>
                ),
            },
            {
                id: "dueDate",
                header: t("installments.table.dueDate", "Due Date"),
                accessorKey: "dueDate",
                sortable: true,
                cell: ({ row }: { row: TableData }) => (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(
                            row.columns.dueDate as string
                        ).toLocaleDateString()}
                    </span>
                ),
            },
            {
                id: "status",
                header: t("installments.table.status", "Status"),
                accessorKey: "status",
                sortable: true,
                cell: ({ row }: { row: TableData }) =>
                    getStatusBadge(
                        row.columns.status as InstallmentStatus,
                        row.columns.statusLabel as string,
                        row.columns.isOverdue as boolean
                    ),
            },
            {
                id: "actions",
                header: t("installments.table.actions", "Actions"),
                accessorKey: "actions",
                sortable: false,
                cell: ({ row }: { row: TableData }) => {
                    const isPaid = row.columns.isPaid;

                    if (isPaid) {
                        return (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                -
                            </span>
                        );
                    }
                    return (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePayNow(row.id);
                                }}
                                className="px-3 py-1.5 text-xs font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-lg transition-colors"
                            >
                                {t(
                                    "sales_subscription:installments.actions.payNow",
                                    "Pay Now"
                                )}
                            </button>
                        </div>
                    );
                },
            },
        ],
        [t, handlePayNow]
    );

    // Error state
    if (error) {
        return (
            <ErrorState
                message={t(
                    "installments.error.loadFailed",
                    "Failed to load installments data"
                )}
                onRetry={() => refetch()}
            />
        );
    }

    if (isLoading) {
        return <LoadingState message={t("common.loading", "Loading...")} />;
    }

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("installments.pageTitle", "Installments"),
                subtitle: t(
                    "installments.pageSubtitle",
                    "View and manage student installments"
                ),
            }}
        >
            {tableData.length === 0 ? (
                <div className="p-8">
                    <EmptyState
                        title={t(
                            "installments.empty.title",
                            "No installments found"
                        )}
                        message={t(
                            "installments.empty.description",
                            "No installments to display"
                        )}
                    />
                </div>
            ) : (
                <DynamicTable
                    data={tableData}
                    columns={columns}
                    itemsPerPage={15}
                    noPadding
                    hideHeader
                    disableRowClick
                    hidePagination
                    hideActionButtons
                />
            )}
        </PageWrapper>
    );
}
