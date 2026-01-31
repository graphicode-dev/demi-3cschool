/**
 * Coupon Usages Page
 *
 * View page for coupon usage details and statistics.
 * Shows usage information and a table of users who used the coupon.
 */

import { useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Ticket, ChevronDown } from "lucide-react";
import { LoadingState, ErrorState } from "@/design-system";
import { DynamicTable } from "@/design-system/components/table";
import type { TableColumn, TableData } from "@/shared/types";
import { useCoupon, useCouponUsages } from "../api";
import type { CouponUsage } from "../types";
import PageWrapper from "@/design-system/components/PageWrapper";

interface DetailRowProps {
    label: string;
    value: React.ReactNode;
}

function DetailRow({ label, value }: DetailRowProps) {
    return (
        <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
            <span className="text-sm text-gray-500 dark:text-gray-400">
                {label}
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white text-right">
                {value}
            </span>
        </div>
    );
}

interface StatCardProps {
    value: number;
    label: string;
    color: "primary" | "success";
}

function StatCard({ value, label, color }: StatCardProps) {
    const colorClasses = {
        primary: "text-brand-500",
        success: "text-green-500",
    };

    return (
        <div className="flex-1 p-6 text-center bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 ">
            <p className={`text-4xl font-bold ${colorClasses[color]}`}>
                {value}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-200 mt-1">
                {label}
            </p>
        </div>
    );
}

