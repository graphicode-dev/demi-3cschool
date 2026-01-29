// src/components/FileInput/types.ts
export interface FileInputProps {
    value: File | File[] | null;
    onChange: (value: File | File[] | null) => void;
    accept?: string;
    multiple?: boolean;
    maxSize?: number;
    disabled?: boolean;
    className?: string;
}
