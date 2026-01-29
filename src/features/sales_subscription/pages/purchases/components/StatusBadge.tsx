/**
 * StatusBadge Component
 *
 * Displays payment status as a colored badge.
 * Paid = Green, Unpaid = Red
 */

import { memo } from "react";
import { useTranslation } from "react-i18next";
import type { PaymentStatus } from "../types";

interface StatusBadgeProps {
    status: PaymentStatus;
}

const statusStyles: Record<PaymentStatus, string> = {
    paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    unpaid: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export const StatusBadge = memo(function StatusBadge({
    status,
}: StatusBadgeProps) {
    const { t } = useTranslation("salesSubscription");

    const label =
        status === "paid"
            ? t("purchases.status.paid", "Paid")
            : t("purchases.status.unpaid", "UnPaid");

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
        >
            {label}
        </span>
    );
});

export default StatusBadge;
