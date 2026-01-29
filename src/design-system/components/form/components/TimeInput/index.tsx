// src/components/TimeInput/index.tsx
import { TimeInputProps } from "./types";
import { cn } from "../../utils/cn";
import { Clock } from "lucide-react";

export const TimeInput = ({
    value,
    onChange,
    placeholder = "Select time",
    disabled = false,
    className,
    size = "md",
    min,
    max,
    step,
}: TimeInputProps) => {
    const sizeClasses = {
        xs: "text-xs px-2 py-1 h-7",
        sm: "text-sm px-3 py-1.5 h-9",
        md: "text-base px-4 py-2 h-11",
        lg: "text-lg px-5 py-3 h-13",
        xl: "text-xl px-6 py-4 h-16",
    };

    const iconSizeClasses = {
        xs: "w-3 h-3",
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
        xl: "w-7 h-7",
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);
    };

    return (
        <div className="relative">
            <input
                type="time"
                value={value || ""}
                onChange={handleChange}
                disabled={disabled}
                placeholder={placeholder}
                min={min}
                max={max}
                step={step}
                className={cn(
                    "w-full rounded-md border transition-all duration-200",
                    "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                    "border-gray-300 dark:border-gray-700",
                    "focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "pr-10",
                    sizeClasses[size],
                    className
                )}
            />
            <Clock
                className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400",
                    iconSizeClasses[size]
                )}
            />
        </div>
    );
};
