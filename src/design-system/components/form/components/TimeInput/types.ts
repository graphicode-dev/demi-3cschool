// src/components/TimeInput/types.ts
export interface TimeInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    min?: string;
    max?: string;
    step?: number;
}
