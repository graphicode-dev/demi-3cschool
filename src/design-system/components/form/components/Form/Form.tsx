// src/components/Form/Form.tsx
import { FieldValues } from "react-hook-form";
import { FormProps } from "./types";
import { FormProvider } from "./FormContext";
import { FormField } from "./FormField";
import { FormButton, FormButtonGroup } from "./FormButton";
import { FormInputWrapper } from "./FormInputWrapper";
import { cn } from "../../utils/cn";
import { getFormConfig, getMergedClassName } from "../../config/formConfig";
import {
    getResponsiveGridClasses,
    getResponsiveGapClasses,
    getResponsiveRowGapClasses,
    getResponsiveColGapClasses,
} from "../../utils/responsive";

function FormRoot<T extends FieldValues = FieldValues>({
    children,
    control,
    errors,
    onSubmit,
    layout = {},
}: FormProps<T>) {
    const globalConfig = getFormConfig();

    const {
        className,
        formClassName,
        removeBorder = globalConfig.layout?.removeBorder || false,
        noPadding = globalConfig.layout?.noPadding || false,
        gap = globalConfig.layout?.gap,
        gapX = globalConfig.layout?.gapX,
        gapY = globalConfig.layout?.gapY,
        columns = globalConfig.layout?.columns,
    } = layout;

    return (
        <FormProvider control={control} errors={errors}>
            <div
                className={cn(
                    "w-full",
                    getMergedClassName("wrapper", className)
                )}
            >
                <form
                    onSubmit={onSubmit}
                    className={cn(
                        "w-full grid",
                        !removeBorder &&
                            "border border-gray-200 dark:border-gray-700 rounded-lg",
                        !noPadding && "p-6",
                        getResponsiveGridClasses(columns),
                        // Use specific gapX/gapY if provided, otherwise use general gap
                        gapX || gapY
                            ? cn(
                                  getResponsiveColGapClasses(gapX),
                                  getResponsiveRowGapClasses(gapY)
                              )
                            : getResponsiveGapClasses(gap),
                        getMergedClassName("form", formClassName)
                    )}
                >
                    {children}
                </form>
            </div>
        </FormProvider>
    );
}

// Create the compound component with proper typing
const Form = Object.assign(FormRoot, {
    Field: FormField,
    Input: FormInputWrapper,
    Button: FormButton,
    ButtonGroup: FormButtonGroup,
});

// Export both named and default
export { Form };
export default Form;
