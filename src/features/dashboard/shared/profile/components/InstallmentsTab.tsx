/**
 * Installments Tab Component
 */

import { useTranslation } from "react-i18next";
import { CreditCard } from "lucide-react";
import type { InstallmentRecord } from "../types/profile.types";

interface InstallmentsTabProps {
    installments: InstallmentRecord[];
}

export default function InstallmentsTab({
    installments,
}: InstallmentsTabProps) {
    const { t } = useTranslation();

    const getStatusBadge = (status: InstallmentRecord["status"]) => {
        const styles = {
            paid: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
            pending:
                "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
            overdue:
                "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
        };
        return styles[status];
    };

    const getRowColor = (status: InstallmentRecord["status"]) => {
        if (status === "paid") return "bg-green-50 dark:bg-green-900/10";
        if (status === "pending") return "bg-orange-50 dark:bg-orange-900/10";
        if (status === "overdue") return "bg-red-50 dark:bg-red-900/10";
        return "";
    };

    return (
        <div className="rounded-b-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                {t("account:profile.installments.title", "Installments")}
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-start py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                #
                            </th>
                            <th className="text-start py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {t(
                                    "account:profile.installments.invoiceId",
                                    "Invoice ID"
                                )}
                            </th>
                            <th className="text-start py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {t(
                                    "account:profile.installments.amount",
                                    "Amount"
                                )}
                            </th>
                            <th className="text-start py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {t(
                                    "account:profile.installments.dueDate",
                                    "Due Date"
                                )}
                            </th>
                            <th className="text-start py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {t(
                                    "account:profile.installments.paymentDate",
                                    "Payment Date"
                                )}
                            </th>
                            <th className="text-start py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                {t(
                                    "account:profile.installments.status",
                                    "Status"
                                )}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {installments.map((installment, index) => (
                            <tr
                                key={installment.id}
                                className={`border-b border-gray-100 dark:border-gray-800 last:border-0 ${getRowColor(installment.status)}`}
                            >
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                                installment.status === "paid"
                                                    ? "bg-green-100 dark:bg-green-900/30"
                                                    : installment.status ===
                                                        "pending"
                                                      ? "bg-orange-100 dark:bg-orange-900/30"
                                                      : "bg-red-100 dark:bg-red-900/30"
                                            }`}
                                        >
                                            <CreditCard
                                                className={`w-4 h-4 ${
                                                    installment.status ===
                                                    "paid"
                                                        ? "text-green-500"
                                                        : installment.status ===
                                                            "pending"
                                                          ? "text-orange-500"
                                                          : "text-red-500"
                                                }`}
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {index + 1}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                                    {installment.invoiceId}
                                </td>
                                <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                                    EGP {installment.amount.toLocaleString()}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                                    {installment.dueDate}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                                    {installment.paymentDate || "-"}
                                </td>
                                <td className="py-3 px-4">
                                    <span
                                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(installment.status)}`}
                                    >
                                        {t(
                                            `account:profile.installments.${installment.status}`,
                                            installment.status
                                        )}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
