/**
 * Coupon Detail Page
 *
 * View page for coupon details with all coupon information.
 * Includes actions to delete or edit the coupon.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { Ticket, Trash2, Edit } from "lucide-react";
import { LoadingState, ErrorState, ConfirmDialog } from "@/design-system";
import { useCoupon, useDeleteCoupon } from "../api";
import { salesPaths } from "../../../navigation/paths";
import { Button } from "@/shared/components/ui/button";
import PageWrapper from "@/design-system/components/PageWrapper";
import { useMutationHandler } from "@/shared/api";

interface DetailRowProps {
    label: string;
    value: React.ReactNode;
    tooltip?: string;
}

function DetailRow({ label, value, tooltip }: DetailRowProps) {
    return (
        <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                {label}
                {tooltip && (
                    <span
                        className="inline-flex items-center justify-center w-4 h-4 text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-help"
                        title={tooltip}
                    >
                        ?
                    </span>
                )}
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white text-right">
                {value}
            </span>
        </div>
    );
}

export default function CouponDetail() {
    const { t } = useTranslation("sales_subscription");
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const { data: coupon, isLoading, error, refetch } = useCoupon(id);
    const { mutateAsync: deleteMutateAsync, isPending: isDeleting } =
        useDeleteCoupon();
    const { execute } = useMutationHandler();

    const handleDelete = () => {
        if (!id) return;
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!id) return;
        execute(() => deleteMutateAsync(id), {
            successMessage: t(
                "coupons.messages.deleteSuccess",
                "Coupon deleted successfully"
            ),
            onSuccess: () => navigate(salesPaths.coupons.list()),
        });
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
    };

    const handleEdit = () => {
        if (id) {
            navigate(salesPaths.coupons.edit(id));
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    const formatCurrency = (value: string | null) => {
        if (value === null || value === undefined) return "-";
        return `$${parseFloat(value).toFixed(2)}`;
    };

    if (isLoading) {
        return <LoadingState message={t("common.loading", "Loading...")} />;
    }

    if (error) {
        return (
            <ErrorState
                message={
                    error.message ||
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
                onRetry={() => navigate(salesPaths.coupons.list())}
            />
        );
    }

    const levelNames = coupon.levels?.map((l) => l.title).join(", ") || "-";

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("coupons.detail.title", "Coupon Details"),
                subtitle: t(
                    "coupons.detail.subtitle",
                    "View and edit the details of the selected coupon below."
                ),
                backButton: true,
            }}
        >
            {/* Header with coupon code */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="p-3 bg-primary/10 rounded-xl">
                    <Ticket className="w-6 h-6 text-brand-500" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
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
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {coupon.name}
                    </p>
                </div>
            </div>

            {/* Section Title */}
            <h3 className="text-sm font-semibold text-brand-500 uppercase tracking-wider mb-4">
                {t("coupons.detail.sectionTitle", "COUPON DETAILS")}
            </h3>

            {/* Details Grid */}
            <div className="space-y-0">
                <DetailRow
                    label={t("coupons.detail.couponId", "Coupon ID")}
                    value={`CPN-${coupon.id}`}
                />
                <DetailRow
                    label={t("coupons.detail.name", "Name")}
                    value={coupon.name}
                />
                <DetailRow
                    label={t("coupons.detail.description", "Description")}
                    value={coupon.description || "-"}
                />
                <DetailRow
                    label={t("coupons.detail.levelId", "Level")}
                    value={levelNames}
                />
                <DetailRow
                    label={t("coupons.detail.discountType", "Discount Type")}
                    value={coupon.typeLabel}
                />
                <DetailRow
                    label={t("coupons.detail.discountValue", "Discount Value")}
                    value={
                        coupon.type === "percentage"
                            ? `${coupon.value}%`
                            : formatCurrency(coupon.value)
                    }
                />
                <DetailRow
                    label={t(
                        "coupons.detail.minPurchaseAmount",
                        "Min Purchase Amount"
                    )}
                    value={formatCurrency(coupon.minPurchaseAmount)}
                    tooltip={t(
                        "coupons.detail.minPurchaseAmountTooltip",
                        "Minimum order amount required to use this coupon"
                    )}
                />
                <DetailRow
                    label={t(
                        "coupons.detail.maxDiscountAmount",
                        "Max Discount Amount"
                    )}
                    value={formatCurrency(coupon.maxDiscountAmount)}
                    tooltip={t(
                        "coupons.detail.maxDiscountAmountTooltip",
                        "Maximum discount that can be applied"
                    )}
                />
                <DetailRow
                    label={t("coupons.detail.usageLimit", "Usage Limit")}
                    value={
                        coupon.usageLimit
                            ? `${coupon.usedCount} / ${coupon.usageLimit} uses`
                            : `${coupon.usedCount} uses`
                    }
                    tooltip={t(
                        "coupons.detail.usageLimitTooltip",
                        "Total number of times this coupon can be used"
                    )}
                />
                <DetailRow
                    label={t(
                        "coupons.detail.usageLimitPerUser",
                        "Usage Limit Per User"
                    )}
                    value={
                        coupon.usageLimitPerUser
                            ? `${coupon.usageLimitPerUser} use per user`
                            : t("common.unlimited", "Unlimited")
                    }
                    tooltip={t(
                        "coupons.detail.usageLimitPerUserTooltip",
                        "Number of times each user can use this coupon"
                    )}
                />
                <DetailRow
                    label={t("coupons.detail.validFrom", "Valid From")}
                    value={
                        coupon.validFrom
                            ? new Date(coupon.validFrom).toLocaleDateString(
                                  "en-US",
                                  {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                  }
                              )
                            : "-"
                    }
                />
                <DetailRow
                    label={t("coupons.detail.validUntil", "Valid Until")}
                    value={
                        coupon.validUntil
                            ? new Date(coupon.validUntil).toLocaleDateString(
                                  "en-US",
                                  {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                  }
                              )
                            : "-"
                    }
                />
                <DetailRow
                    label={t(
                        "coupons.detail.firstSubscriptionOnly",
                        "First Subscription Only"
                    )}
                    value={
                        coupon.isFirstSubscriptionOnly
                            ? t("common.yes", "Yes")
                            : t("common.no", "No")
                    }
                    tooltip={t(
                        "coupons.detail.firstSubscriptionOnlyTooltip",
                        "If enabled, only first-time subscribers can use this coupon"
                    )}
                />
                <DetailRow
                    label={t("coupons.detail.isValid", "Is Valid")}
                    value={
                        coupon.isValid
                            ? t("common.yes", "Yes")
                            : t("common.no", "No")
                    }
                />
                <DetailRow
                    label={t("coupons.detail.createdAt", "Created At")}
                    value={formatDate(coupon.createdAt)}
                />
                <DetailRow
                    label={t("coupons.detail.updatedAt", "Updated At")}
                    value={formatDate(coupon.updatedAt)}
                />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                    variant="destructive"
                    size="default"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-2"
                >
                    <Trash2 className="w-4 h-4" />
                    {t("coupons.actions.delete", "Delete Coupon")}
                </Button>
                <Button
                    variant="default"
                    size="default"
                    onClick={handleEdit}
                    className="flex items-center gap-2"
                >
                    <Edit className="w-4 h-4" />
                    {t("coupons.actions.edit", "Edit Coupon")}
                </Button>
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={deleteDialogOpen}
                onClose={handleCancelDelete}
                variant="danger"
                title={t("coupons.deleteDialog.title", "Delete Coupon")}
                message={t(
                    "coupons.deleteDialog.message",
                    "Are you sure you want to delete this coupon? This action cannot be undone."
                )}
                confirmText={t("common.delete", "Delete")}
                cancelText={t("common.cancel", "Cancel")}
                onConfirm={handleConfirmDelete}
                loading={isDeleting}
            />
        </PageWrapper>
    );
}
