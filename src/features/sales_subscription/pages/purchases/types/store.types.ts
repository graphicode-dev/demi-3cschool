import type { ProgramType, GroupType } from "../types";

export interface Student {
    id: string;
    name: string;
    studentId: string;
    grade: string;
    parentContact: string;
}

export interface Course {
    id: string;
    name: string;
}

export interface Level {
    id: string;
    name: string;
}

export interface PricingPlan {
    id: string;
    name: string;
    description: string;
    originalPrice: number;
    price: number;
    installments: number;
}

export interface PromoCodeResult {
    code: string;
    discountAmount: number;
    isValid: boolean;
}

export interface InvoiceFormData {
    student: Student | null;
    programType: ProgramType | null;
    course: Course | null;
    level: Level | null;
    groupType: GroupType | null;
    pricingPlan: PricingPlan | null;
    promoCode: PromoCodeResult | null;
}

export interface InvoiceWizardState {
    currentStep: number;
    totalSteps: number;
    formData: InvoiceFormData;
    isSubmitting: boolean;
    completedSteps: number[];
}

export interface InvoiceWizardActions {
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    setStudent: (student: Student | null) => void;
    setProgramType: (type: ProgramType | null) => void;
    setCourse: (course: Course | null) => void;
    setLevel: (level: Level | null) => void;
    setGroupType: (type: GroupType | null) => void;
    setPricingPlan: (plan: PricingPlan | null) => void;
    setPromoCode: (result: PromoCodeResult | null) => void;
    markStepCompleted: (step: number) => void;
    setIsSubmitting: (isSubmitting: boolean) => void;
    reset: () => void;
    getSubtotal: () => number;
    getDiscount: () => number;
    getTotal: () => number;
    getInstallmentAmount: () => number;
}
