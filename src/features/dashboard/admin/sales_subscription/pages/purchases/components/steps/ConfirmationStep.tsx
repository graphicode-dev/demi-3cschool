/**
 * Step 7: Confirmation Step
 *
 * Review all selections and confirm invoice creation.
 */

import React, { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AlertCircle } from "lucide-react";
import { useInvoiceWizardStore, selectFormData } from "../../stores";

interface SummaryRowProps {
    label: string;
    value: React.ReactNode;
}

const SummaryRow = memo(function SummaryRow({ label, value }: SummaryRowProps) {
    return (
        <div className="py-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                {label}
            </p>
            <p className="text-sm font-medium text-foreground">{value}</p>
        </div>
    );
});

export const ConfirmationStep = memo(function ConfirmationStep() {
    const { t } = useTranslation("salesSubscription");

    const formData = useInvoiceWizardStore(selectFormData);
    const getSubtotal = useInvoiceWizardStore((state) => state.getSubtotal);
    const getDiscount = useInvoiceWizardStore((state) => state.getDiscount);
    const getTotal = useInvoiceWizardStore((state) => state.getTotal);

    const subtotal = getSubtotal();
    const discount = getDiscount();
    const total = getTotal();

    const programTypeLabel = useMemo(() => {
        if (!formData.programType) return "-";
        return formData.programType === "standard"
            ? t("purchases.wizard.programTypes.standard", "Standard")
            : t("purchases.wizard.programTypes.professional", "Professional");
    }, [formData.programType, t]);

    const groupTypeLabel = useMemo(() => {
        if (!formData.groupType) return "-";
        const labels: Record<string, string> = {
            regular: t("purchases.wizard.groupTypes.regular", "Regular"),
            semi_private: t(
                "purchases.wizard.groupTypes.semiPrivate",
                "Semi Private"
            ),
            private: t("purchases.wizard.groupTypes.private", "Private"),
        };
        return labels[formData.groupType];
    }, [formData.groupType, t]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">
                    {t(
                        "purchases.wizard.steps.confirmation.title",
                        "Review & Confirm"
                    )}
                </h2>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                    <SummaryRow
                        label={t(
                            "purchases.wizard.steps.confirmation.student",
                            "STUDENT"
                        )}
                        value={formData.student?.name || "-"}
                    />
                    <SummaryRow
                        label={t(
                            "purchases.wizard.steps.confirmation.programType",
                            "PROGRAM TYPE"
                        )}
                        value={programTypeLabel}
                    />
                    <SummaryRow
                        label={t(
                            "purchases.wizard.steps.confirmation.course",
                            "COURSE"
                        )}
                        value={formData.course?.name || "-"}
                    />
                    <SummaryRow
                        label={t(
                            "purchases.wizard.steps.confirmation.level",
                            "LEVEL"
                        )}
                        value={formData.level?.name || "-"}
                    />
                    <SummaryRow
                        label={t(
                            "purchases.wizard.steps.confirmation.groupType",
                            "GROUP TYPE"
                        )}
                        value={groupTypeLabel}
                    />
                    <SummaryRow
                        label={t(
                            "purchases.wizard.steps.confirmation.pricingPlan",
                            "PRICING PLAN"
                        )}
                        value={formData.pricingPlan?.name || "-"}
                    />
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                            {t(
                                "purchases.wizard.steps.confirmation.subtotal",
                                "Subtotal"
                            )}
                        </span>
                        <span className="text-sm font-medium text-foreground">
                            {formatCurrency(subtotal)}
                        </span>
                    </div>

                    {discount > 0 && (
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-emerald-600 dark:text-emerald-400">
                                {t(
                                    "purchases.wizard.steps.confirmation.discount",
                                    "Discount"
                                )}
                            </span>
                            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                -{formatCurrency(discount)}
                            </span>
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-base font-semibold text-foreground">
                            {t(
                                "purchases.wizard.steps.confirmation.finalTotal",
                                "Final Total"
                            )}
                        </span>
                        <span className="text-2xl font-bold text-brand-500">
                            {formatCurrency(total)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                <AlertCircle
                    className="h-5 w-5 text-amber-600 shrink-0 mt-0.5"
                    aria-hidden="true"
                />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>
                        {t("purchases.wizard.steps.confirmation.note", "Note:")}
                    </strong>{" "}
                    {t(
                        "purchases.wizard.steps.confirmation.noteText",
                        "Once created, the invoice will be sent to the student's registered email and available in the system."
                    )}
                </p>
            </div>
        </div>
    );
});

export default ConfirmationStep;
