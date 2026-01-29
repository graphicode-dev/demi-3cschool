// src/components/Form/FormInputWrapper.tsx
import { FieldValues } from "react-hook-form";
import { FormInputProps } from "./types";
import { FormBaseInput } from "./FormBaseInput";
import { useFormContext } from "./FormContext";

export const FormInputWrapper = <
    TFieldValues extends FieldValues = FieldValues
>(
    props: FormInputProps<TFieldValues>
) => {
    const { control } = useFormContext<TFieldValues>();

    // Use the provided control or fallback to context control
    const finalControl = props.control || control;

    return <FormBaseInput<TFieldValues> {...props} control={finalControl} />;
};
