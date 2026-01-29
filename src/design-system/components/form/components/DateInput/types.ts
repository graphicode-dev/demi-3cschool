// src/components/DateInput/types.ts
export interface DateInputProps {
    value: string | Date;
    onChange: (value: string | Date) => void;
    mode?: "single" | "range" | "multiple";
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
}
