/**
 * SubscriptionStatusBadge Component
 *
 * Displays subscription status as a colored badge.
 */

import { memo } from "react";
import { useTranslation } from "react-i18next";
import type { SubscriptionStatus } from "../types";

interface SubscriptionStatusBadgeProps {
    status: SubscriptionStatus;
}

const statusStyles: Record<SubscriptionStatus, string> = {
    pending:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    frozen: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    paused: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    completed:
        "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
};

export const SubscriptionStatusBadge = memo(function SubscriptionStatusBadge({
    status,
}: SubscriptionStatusBadgeProps) {
    const { t } = useTranslation("salesSubscription");

    const labels: Record<SubscriptionStatus, string> = {
        pending: t("subscriptions.status.pending", "Pending"),
        active: t("subscriptions.status.active", "Active"),
        frozen: t("subscriptions.status.frozen", "Frozen"),
        paused: t("subscriptions.status.paused", "Paused"),
        cancelled: t("subscriptions.status.cancelled", "Cancelled"),
        completed: t("subscriptions.status.completed", "Completed"),
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
        >
            {labels[status]}
        </span>
    );
});

export default SubscriptionStatusBadge;
