// src/components/Form/FormField.tsx (ALTERNATIVE - More restrictive)
import { ReactElement } from "react";
import {
    Controller,
    FieldValues,
    ControllerRenderProps,
} from "react-hook-form";
import { FormFieldProps } from "./types";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { cn } from "../../utils/cn";
import { getFormConfig, getMergedClassName } from "../../config/formConfig";
import { labelVariants } from "../../styles/variants";
import { resolveResponsiveValue } from "../../utils/responsive";

export const FormField = <TFieldValues extends FieldValues = FieldValues>({
    name,
    control,
    label = {},
    validation = {},
    layout = {},
    children,
    style = {},
}: FormFieldProps<TFieldValues>) => {
    const globalConfig = getFormConfig();

    const status = validation.error
        ? "error"
        : validation.successMessage
        ? "success"
        : "default";

    const resolvedSize = resolveResponsiveValue(
        style.size || globalConfig.defaults?.size,
        "md"
    );

    const labelConfig = {
        text: label.text,
        show:
            label.show !== undefined
                ? label.show
                : globalConfig.label?.show !== false,
        required: label.required || globalConfig.label?.required || false,
        requiredText: label.requiredText,
        className:
            getMergedClassName("label", label.className) ||
            globalConfig.label?.className,
    };

    const labelClassName = cn(
        labelVariants({
            size: resolvedSize,
            status,
            required: labelConfig.required,
        }),
        labelConfig.className
    );

    return (
        <FormFieldWrapper
            label={labelConfig}
            validation={validation}
            layout={layout}
            labelClassName={labelClassName}
            size={resolvedSize}
        >
            <Controller<TFieldValues>
                name={name}
                control={control}
                render={({ field }) => {
                    if (typeof children === "function") {
                        return children(
                            field as ControllerRenderProps<TFieldValues>
                        );
                    }
                    return children || <></>;
                }}
            />
        </FormFieldWrapper>
    );
};
