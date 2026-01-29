/**
 * PaymentStatusBadge Component
 *
 * Displays payment status as a colored badge.
 */

import { memo } from "react";
import { useTranslation } from "react-i18next";
import type { PaymentStatus } from "../types";

interface PaymentStatusBadgeProps {
    status: PaymentStatus;
}

const statusStyles: Record<PaymentStatus, string> = {
    pending:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    approved:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export const PaymentStatusBadge = memo(function PaymentStatusBadge({
    status,
}: PaymentStatusBadgeProps) {
    const { t } = useTranslation("salesSubscription");

    const labels: Record<PaymentStatus, string> = {
        pending: t("payments.status.pending", "Pending"),
        approved: t("payments.status.approved", "Approved"),
        rejected: t("payments.status.rejected", "Rejected"),
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
        >
            {labels[status]}
        </span>
    );
});

export default PaymentStatusBadge;
