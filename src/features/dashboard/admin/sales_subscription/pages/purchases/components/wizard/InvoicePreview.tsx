/**
 * Invoice Preview Component
 *
 * Real-time summary sidebar showing selected invoice details.
 * Updates as user progresses through wizard steps.
 */

import React, { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FileText } from "lucide-react";
import { cn } from "@/utils";
import { useInvoiceWizardStore } from "../../stores";

interface PreviewRowProps {
    label: string;
    value: React.ReactNode;
    highlight?: boolean;
    negative?: boolean;
}

const PreviewRow = memo(function PreviewRow({
    label,
    value,
    highlight = false,
    negative = false,
}: PreviewRowProps) {
    return (
        <div className="flex justify-between items-start py-1.5">
            <span
                className={cn(
                    "text-sm",
                    highlight
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground"
                )}
            >
                {label}
            </span>
            <span
                className={cn(
                    "text-sm text-right font-medium",
                    highlight && "font-bold",
                    negative && "text-emerald-600 dark:text-emerald-400"
                )}
            >
                {value}
            </span>
        </div>
    );
});

const PreviewSection = memo(function PreviewSection({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div className="space-y-1">{children}</div>;
});

export const InvoicePreview = memo(function InvoicePreview() {
    const { t } = useTranslation("salesSubscription");

    const formData = useInvoiceWizardStore((state) => state.formData);
    const getSubtotal = useInvoiceWizardStore((state) => state.getSubtotal);
    const getDiscount = useInvoiceWizardStore((state) => state.getDiscount);
    const getTotal = useInvoiceWizardStore((state) => state.getTotal);
    const getInstallmentAmount = useInvoiceWizardStore(
        (state) => state.getInstallmentAmount
    );

    const subtotal = getSubtotal();
    const discount = getDiscount();
    const total = getTotal();
    const installmentAmount = getInstallmentAmount();

    const programTypeLabel = useMemo(() => {
        if (!formData.programType) return null;
        return formData.programType === "standard"
            ? t("purchases.wizard.programTypes.standard", "Standard")
            : t("purchases.wizard.programTypes.professional", "Professional");
    }, [formData.programType, t]);

    const groupTypeLabel = useMemo(() => {
        if (!formData.groupType) return null;
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
        <div className="rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-card p-5 sticky top-6">
            <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-900/30">
                    <FileText
                        className="h-5 w-5 text-brand-600 dark:text-brand-400"
                        aria-hidden="true"
                    />
                </div>
                <div>
                    <h3 className="font-semibold text-foreground">
                        {t("purchases.wizard.preview.title", "Invoice Preview")}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        {t(
                            "purchases.wizard.preview.subtitle",
                            "Real-time summary"
                        )}
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {formData.student && (
                    <PreviewSection>
                        <PreviewRow
                            label={t(
                                "purchases.wizard.preview.student",
                                "Student"
                            )}
                            value={formData.student.name}
                        />
                    </PreviewSection>
                )}

                {programTypeLabel && (
                    <PreviewSection>
                        <PreviewRow
                            label={t(
                                "purchases.wizard.preview.programType",
                                "Program Type"
                            )}
                            value={
                                <span className="text-orange-500 font-medium">
                                    {programTypeLabel}
                                </span>
                            }
                        />
                    </PreviewSection>
                )}

                {(formData.course || formData.level) && (
                    <PreviewSection>
                        <PreviewRow
                            label={t(
                                "purchases.wizard.preview.courseLevel",
                                "Course & Level"
                            )}
                            value={
                                <div className="text-right">
                                    {formData.course && (
                                        <div>{formData.course.name}</div>
                                    )}
                                    {formData.level && (
                                        <div className="text-muted-foreground">
                                            {formData.level.name}
                                        </div>
                                    )}
                                </div>
                            }
                        />
                    </PreviewSection>
                )}

                {groupTypeLabel && (
                    <PreviewSection>
                        <PreviewRow
                            label={t(
                                "purchases.wizard.preview.groupType",
                                "Group Type"
                            )}
                            value={groupTypeLabel}
                        />
                    </PreviewSection>
                )}

                {formData.pricingPlan && (
                    <PreviewSection>
                        <PreviewRow
                            label={t(
                                "purchases.wizard.preview.pricingPlan",
                                "Pricing Plan"
                            )}
                            value={formData.pricingPlan.name}
                        />
                    </PreviewSection>
                )}

                {formData.pricingPlan && (
                    <>
                        <div className="border-t pt-4 space-y-2">
                            <PreviewRow
                                label={t(
                                    "purchases.wizard.preview.subtotal",
                                    "Subtotal"
                                )}
                                value={formatCurrency(subtotal)}
                            />

                            {discount > 0 && (
                                <PreviewRow
                                    label={t(
                                        "purchases.wizard.preview.discount",
                                        "Discount"
                                    )}
                                    value={`-${formatCurrency(discount)}`}
                                    negative
                                />
                            )}

                            <PreviewRow
                                label={t(
                                    "purchases.wizard.preview.total",
                                    "Total"
                                )}
                                value={
                                    <span className="text-brand-500 font-bold">
                                        {formatCurrency(total)}
                                    </span>
                                }
                                highlight
                            />
                        </div>

                        {formData.pricingPlan.installments > 1 && (
                            <div className="text-xs text-muted-foreground border-t border-gray-200 dark:border-gray-700 pt-3">
                                <div className="font-medium text-foreground">
                                    {t(
                                        "purchases.wizard.preview.installmentPlan",
                                        "Installment Plan"
                                    )}
                                </div>
                                <div>
                                    {formData.pricingPlan.installments}{" "}
                                    {t(
                                        "purchases.wizard.preview.paymentsOf",
                                        "payments of"
                                    )}{" "}
                                    <span className="text-brand-500 font-medium">
                                        {formatCurrency(installmentAmount)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
});

export default InvoicePreview;
