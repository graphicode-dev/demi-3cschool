/**
 * Invoices Tab Component
 */

import { useTranslation } from "react-i18next";
import { Receipt } from "lucide-react";
import type { InvoiceRecord } from "../types/profile.types";

interface InvoicesTabProps {
    invoices: InvoiceRecord[];
}

export default function InvoicesTab({ invoices }: InvoicesTabProps) {
    const { t } = useTranslation("profile");

    const getStatusBadge = (status: InvoiceRecord["status"]) => {
        const styles = {
            paid: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
            partial:
                "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
            unpaid: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
        };
        return styles[status];
    };

    const getRowColor = (index: number, status: InvoiceRecord["status"]) => {
        if (status === "paid") return "bg-green-50 dark:bg-green-900/10";
        if (status === "partial") return "bg-orange-50 dark:bg-orange-900/10";
        if (status === "unpaid") return "bg-red-50 dark:bg-red-900/10";
        return index % 2 === 0
            ? "bg-white dark:bg-gray-800"
            : "bg-gray-50 dark:bg-gray-800";
    };

    return (
        <div className="rounded-b-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                {t("profile.invoices.title", "Invoices")}
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-start py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {t("profile.invoices.invoiceId", "Invoice ID")}
                            </th>
                            <th className="text-start py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {t(
                                    "profile.invoices.programType",
                                    "Program Type"
                                )}
                            </th>
                            <th className="text-start py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {t(
                                    "profile.invoices.courseLevel",
                                    "Course & Level"
                                )}
                            </th>
                            <th className="text-start py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {t(
                                    "profile.invoices.totalAmount",
                                    "Total Amount"
                                )}
                            </th>
                            <th className="text-start py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {t(
                                    "profile.invoices.paidAmount",
                                    "Paid Amount"
                                )}
                            </th>
                            <th className="text-start py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {t("profile.invoices.remaining", "Remaining")}
                            </th>
                            <th className="text-start py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {t("profile.invoices.status", "Status")}
                            </th>
                            <th className="text-start py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {t("profile.invoices.createdAt", "Created")}
                            </th>
                            <th className="text-start py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {t("profile.invoices.action", "Action")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice, index) => (
                            <tr
                                key={invoice.id}
                                className={`border-b border-gray-100 dark:border-gray-800 last:border-0 ${getRowColor(index, invoice.status)}`}
                            >
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                                            <Receipt className="w-4 h-4 text-brand-500" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {invoice.invoiceId}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                                    {invoice.programType}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                                    {invoice.courseLevel}
                                </td>
                                <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                                    EGP {invoice.totalAmount.toLocaleString()}
                                </td>
                                <td className="py-3 px-4 text-sm text-green-600 dark:text-green-400">
                                    EGP {invoice.paidAmount.toLocaleString()}
                                </td>
                                <td className="py-3 px-4 text-sm text-red-600 dark:text-red-400">
                                    EGP {invoice.remaining.toLocaleString()}
                                </td>
                                <td className="py-3 px-4">
                                    <span
                                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(invoice.status)}`}
                                    >
                                        {t(
                                            `profile.invoices.${invoice.status}`,
                                            invoice.status
                                        )}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                                    {invoice.createdAt}
                                </td>
                                <td className="py-3 px-4">
                                    {invoice.status !== "paid" && (
                                        <button className="px-3 py-1.5 text-xs font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-lg transition-colors">
                                            {t("profile.invoices.pay", "Pay")}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
