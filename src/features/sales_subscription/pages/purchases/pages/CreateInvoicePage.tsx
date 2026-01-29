/**
 * Create Subscription Page
 *
 * Multi-step wizard for creating student subscriptions.
 * Uses Zustand for state management and separates UI from logic.
 */

import React, { memo, useCallback, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { salesPaths } from "../../../navigation/paths";
import { useCreateLevelSubscription } from "../../installments";
import {
    useInvoiceWizardStore,
    selectCurrentStep,
    selectFormData,
    selectCompletedSteps,
    selectIsSubmitting,
} from "../stores";
import {
    StepIndicator,
    StepNavigation,
    InvoicePreview,
} from "../components/wizard";
import {
    StudentInformationStep,
    LearningTypeStep,
    CourseLevelStep,
    GroupSelectionStep,
    PricingPlanStep,
    PromoCodeStep,
    ConfirmationStep,
} from "../components/steps";
import PageWrapper from "@/design-system/components/PageWrapper";
import { useMutationHandler } from "@/shared/api";

// ============================================================================
// Constants
// ============================================================================

const WIZARD_STEPS = [
    {
        key: "student",
        labelKey: "sales_subscription:purchases.wizard.steps.student.stepTitle",
    },
    {
        key: "learningType",
        labelKey:
            "sales_subscription:purchases.wizard.steps.learningType.stepTitle",
    },
    {
        key: "courseLevel",
        labelKey:
            "sales_subscription:purchases.wizard.steps.courseLevel.stepTitle",
    },
    {
        key: "groupSelection",
        labelKey:
            "sales_subscription:purchases.wizard.steps.groupSelection.stepTitle",
    },
    {
        key: "pricingPlan",
        labelKey:
            "sales_subscription:purchases.wizard.steps.pricingPlan.stepTitle",
    },
    {
        key: "promoCode",
        labelKey:
            "sales_subscription:purchases.wizard.steps.promoCode.stepTitle",
    },
    {
        key: "confirmation",
        labelKey:
            "sales_subscription:purchases.wizard.steps.confirmation.stepTitle",
    },
];

// ============================================================================
// Step Content Component
// ============================================================================

interface StepContentProps {
    step: number;
}

const StepContent = memo(function StepContent({ step }: StepContentProps) {
    switch (step) {
        case 1:
            return <StudentInformationStep />;
        case 2:
            return <LearningTypeStep />;
        case 3:
            return <CourseLevelStep />;
        case 4:
            return <GroupSelectionStep />;
        case 5:
            return <PricingPlanStep />;
        case 6:
            return <PromoCodeStep />;
        case 7:
            return <ConfirmationStep />;
        default:
            return null;
    }
});

// ============================================================================
// Validation Hook
// ============================================================================

function useStepValidation() {
    const formData = useInvoiceWizardStore(selectFormData);

    const isStepValid = useCallback(
        (step: number): boolean => {
            switch (step) {
                case 1:
                    return formData.student !== null;
                case 2:
                    return formData.programType !== null;
                case 3:
                    return formData.course !== null && formData.level !== null;
                case 4:
                    return formData.groupType !== null;
                case 5:
                    return formData.pricingPlan !== null;
                case 6:
                    return true; // Promo code is optional
                case 7:
                    return true; // Confirmation step
                default:
                    return false;
            }
        },
        [formData]
    );

    return { isStepValid };
}

// ============================================================================
// Main Component
// ============================================================================

function CreateInvoicePageContent() {
    const { t } = useTranslation("salesSubscription");
    const navigate = useNavigate();

    const currentStep = useInvoiceWizardStore(selectCurrentStep);
    const completedSteps = useInvoiceWizardStore(selectCompletedSteps);
    const isSubmitting = useInvoiceWizardStore(selectIsSubmitting);
    const formData = useInvoiceWizardStore(selectFormData);

    const nextStep = useInvoiceWizardStore((state) => state.nextStep);
    const prevStep = useInvoiceWizardStore((state) => state.prevStep);
    const markStepCompleted = useInvoiceWizardStore(
        (state) => state.markStepCompleted
    );
    const setIsSubmitting = useInvoiceWizardStore(
        (state) => state.setIsSubmitting
    );
    const reset = useInvoiceWizardStore((state) => state.reset);

    const { isStepValid } = useStepValidation();
    const createMutation = useCreateLevelSubscription();
    const { execute } = useMutationHandler();

    const totalSteps = WIZARD_STEPS.length;

    // Reset wizard on mount
    useEffect(() => {
        reset();
    }, [reset]);

    const handleNext = useCallback(() => {
        if (isStepValid(currentStep)) {
            markStepCompleted(currentStep);
            nextStep();
        }
    }, [currentStep, isStepValid, markStepCompleted, nextStep]);

    const handlePrevious = useCallback(() => {
        prevStep();
    }, [prevStep]);

    const handleSubmit = useCallback(async () => {
        if (!formData.student || !formData.pricingPlan || !formData.level)
            return;

        setIsSubmitting(true);

        await execute(
            () =>
                createMutation.mutateAsync({
                    studentId: formData.student!.id,
                    levelId: formData.level!.id,
                    levelPriceId: Number(formData.pricingPlan!.id),
                    couponId: formData.promoCode?.isValid
                        ? Number(formData.promoCode.code)
                        : undefined,
                }),
            {
                onSuccess: () => {
                    reset();
                    navigate(salesPaths.purchases.list());
                },
            }
        );

        setIsSubmitting(false);
    }, [formData, createMutation, navigate, reset, setIsSubmitting, execute]);

    const isNextDisabled = useMemo(
        () => !isStepValid(currentStep),
        [currentStep, isStepValid]
    );

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t(
                    "subscriptions.wizard.title",
                    "Create Student Subscription"
                ),
                subtitle: t(
                    "subscriptions.wizard.subtitle",
                    `Step ${currentStep} of ${totalSteps}`
                ),
                backButton: true,
            }}
        >
            <StepIndicator
                steps={WIZARD_STEPS}
                currentStep={currentStep}
                completedSteps={completedSteps}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                <div className="lg:col-span-2">
                    <div className="rounded-lg border bg-card p-6">
                        <StepContent step={currentStep} />

                        <StepNavigation
                            currentStep={currentStep}
                            totalSteps={totalSteps}
                            onPrevious={handlePrevious}
                            onNext={handleNext}
                            onSubmit={handleSubmit}
                            isNextDisabled={isNextDisabled}
                            isSubmitting={isSubmitting}
                        />
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <InvoicePreview />
                </div>
            </div>
        </PageWrapper>
    );
}

export const CreateInvoicePage = memo(CreateInvoicePageContent);

export default CreateInvoicePage;
