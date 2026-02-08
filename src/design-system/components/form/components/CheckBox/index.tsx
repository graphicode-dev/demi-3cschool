// src/components/CheckBox/index.tsx
import { CheckBoxProps } from "./types";
import { cn } from "../../utils/cn";
import { Check } from "lucide-react";

export const FormCheckBox = ({
    checked,
    onChange,
    label,
    disabled = false,
    className,
    checkedIcon,
    uncheckedIcon,
    size = "md",
    variant = "default",
}: CheckBoxProps) => {
    const sizeClasses = {
        xs: "h-3 w-3",
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
        xl: "h-7 w-7",
    };

    const iconSizeClasses = {
        xs: "h-2 w-2",
        sm: "h-3 w-3",
        md: "h-4 w-4",
        lg: "h-5 w-5",
        xl: "h-6 w-6",
    };

    const labelSizeClasses = {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
    };

    const variantClasses = {
        default: {
            checked:
                "bg-brand-600 border-brand-600 dark:bg-brand-500 dark:border-brand-500",
            unchecked:
                "bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-700",
        },
        outlined: {
            checked:
                "bg-transparent border-2 border-brand-600 dark:border-brand-500",
            unchecked:
                "bg-transparent border-2 border-gray-300 dark:border-gray-700",
        },
        filled: {
            checked:
                "bg-brand-600 border-brand-600 dark:bg-brand-500 dark:border-brand-500",
            unchecked:
                "bg-gray-100 border-gray-100 dark:bg-gray-800 dark:border-gray-800",
        },
    };

    const getCheckIconColor = () => {
        if (variant === "outlined") {
            return "text-brand-600 dark:text-brand-500";
        }
        return "text-white";
    };

    return (
        <label
            className={cn(
                "inline-flex items-center gap-2 cursor-pointer",
                disabled && "cursor-not-allowed opacity-50",
                className
            )}
        >
            <div className="relative">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    disabled={disabled}
                    className="sr-only"
                />
                <div
                    className={cn(
                        "rounded border-2 transition-all duration-200",
                        sizeClasses[size],
                        checked
                            ? variantClasses[variant].checked
                            : variantClasses[variant].unchecked,
                        !disabled &&
                            "hover:border-brand-500 dark:hover:border-brand-400",
                        "flex items-center justify-center"
                    )}
                >
                    {checked && (
                        <div
                            className={cn(
                                iconSizeClasses[size],
                                getCheckIconColor()
                            )}
                        >
                            {checkedIcon || <Check className="w-full h-full" />}
                        </div>
                    )}
                    {!checked && uncheckedIcon && (
                        <div
                            className={cn(
                                "text-gray-400",
                                iconSizeClasses[size]
                            )}
                        >
                            {uncheckedIcon}
                        </div>
                    )}
                </div>
            </div>
            {label && (
                <span
                    className={cn(
                        "text-gray-700 dark:text-gray-300",
                        labelSizeClasses[size]
                    )}
                >
                    {label}
                </span>
            )}
        </label>
    );
};
