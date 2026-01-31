/**
 * Coupons List Page
 *
 * Main page for managing discount coupons.
 * Displays stats cards and a data table with coupon information.
 */

import { useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit, ChartColumn } from "lucide-react";
import {
    LoadingState,
    ErrorState,
    EmptyState,
} from "@/design-system";
import { DynamicTable } from "@/design-system/components/table";
import type { TableColumn, TableData } from "@/shared/types/table.types";
import { CouponStatsRow } from "../components";
import { useCouponsList, type Coupon } from "../api";
import { salesPaths } from "../../../navigation/paths";
import PageWrapper from "@/design-system/components/PageWrapper";

/**
 * Transform API Coupon data to TableData format
 */
const transformCouponToTableData = (coupon: Coupon): TableData => ({
    id: String(coupon.id),
    avatar: "",
    columns: {
        code: coupon.code,
        name: coupon.name,
        level: coupon.levels?.map((l) => l.title).join(", ") || "-",
        status: coupon.statusLabel,
        createdAt: new Date(coupon.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }),
        updatedAt: new Date(coupon.updatedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }),
        usages: coupon.usedCount,
    },
});

export default function CouponsList() {
    const { t } = useTranslation("sales_subscription");
    const navigate = useNavigate();

    // Fetch coupons list
    const {
        data: coupons = [],
        isLoading: isCouponsLoading,
        error: couponsError,
        refetch,
    } = useCouponsList();

    // Transform coupons to table data
    const tableData: TableData[] = useMemo(
        () => coupons.map(transformCouponToTableData),
        [coupons]
    );

    const handleRowClick = useCallback(
        (rowId: string) => {
            navigate(salesPaths.coupons.view(rowId));
        },
        [navigate]
    );

    const handleEdit = useCallback(
        (rowId: string) => {
            navigate(salesPaths.coupons.edit(rowId));
        },
        [navigate]
    );

    const handleUsage = useCallback(
        (rowId: string) => {
            navigate(salesPaths.coupons.usages(rowId));
        },
        [navigate]
    );

    const columns: TableColumn[] = [
        {
            id: "code",
            header: t("coupons.table.couponId", "Coupon ID"),
            accessorKey: "code",
            sortable: true,
        },
        {
            id: "level",
            header: t("coupons.table.levelId", "Level ID"),
            accessorKey: "level",
            sortable: true,
        },
        {
            id: "createdAt",
            header: t("coupons.table.createdAt", "Created At"),
            accessorKey: "createdAt",
            sortable: true,
        },
        {
            id: "updatedAt",
            header: t("coupons.table.updatedAt", "Updated At"),
            accessorKey: "updatedAt",
            sortable: true,
        },
        {
            id: "usages",
            header: t("coupons.table.usages", "Usages"),
            accessorKey: "usages",
            sortable: true,
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleUsage(row.id);
                        }}
                        className="p-2 text-brand-500 rounded-lg transition-colors"
                        title={t("coupons.actions.usage", "Usage")}
                    >
                        <ChartColumn className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
        {
            id: "actions",
            header: t("coupons.table.actions", "Actions"),
            accessorKey: "actions",
            sortable: false,
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(row.id);
                        }}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title={t("priceLists.actions.edit", "Edit")}
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    if (isCouponsLoading && coupons.length === 0) {
        return <LoadingState message={t("common.loading", "Loading...")} />;
    }

    if (couponsError) {
        return (
            <ErrorState
                message={
                    couponsError.message ||
                    t("errors.fetchFailed", "Failed to load data")
                }
                onRetry={refetch}
            />
        );
    }

    // Calculate stats from coupons data
    const displayStats = {
        activeCoupons: coupons.filter((c) => c.status === "active").length,
        totalUsages: coupons.reduce((sum, c) => sum + c.usedCount, 0),
        expiredCoupons: coupons.filter((c) => c.status === "expired").length,
        totalRevenue: 0,
        trend: {
            activeCoupons: 0,
            totalUsages: 0,
            expiredCoupons: 0,
            totalRevenue: 0,
        },
    };

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("coupons.title", "Coupons"),
                subtitle: t("coupons.subtitle", "Manage Discount Coupons"),
                actions: (
                    <Link
                        to={salesPaths.coupons.create()}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        {t("coupons.actions.createNew", "Create New Coupon")}
                    </Link>
                ),
            }}
        >
            <CouponStatsRow stats={displayStats} />

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                {coupons.length === 0 && !isCouponsLoading ? (
                    <EmptyState
                        title={t("coupons.empty.title", "No coupons found")}
                        message={t(
                            "coupons.empty.description",
                            "Get started by creating your first coupon"
                        )}
                    />
                ) : (
                    <DynamicTable
                        title={t("coupons.table.title", "Coupon Management")}
                        data={tableData}
                        columns={columns}
                        initialView="grid"
                        itemsPerPage={10}
                        hideHeader
                        hideToolbar
                        noPadding
                        onRowClick={handleRowClick}
                        totalCount={coupons.length}
                        customToolbar={null}
                    />
                )}
            </div>

            {isCouponsLoading && coupons.length > 0 && (
                <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-500" />
                </div>
            )}
        </PageWrapper>
    );
}
