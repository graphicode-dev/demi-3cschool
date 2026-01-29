// src/components/OTPInput/index.tsx
import { OTP } from "../OTP";
import { OTPInputProps } from "./types";

export const OTPInput: React.FC<OTPInputProps> = ({
    field,
    length = 6,
    onComplete,
    resendable = false,
    resendInterval = 60,
    onResend,
    disabled = false,
    autoFocus = false,
    size = "md",
}) => {
    return (
        <OTP
            value={field.value || ""}
            onChange={(value) => field.onChange(value)}
            onComplete={onComplete}
            length={length}
            resendable={resendable}
            resendInterval={resendInterval}
            onResend={onResend}
            disabled={disabled}
            autoFocus={autoFocus}
            size={size}
        />
    );
};
