/**
 * Invoice Wizard Store
 *
 * Zustand store for managing multi-step invoice creation wizard state.
 * Separates UI state from form data for better performance.
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
    InvoiceFormData,
    InvoiceWizardActions,
    InvoiceWizardState,
} from "../types/store.types";

// ============================================================================
// Initial State
// ============================================================================

const initialFormData: InvoiceFormData = {
    student: null,
    programType: null,
    course: null,
    level: null,
    groupType: null,
    pricingPlan: null,
    promoCode: null,
};

const initialState: InvoiceWizardState = {
    currentStep: 1,
    totalSteps: 7,
    formData: initialFormData,
    isSubmitting: false,
    completedSteps: [],
};

// ============================================================================
// Store
// ============================================================================

export const useInvoiceWizardStore = create<
    InvoiceWizardState & InvoiceWizardActions
>()(
    devtools(
        (set, get) => ({
            ...initialState,

            setStep: (step) => {
                const { totalSteps } = get();
                if (step >= 1 && step <= totalSteps) {
                    set({ currentStep: step }, false, "setStep");
                }
            },

            nextStep: () => {
                const { currentStep, totalSteps } = get();
                if (currentStep < totalSteps) {
                    set({ currentStep: currentStep + 1 }, false, "nextStep");
                }
            },

            prevStep: () => {
                const { currentStep } = get();
                if (currentStep > 1) {
                    set({ currentStep: currentStep - 1 }, false, "prevStep");
                }
            },

            setStudent: (student) => {
                set(
                    (state) => ({
                        formData: { ...state.formData, student },
                    }),
                    false,
                    "setStudent"
                );
            },

            setProgramType: (programType) => {
                set(
                    (state) => ({
                        formData: { ...state.formData, programType },
                    }),
                    false,
                    "setProgramType"
                );
            },

            setCourse: (course) => {
                set(
                    (state) => ({
                        formData: { ...state.formData, course },
                    }),
                    false,
                    "setCourse"
                );
            },

            setLevel: (level) => {
                set(
                    (state) => ({
                        formData: { ...state.formData, level },
                    }),
                    false,
                    "setLevel"
                );
            },

            setGroupType: (groupType) => {
                set(
                    (state) => ({
                        formData: { ...state.formData, groupType },
                    }),
                    false,
                    "setGroupType"
                );
            },

            setPricingPlan: (pricingPlan) => {
                set(
                    (state) => ({
                        formData: { ...state.formData, pricingPlan },
                    }),
                    false,
                    "setPricingPlan"
                );
            },

            setPromoCode: (promoCode) => {
                set(
                    (state) => ({
                        formData: { ...state.formData, promoCode },
                    }),
                    false,
                    "setPromoCode"
                );
            },

            markStepCompleted: (step) => {
                set(
                    (state) => ({
                        completedSteps: state.completedSteps.includes(step)
                            ? state.completedSteps
                            : [...state.completedSteps, step],
                    }),
                    false,
                    "markStepCompleted"
                );
            },

            setIsSubmitting: (isSubmitting) => {
                set({ isSubmitting }, false, "setIsSubmitting");
            },

            reset: () => {
                set(initialState, false, "reset");
            },

            getSubtotal: () => {
                const { formData } = get();
                return formData.pricingPlan?.price ?? 0;
            },

            getDiscount: () => {
                const { formData } = get();
                return formData.promoCode?.discountAmount ?? 0;
            },

            getTotal: () => {
                const { getSubtotal, getDiscount } = get();
                return Math.max(0, getSubtotal() - getDiscount());
            },

            getInstallmentAmount: () => {
                const { formData, getTotal } = get();
                const installments = formData.pricingPlan?.installments ?? 1;
                return getTotal() / installments;
            },
        }),
        { name: "invoice-wizard" }
    )
);

// ============================================================================
// Selectors (for performance optimization)
// ============================================================================

export const selectCurrentStep = (state: InvoiceWizardState) =>
    state.currentStep;
export const selectFormData = (state: InvoiceWizardState) => state.formData;
export const selectStudent = (state: InvoiceWizardState) =>
    state.formData.student;
export const selectProgramType = (state: InvoiceWizardState) =>
    state.formData.programType;
export const selectCourse = (state: InvoiceWizardState) =>
    state.formData.course;
export const selectLevel = (state: InvoiceWizardState) => state.formData.level;
export const selectGroupType = (state: InvoiceWizardState) =>
    state.formData.groupType;
export const selectPricingPlan = (state: InvoiceWizardState) =>
    state.formData.pricingPlan;
export const selectPromoCode = (state: InvoiceWizardState) =>
    state.formData.promoCode;
export const selectIsSubmitting = (state: InvoiceWizardState) =>
    state.isSubmitting;
export const selectCompletedSteps = (state: InvoiceWizardState) =>
    state.completedSteps;
