// src/components/CheckBox/types.ts
export interface CheckBoxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
    className?: string;
    checkedIcon?: React.ReactNode;
    uncheckedIcon?: React.ReactNode;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    variant?: "default" | "outlined" | "filled";
}
