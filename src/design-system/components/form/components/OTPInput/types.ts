// src/components/OTPInput/types.ts
import { ControllerRenderProps } from "react-hook-form";

export interface OTPInputProps {
    field: ControllerRenderProps<any, any>;
    length?: number;
    onComplete?: (code: string) => void;
    resendable?: boolean;
    resendInterval?: number;
    onResend?: () => Promise<void> | void;
    disabled?: boolean;
    autoFocus?: boolean;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
}