export default function CouponUsages() {
    const { t } = useTranslation("sales_subscription");
    const { id } = useParams<{ id: string }>();
    const [searchQuery, setSearchQuery] = useState("");
    const [isInfoExpanded, setIsInfoExpanded] = useState(false);

    const { data: coupon, isLoading, error, refetch } = useCoupon(id);
    const {
        data: usages = [],
        isLoading: isUsagesLoading,
        error: usagesError,
    } = useCouponUsages(id);

    const transformUsageToTableData = useCallback(
        (usage: CouponUsage): TableData => ({
            id: String(usage.id),
            avatar: "",
            columns: {
                usageId: usage.id,
                userName: usage.user.name,
                userEmail: usage.user.email,
                level: usage.levelSubscription.level.title,
                originalAmount: `$${parseFloat(usage.originalAmount).toFixed(2)}`,
                discountAmount: `$${parseFloat(usage.discountAmount).toFixed(2)}`,
                finalAmount: `$${parseFloat(usage.finalAmount).toFixed(2)}`,
                usageDate: new Date(usage.createdAt).toLocaleDateString(
                    "en-US",
                    {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    }
                ),
            },
        }),
        []
    );

    const columns: TableColumn[] = useMemo(
        () => [
            {
                id: "userName",
                header: t("coupons.usages.table.userName", "User Name"),
                accessorKey: "userName",
                sortable: true,
            },
            {
                id: "userEmail",
                header: t("coupons.usages.table.userEmail", "Email"),
                accessorKey: "userEmail",
                sortable: true,
            },
            {
                id: "level",
                header: t("coupons.usages.table.level", "Level"),
                accessorKey: "level",
                sortable: true,
            },
            {
                id: "originalAmount",
                header: t("coupons.usages.table.originalAmount", "Original"),
                accessorKey: "originalAmount",
                sortable: true,
            },
            {
                id: "discountAmount",
                header: t("coupons.usages.table.discountAmount", "Discount"),
                accessorKey: "discountAmount",
                sortable: true,
            },
            {
                id: "finalAmount",
                header: t("coupons.usages.table.finalAmount", "Final"),
                accessorKey: "finalAmount",
                sortable: true,
            },
            {
                id: "usageDate",
                header: t("coupons.usages.table.usageDate", "Date"),
                accessorKey: "usageDate",
                sortable: true,
            },
        ],
        [t]
    );

    const filteredUsages = useMemo(() => {
        if (!searchQuery) return usages;
        const query = searchQuery.toLowerCase();
        return usages.filter(
            (usage) =>
                usage.user.name.toLowerCase().includes(query) ||
                usage.user.email.toLowerCase().includes(query)
        );
    }, [usages, searchQuery]);

    const tableData: TableData[] = useMemo(
        () => filteredUsages.map(transformUsageToTableData),
        [filteredUsages, transformUsageToTableData]
    );

    const onSearchChange = (query: string) => {
        setSearchQuery(query);
    };

    if (isLoading) {
        return <LoadingState message={t("common.loading", "Loading...")} />;
    }

    if (error || usagesError) {
        return (
            <ErrorState
                message={
                    error?.message ||
                    usagesError?.message ||
                    t("errors.fetchFailed", "Failed to load data")
                }
                onRetry={refetch}
            />
        );
    }

    if (!coupon) {
        return (
            <ErrorState
                message={t("coupons.detail.notFound", "Coupon not found")}
            />
        );
    }

    const levelNames = coupon.levels?.map((l) => l.title).join(", ") || "-";
    const totalUses = coupon.usedCount || 0;
    const remainingUses = coupon.usageLimit
        ? coupon.usageLimit - totalUses
        : 999;

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("coupons.usages.title", "Coupon Usages Details"),
                subtitle: t(
                    "coupons.usages.subtitle",
                    "View the details of how this coupon has been used by different users."
                ),
                backButton: true,
            }}
        >
            {/* Coupon Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                {/* Header with coupon code - clickable to toggle */}
                <button
                    type="button"
                    onClick={() => setIsInfoExpanded(!isInfoExpanded)}
                    className="bg-brand-400 dark:bg-brand-600 w-full flex items-center gap-4 p-6 text-left rounded-t-2xl"
                >
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <Ticket className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-white">
                                {coupon.code}
                            </h2>
                            <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    coupon.status === "active"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                        : coupon.status === "expired"
                                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                          : "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400"
                                }`}
                            >
                                {coupon.statusLabel}
                            </span>
                        </div>
                        <p className="text-sm text-white">{coupon.name}</p>
                    </div>
                    <ChevronDown
                        className={`w-5 h-5 text-white transition-transform duration-300 ${
                            isInfoExpanded ? "rotate-180" : ""
                        }`}
                    />
                </button>

                {/* Collapsible content */}
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isInfoExpanded
                            ? "max-h-[1000px] opacity-100"
                            : "max-h-0 opacity-0"
                    }`}
                >
                    <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700">
                        {/* Section Title */}
                        <h3 className="text-sm font-semibold text-brand-500 uppercase tracking-wider mb-4 mt-6">
                            {t(
                                "coupons.usages.infoTitle",
                                "COUPON INFORMATION"
                            )}
                        </h3>

                        {/* Details */}
                        <div className="space-y-0">
                            <DetailRow
                                label={t(
                                    "coupons.detail.couponId",
                                    "Coupon ID"
                                )}
                                value={`CPN-${coupon.id}`}
                            />
                            <DetailRow
                                label={t("coupons.detail.name", "Name")}
                                value={coupon.name}
                            />
                            <DetailRow
                                label={t("coupons.detail.levelId", "Level")}
                                value={levelNames}
                            />
                            <DetailRow
                                label={t(
                                    "coupons.detail.discountType",
                                    "Discount Type"
                                )}
                                value={coupon.typeLabel}
                            />
                            <DetailRow
                                label={t("coupons.usages.discount", "Discount")}
                                value={
                                    coupon.type === "percentage"
                                        ? `${coupon.value}% off`
                                        : `$${parseFloat(coupon.value).toFixed(2)} off`
                                }
                            />
                            <DetailRow
                                label={t(
                                    "coupons.detail.validFrom",
                                    "Valid From"
                                )}
                                value={
                                    coupon.validFrom
                                        ? new Date(
                                              coupon.validFrom
                                          ).toLocaleDateString("en-US", {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                          })
                                        : "-"
                                }
                            />
                            <DetailRow
                                label={t(
                                    "coupons.detail.validUntil",
                                    "Valid Until"
                                )}
                                value={
                                    coupon.validUntil
                                        ? new Date(
                                              coupon.validUntil
                                          ).toLocaleDateString("en-US", {
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                          })
                                        : "-"
                                }
                            />
                            <DetailRow
                                label={t(
                                    "coupons.detail.createdAt",
                                    "Created At"
                                )}
                                value={new Date(
                                    coupon.createdAt
                                ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Usage Information */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t("coupons.usages.statsTitle", "Usage Information")}
            </h3>
            <div className="flex gap-4">
                <StatCard
                    value={totalUses}
                    label={t("coupons.usages.totalUses", "Total Uses")}
                    color="primary"
                />
                <StatCard
                    value={remainingUses}
                    label={t("coupons.usages.remainingUses", "Remaining Uses")}
                    color="success"
                />
            </div>

            {/* Users Table */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t("coupons.usages.usersTitle", "User Who Used The Coupon")}
            </h3>
            {isUsagesLoading ? (
                <LoadingState />
            ) : (
                <DynamicTable
                    data={tableData}
                    columns={columns}
                    hideHeader
                    hidePagination
                    hideActionButtons
                    noPadding
                    searchQuery={searchQuery}
                    onSearchChange={onSearchChange}
                />
            )}
        </PageWrapper>
    );
}
