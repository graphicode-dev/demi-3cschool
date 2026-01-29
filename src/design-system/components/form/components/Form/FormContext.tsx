// src/components/Form/FormContext.tsx
import { createContext, useContext } from "react";
import type { Control, FieldErrors, FieldValues } from "react-hook-form";

interface FormContextValue<TFieldValues extends FieldValues = FieldValues> {
    control: Control<TFieldValues>;
    errors?: FieldErrors<TFieldValues>;
}

const FormContext = createContext<FormContextValue<any> | null>(null);

export const useFormContext = <
    TFieldValues extends FieldValues = FieldValues
>() => {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error("useFormContext must be used within a FormProvider");
    }
    return context as FormContextValue<TFieldValues>;
};

interface FormProviderProps<TFieldValues extends FieldValues = FieldValues> {
    children: React.ReactNode;
    control: Control<TFieldValues>;
    errors?: FieldErrors<TFieldValues>;
}

export const FormProvider = <TFieldValues extends FieldValues = FieldValues>({
    children,
    control,
    errors,
}: FormProviderProps<TFieldValues>) => {
    return (
        <FormContext.Provider
            value={{ control, errors } as FormContextValue<TFieldValues>}
        >
            {children}
        </FormContext.Provider>
    );
};
