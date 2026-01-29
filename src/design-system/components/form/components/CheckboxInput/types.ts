// src/components/CheckboxInput/types.ts
import { ControllerRenderProps } from "react-hook-form";

export interface CheckboxInputProps {
    field: ControllerRenderProps<any, any>;
    label?: string;
    disabled?: boolean;
    className?: string;
    checkedIcon?: React.ReactNode;
    uncheckedIcon?: React.ReactNode;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    variant?: "default" | "outlined" | "filled";
}
