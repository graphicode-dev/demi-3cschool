/**
 * Step 6: Promo Code Step
 *
 * Optional promo code input with validation.
 */

import React, { memo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Tag, Check, Loader2 } from "lucide-react";
import { cn } from "@/utils";
import { Button } from "@/shared/components/ui/button";
import {
    useInvoiceWizardStore,
    selectPromoCode,
    selectPricingPlan,
    selectStudent,
    selectLevel,
} from "../../stores";
import { useValidateCoupon } from "../../../coupons/api";
import { useMutationHandler } from "@/shared/api";

export const PromoCodeStep = memo(function PromoCodeStep() {
    const { t } = useTranslation("salesSubscription");

    const promoCodeResult = useInvoiceWizardStore(selectPromoCode);
    const pricingPlan = useInvoiceWizardStore(selectPricingPlan);
    const student = useInvoiceWizardStore(selectStudent);
    const level = useInvoiceWizardStore(selectLevel);
    const setPromoCode = useInvoiceWizardStore((state) => state.setPromoCode);

    const [inputValue, setInputValue] = useState(promoCodeResult?.code || "");
    const [error, setError] = useState<string | null>(null);
    const { execute } = useMutationHandler();

    const subtotal = pricingPlan?.price ?? 0;

    // Use the validate coupon mutation
    const { mutateAsync: validateCoupon, isPending: isValidating } =
        useValidateCoupon();

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setInputValue(e.target.value);
            setError(null);
        },
        []
    );

    const handleApply = useCallback(() => {
        if (!inputValue.trim()) {
            setError(
                t(
                    "purchases.wizard.steps.promoCode.enterCode",
                    "Please enter a code"
                )
            );
            return;
        }

        setError(null);

        execute(
            () =>
                validateCoupon({
                    code: inputValue,
                    level_id: level?.id || "",
                    amount: subtotal,
                    student_id: student?.id || "",
                }),
            {
                showSuccessToast: false,
                onSuccess: (result) => {
                    if (result.valid && result.coupon) {
                        const discountAmount =
                            result.coupon.type === "percentage"
                                ? (subtotal * parseFloat(result.coupon.value)) /
                                  100
                                : parseFloat(result.coupon.value);

                        setPromoCode({
                            code: inputValue.toUpperCase(),
                            discountAmount,
                            isValid: true,
                        });
                    } else {
                        setError(
                            result.message ||
                                t(
                                    "purchases.wizard.steps.promoCode.invalidCode",
                                    "Invalid promo code"
                                )
                        );
                        setPromoCode(null);
                    }
                },
                onError: () => {
                    setError(
                        t(
                            "purchases.wizard.steps.promoCode.errorValidating",
                            "Error validating code"
                        )
                    );
                },
            }
        );
    }, [
        inputValue,
        subtotal,
        student,
        level,
        setPromoCode,
        t,
        validateCoupon,
        execute,
    ]);

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
                        "purchases.wizard.steps.promoCode.title",
                        "Apply Promo Code"
                    )}
                </h2>
            </div>

            <div className="rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6 space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Tag className="h-5 w-5" aria-hidden="true" />
                    <span className="text-sm font-medium">
                        {t(
                            "purchases.wizard.steps.promoCode.haveCode",
                            "Have a promo code?"
                        )}
                    </span>
                </div>

                <div className="flex gap-3">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder={t(
                            "purchases.wizard.steps.promoCode.placeholder",
                            "Enter promo code"
                        )}
                        className={cn(
                            "flex-1 px-4 py-3 rounded-xl border-2 bg-gray-100 dark:bg-gray-800 text-sm",
                            "focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500",
                            error && "border-destructive",
                            promoCodeResult?.isValid &&
                                "border-brand-500 bg-brand-50 dark:bg-brand-950/30"
                        )}
                        disabled={isValidating}
                    />
                    <Button
                        type="button"
                        onClick={handleApply}
                        disabled={isValidating || !inputValue.trim()}
                        className="bg-brand-500 hover:bg-brand-600 text-white px-6 rounded-xl"
                    >
                        {isValidating ? (
                            <Loader2
                                className="h-4 w-4 animate-spin"
                                aria-hidden="true"
                            />
                        ) : (
                            t("purchases.wizard.steps.promoCode.apply", "Apply")
                        )}
                    </Button>
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                {promoCodeResult?.isValid && (
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <Check className="h-4 w-4" aria-hidden="true" />
                        <span className="text-sm font-medium">
                            {t(
                                "purchases.wizard.steps.promoCode.applied",
                                "Promo code applied!"
                            )}{" "}
                            {t(
                                "purchases.wizard.steps.promoCode.youSaved",
                                "You saved"
                            )}{" "}
                            {formatCurrency(promoCodeResult.discountAmount)}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
});

export default PromoCodeStep;
