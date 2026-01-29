// src/components/DropdownInput/types.ts
export interface DropdownOption {
    label: string;
    value: string;
}

export interface DropdownInputProps {
    value: string;
    onChange: (value: string) => void;
    options: DropdownOption[];
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    title?: string;
}
