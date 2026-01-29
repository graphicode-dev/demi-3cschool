// src/components/OTP/index.tsx
import { useState, useRef, useEffect } from "react";
import { OTPProps } from "./types";
import { cn } from "../../utils/cn";

export const OTP = ({
    value,
    onChange,
    length = 6,
    disabled = false,
    autoFocus = false,
    resendable = false,
    resendInterval = 60,
    onResend,
    onComplete,
    size = "md",
}: OTPProps) => {
    const [countdown, setCountdown] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const sizeClasses = {
        xs: "h-8 w-8 text-sm",
        sm: "h-10 w-10 text-base",
        md: "h-12 w-12 text-lg",
        lg: "h-14 w-14 text-xl",
        xl: "h-16 w-16 text-2xl",
    };

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    useEffect(() => {
        if (autoFocus && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [autoFocus]);

    const handleChange = (index: number, newValue: string) => {
        if (disabled) return;

        const sanitizedValue = newValue.replace(/[^0-9]/g, "");
        if (sanitizedValue.length > 1) return;

        const newOTP = value.split("");
        newOTP[index] = sanitizedValue;
        const newOTPString = newOTP.join("");

        onChange(newOTPString);

        // Auto-focus next input
        if (sanitizedValue && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Check if complete
        if (newOTPString.length === length && onComplete) {
            onComplete(newOTPString);
        }
    };

    const handleKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Backspace" && !value[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData
            .getData("text")
            .replace(/[^0-9]/g, "");
        const newValue = pastedData.slice(0, length);
        onChange(newValue);

        // Focus last filled input
        const nextIndex = Math.min(newValue.length, length - 1);
        inputRefs.current[nextIndex]?.focus();

        if (newValue.length === length && onComplete) {
            onComplete(newValue);
        }
    };

    const handleResend = () => {
        if (countdown === 0 && onResend) {
            onResend();
            setCountdown(resendInterval);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                {Array.from({ length }).map((_, index) => (
                    <input
                        key={index}
                        ref={(el) => {
                            inputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={value[index] || ""}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        disabled={disabled}
                        className={cn(
                            "rounded-lg border-2 text-center font-semibold transition-all duration-200",
                            "focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                            value[index]
                                ? "border-brand-500 bg-brand-50 dark:border-brand-400 dark:bg-brand-900/20"
                                : "border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800",
                            "text-gray-900 dark:text-gray-100",
                            sizeClasses[size]
                        )}
                    />
                ))}
            </div>

            {resendable && (
                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={countdown > 0 || disabled}
                        className={cn(
                            "text-sm font-medium transition-colors",
                            countdown > 0 || disabled
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                        )}
                    >
                        {countdown > 0
                            ? `Resend in ${countdown}s`
                            : "Resend Code"}
                    </button>
                </div>
            )}
        </div>
    );
};
