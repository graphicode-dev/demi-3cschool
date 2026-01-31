/**
 * InvoiceStatsRow Component
 *
 * Displays a row of stat cards for the student purchase page.
 * Shows: Total Invoices, Total Revenue, Pending Payments, Paid Invoices
 */

import { useTranslation } from "react-i18next";
import type { InvoiceStats } from "../types";
import { FileText, DollarSign, Clock, CheckCircle } from "lucide-react";
import StatCard from "@/features/dashboard/admin/sales_subscription/components/StatCard";

interface InvoiceStatsRowProps {
    stats: InvoiceStats;
    isLoading?: boolean;
}

export function InvoiceStatsRow({ stats, isLoading }: InvoiceStatsRowProps) {
    const { t } = useTranslation("salesSubscription");

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                title={t("purchases.stats.totalInvoices", "Total Invoices")}
                value={stats.totalInvoices}
                icon={<FileText className="w-5 h-5" />}
                trend={{
                    value: stats.totalInvoicesTrend || 0,
                    label: t("purchases.stats.thisMonth", "this month"),
                }}
                variant="purple"
            />
            <StatCard
                title={t("purchases.stats.totalRevenue", "Total Revenue")}
                value={`$${stats.totalRevenue.toLocaleString()}`}
                icon={<DollarSign className="w-5 h-5" />}
                trend={{
                    value: stats.totalRevenueTrend || 0,
                    label: t("purchases.stats.thisMonth", "this month"),
                }}
                variant="green"
            />
            <StatCard
                title={t("purchases.stats.pendingPayments", "Pending Payments")}
                value={stats.pendingPayments}
                icon={<Clock className="w-5 h-5" />}
                trend={{
                    value: stats.pendingPaymentsTrend || 0,
                    label: t("purchases.stats.thisMonth", "this month"),
                }}
                variant="orange"
            />
            <StatCard
                title={t("purchases.stats.paidInvoices", "Paid Invoices")}
                value={stats.paidInvoices}
                icon={<CheckCircle className="w-5 h-5" />}
                trend={{
                    value: stats.paidInvoicesTrend || 0,
                    label: t("purchases.stats.thisMonth", "this month"),
                }}
                variant="blue"
            />
        </div>
    );
}

export default InvoiceStatsRow;
