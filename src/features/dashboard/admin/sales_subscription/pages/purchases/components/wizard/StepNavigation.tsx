/**
 * Step Navigation Component
 *
 * Previous/Next buttons for wizard navigation.
 * Handles step validation before proceeding.
 */

import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface StepNavigationProps {
    currentStep: number;
    totalSteps: number;
    onPrevious: () => void;
    onNext: () => void;
    onSubmit?: () => void;
    isNextDisabled?: boolean;
    isSubmitting?: boolean;
}

export const StepNavigation = memo(function StepNavigation({
    currentStep,
    totalSteps,
    onPrevious,
    onNext,
    onSubmit,
    isNextDisabled = false,
    isSubmitting = false,
}: StepNavigationProps) {
    const { t } = useTranslation("salesSubscription");

    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === totalSteps;

    return (
        <div className="flex items-center justify-between pt-6">
            <Button
                type="button"
                variant="outline"
                onClick={onPrevious}
                disabled={isFirstStep || isSubmitting}
                className="gap-2 rounded-xl border-2 px-5"
            >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {t("purchases.wizard.previous", "Previous")}
            </Button>

            {isLastStep ? (
                <Button
                    type="button"
                    onClick={onSubmit}
                    disabled={isNextDisabled || isSubmitting}
                    className="gap-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl px-6"
                >
                    {isSubmitting ? (
                        <Loader2
                            className="h-4 w-4 animate-spin"
                            aria-hidden="true"
                        />
                    ) : (
                        <Check className="h-4 w-4" aria-hidden="true" />
                    )}
                    {t("purchases.wizard.createInvoice", "Create Invoice")}
                </Button>
            ) : (
                <Button
                    type="button"
                    onClick={onNext}
                    disabled={isNextDisabled || isSubmitting}
                    className="gap-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl px-6"
                >
                    {t("purchases.wizard.next", "Next")}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
            )}
        </div>
    );
});

export default StepNavigation;
