// src/components/DropdownInput/index.tsx
import { DropdownInputProps } from "./types";
import { cn } from "../../utils/cn";
import { ChevronDown } from "lucide-react";

export const DropdownInput = ({
    value,
    onChange,
    options,
    placeholder = "Select an option",
    disabled = false,
    className,
    size = "md",
    title,
}: DropdownInputProps) => {
    const sizeClasses = {
        xs: "text-xs px-2 py-1 h-7",
        sm: "text-sm px-3 py-1.5 h-9",
        md: "text-base px-4 py-2 h-11",
        lg: "text-lg px-5 py-3 h-13",
        xl: "text-xl px-6 py-4 h-16",
    };

    return (
        <div className="relative">
            <select
                title={title}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={cn(
                    "w-full appearance-none rounded-md border transition-all duration-200",
                    "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                    "border-gray-300 dark:border-gray-700",
                    "focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "pr-10",
                    sizeClasses[size],
                    className
                )}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <ChevronDown
                className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400",
                    size === "xs" && "w-3 h-3",
                    size === "sm" && "w-4 h-4",
                    size === "md" && "w-5 h-5",
                    size === "lg" && "w-6 h-6",
                    size === "xl" && "w-7 h-7"
                )}
            />
        </div>
    );
};
