// src/components/OTP/types.ts
export interface OTPProps {
    value: string;
    onChange: (value: string) => void;
    length?: number;
    disabled?: boolean;
    autoFocus?: boolean;
    resendable?: boolean;
    resendInterval?: number;
    onResend?: () => void;
    onComplete?: (value: string) => void;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
}
