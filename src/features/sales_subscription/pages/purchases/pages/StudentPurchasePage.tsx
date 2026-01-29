/**
 * Student Purchase Page
 *
 * Main page for managing student subscriptions and payment tracking.
 * Displays a data table with subscription information.
 */

import { useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Eye } from "lucide-react";
import { LoadingState, ErrorState, EmptyState } from "@/design-system";
import { DynamicTable } from "@/design-system/components/table";
import type { TableColumn, TableData } from "@/shared/types";
import { salesPaths } from "../../../navigation/paths";
import PageWrapper from "@/design-system/components/PageWrapper";
import { LevelSubscription, SubscriptionStatusBadge, useLevelSubscriptionsList } from "../../installments";

/**
 * Transform API LevelSubscription data to TableData format
 */
const transformSubscriptionToTableData = (
    subscription: LevelSubscription
): TableData => ({
    id: String(subscription.id),
    columns: {
        studentName: subscription.student.name,
        studentEmail: subscription.student.email,
        courseLevel: `${subscription.level.course.title} - ${subscription.level.title}`,
        pricePlan: subscription.levelPrice.name,
        originalAmount: subscription.originalAmount,
        discountAmount: subscription.discountAmount,
        totalAmount: subscription.totalAmount,
        couponCode: subscription.coupon?.code || "-",
        maxInstallments: subscription.levelPrice.maxInstallments,
        status: subscription.subscriptionStatus,
        createdAt: subscription.createdAt,
    },
});

export default function StudentPurchasePage() {
    const { t } = useTranslation("salesSubscription");
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch subscriptions list
    const {
        data: subscriptionsData,
        isLoading: isSubscriptionsLoading,
        error: subscriptionsError,
        refetch,
    } = useLevelSubscriptionsList({ page: currentPage });

    const subscriptions = subscriptionsData?.items ?? [];
    const paginationInfo = subscriptionsData;

    // Transform subscriptions to table data
    const tableData: TableData[] = useMemo(
        () => subscriptions.map(transformSubscriptionToTableData),
        [subscriptions]
    );

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const columns: TableColumn[] = useMemo(
        () => [
            {
                id: "studentName",
                header: t("subscriptions.table.studentName", "Student Name"),
                accessorKey: "studentName",
                sortable: true,
                cell: ({ row }) => (
                    <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                            {row.columns.studentName}
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {row.columns.studentEmail}
                        </p>
                    </div>
                ),
            },
            {
                id: "courseLevel",
                header: t("subscriptions.table.courseLevel", "Course & Level"),
                accessorKey: "courseLevel",
                sortable: true,
            },
            {
                id: "pricePlan",
                header: t("subscriptions.table.pricePlan", "Price Plan"),
                accessorKey: "pricePlan",
                sortable: true,
            },
            {
                id: "totalAmount",
                header: t("subscriptions.table.total", "Total"),
                accessorKey: "totalAmount",
                sortable: true,
                cell: ({ row }) => (
                    <div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                            ${row.columns.totalAmount}
                        </span>
                        {row.columns.discountAmount !== "0.00" && (
                            <p className="text-xs text-green-600 dark:text-green-400">
                                -{row.columns.discountAmount}{" "}
                                {t("subscriptions.table.discount", "discount")}
                            </p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {row.columns.maxInstallments}{" "}
                            {t(
                                "subscriptions.table.installments",
                                "installments"
                            )}
                        </p>
                    </div>
                ),
            },
            {
                id: "couponCode",
                header: t("subscriptions.table.coupon", "Coupon"),
                accessorKey: "couponCode",
                sortable: true,
            },
            {
                id: "status",
                header: t("subscriptions.table.status", "Status"),
                accessorKey: "status",
                sortable: true,
                cell: ({ row }) => (
                    <SubscriptionStatusBadge status={row.columns.status} />
                ),
            },
            {
                id: "createdAt",
                header: t("subscriptions.table.created", "Created"),
                accessorKey: "createdAt",
                sortable: true,
            },
            {
                id: "actions",
                header: t("subscriptions.table.action", "Action"),
                accessorKey: "actions",
                sortable: false,
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(salesPaths.purchases.view(row.id));
                            }}
                            className="p-1.5 text-gray-500 hover:text-brand-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            title={t("common.view", "View")}
                            aria-label={t("common.view", "View")}
                        >
                            <Eye className="w-4 h-4" aria-hidden="true" />
                        </button>
                    </div>
                ),
            },
        ],
        [t, navigate]
    );

    if (isSubscriptionsLoading && !subscriptionsData) {
        return <LoadingState message={t("common.loading", "Loading...")} />;
    }

    if (subscriptionsError) {
        return (
            <ErrorState
                message={
                    subscriptionsError.message ||
                    t("errors.fetchFailed", "Failed to load data")
                }
                onRetry={refetch}
            />
        );
    }

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("subscriptions.pageTitle", "Student Subscriptions"),
                subtitle: t(
                    "subscriptions.pageSubtitle",
                    "Manage student subscriptions and payment tracking"
                ),
                actions: (
                    <Link
                        to={salesPaths.purchases.create()}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        {t(
                            "subscriptions.actions.create",
                            "Create Subscription"
                        )}
                    </Link>
                ),
            }}
        >
            <h2 className="text-lg font-semibold">
                {t("subscriptions.listTitle", "Student Subscriptions")}
            </h2>
            {subscriptions.length === 0 && !isSubscriptionsLoading ? (
                <EmptyState
                    title={t(
                        "subscriptions.empty.title",
                        "No subscriptions found"
                    )}
                    message={t(
                        "subscriptions.empty.description",
                        "Get started by creating your first subscription"
                    )}
                />
            ) : (
                <DynamicTable
                    title=""
                    data={tableData}
                    columns={columns}
                    initialView="grid"
                    itemsPerPage={paginationInfo?.perPage ?? 15}
                    hideHeader={true}
                    currentPage={paginationInfo?.currentPage}
                    lastPage={paginationInfo?.lastPage}
                    totalCount={
                        paginationInfo
                            ? paginationInfo.perPage * paginationInfo.lastPage
                            : subscriptions.length
                    }
                    onPageChange={paginationInfo ? handlePageChange : undefined}
                />
            )}

            {isSubscriptionsLoading && subscriptionsData && (
                <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500" />
                </div>
            )}
        </PageWrapper>
    );
}
