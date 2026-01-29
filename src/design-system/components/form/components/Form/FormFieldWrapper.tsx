// src/components/Form/FormFieldWrapper.tsx
import { FormFieldWrapperProps } from "./types";
import { cn } from "../../utils/cn";
import { getFormConfig, getMergedClassName } from "../../config/formConfig";
import { helperTextVariants } from "../../styles/variants";

export const FormFieldWrapper = ({
    children,
    label,
    validation = {},
    layout = {},
    labelClassName,
    size = "md",
}: FormFieldWrapperProps) => {
    const globalConfig = getFormConfig();

    const status = validation.error
        ? "error"
        : validation.successMessage
        ? "success"
        : "default";

    const showError =
        (validation.showError !== false && validation.error) ||
        (validation.showError === undefined && validation.error);
    const showSuccess = validation.showSuccess && validation.successMessage;

    return (
        <div className={cn("flex flex-col w-full", layout.className)}>
            {label?.show !== false && label?.text && (
                <label className={labelClassName}>{label.text}</label>
            )}
            {children}
            {showError && (
                <p
                    className={cn(
                        helperTextVariants({ status: "error" }),
                        getMergedClassName("error")
                    )}
                >
                    {validation.error}
                </p>
            )}
            {showSuccess && (
                <p
                    className={cn(
                        helperTextVariants({ status: "success" }),
                        getMergedClassName("success")
                    )}
                >
                    {validation.successMessage}
                </p>
            )}
            {label?.requiredText && (
                <p
                    className={cn(
                        helperTextVariants({ status: "default" }),
                        getMergedClassName("helper")
                    )}
                >
                    {label.requiredText}
                </p>
            )}
        </div>
    );
};
