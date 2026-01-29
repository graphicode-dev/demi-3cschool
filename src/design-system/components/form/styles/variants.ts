// src/styles/variants.ts
import { cva, type VariantProps } from "class-variance-authority";

/**
 * Input variants with responsive support
 * Supports Tailwind's responsive prefixes (sm:, md:, lg:, xl:, 2xl:)
 */
export const inputVariants = cva(
    // Base classes
    "w-full transition-all duration-200 outline-none disabled:cursor-not-allowed disabled:opacity-50 font-sans",
    {
        variants: {
            variant: {
                default:
                    "border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500",
                filled: "border-0 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700",
                outlined:
                    "border-2 bg-transparent text-gray-900 dark:text-gray-100",
                ghost: "border-0 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-900 dark:text-gray-100",
                soft: "border-0 bg-brand-50 dark:bg-brand-900/20 text-brand-900 dark:text-brand-100",
            },
            size: {
                xs: "text-xs px-2 py-1 h-7",
                sm: "text-sm px-3 py-1.5 h-9",
                md: "text-base px-4 py-2 h-11",
                lg: "text-lg px-5 py-3 h-13",
                xl: "text-xl px-6 py-4 h-16",
            },
            radius: {
                none: "rounded-none",
                sm: "rounded-sm",
                md: "rounded-md",
                lg: "rounded-lg",
                xl: "rounded-xl",
                "2xl": "rounded-2xl",
                full: "rounded-full",
            },
            status: {
                default:
                    "border-gray-300 dark:border-gray-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20",
                error: "border-error-500 dark:border-error-400 focus:border-error-500 focus:ring-2 focus:ring-error-500/20 text-error-900 dark:text-error-100",
                success:
                    "border-success-500 dark:border-success-400 focus:border-success-500 focus:ring-2 focus:ring-success-500/20 text-success-900 dark:text-success-100",
                warning:
                    "border-warning-500 dark:border-warning-400 focus:border-warning-500 focus:ring-2 focus:ring-warning-500/20 text-warning-900 dark:text-warning-100",
            },
            fullWidth: {
                true: "w-full",
                false: "w-auto",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
            radius: "md",
            status: "default",
            fullWidth: true,
        },
    }
);

export const labelVariants = cva("font-medium transition-colors duration-200", {
    variants: {
        size: {
            xs: "text-xs mb-1",
            sm: "text-sm mb-1.5",
            md: "text-sm mb-2",
            lg: "text-base mb-2",
            xl: "text-lg mb-2.5",
        },
        status: {
            default: "text-gray-700 dark:text-gray-300",
            error: "text-error-600 dark:text-error-400",
            success: "text-success-600 dark:text-success-400",
            warning: "text-warning-600 dark:text-warning-400",
        },
        required: {
            true: "after:content-['*'] after:ml-0.5 after:text-error-500",
            false: "",
        },
    },
    defaultVariants: {
        size: "md",
        status: "default",
        required: false,
    },
});

export const helperTextVariants = cva(
    "text-sm mt-1.5 transition-colors duration-200",
    {
        variants: {
            status: {
                default: "text-gray-500 dark:text-gray-400",
                error: "text-red-600 dark:text-red-400",
                success: "text-green-600 dark:text-green-400",
                warning: "text-yellow-600 dark:text-yellow-400",
            },
        },
        defaultVariants: {
            status: "default",
        },
    }
);

export const buttonVariants = cva(
    "inline-flex items-center justify-center font-medium transition-all duration-200 outline-none disabled:cursor-not-allowed disabled:opacity-50",
    {
        variants: {
            variant: {
                primary:
                    "bg-brand-600 text-white hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600",
                secondary:
                    "bg-gray-600 text-white hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600",
                outline:
                    "border-2 border-brand-600 text-brand-600 hover:bg-brand-50 dark:border-brand-400 dark:text-brand-400 dark:hover:bg-brand-900/20",
                ghost: "text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-900/20",
                danger: "bg-error-600 text-white hover:bg-error-700 dark:bg-error-500 dark:hover:bg-error-600",
            },
            size: {
                xs: "text-xs px-2.5 py-1.5 h-7",
                sm: "text-sm px-3 py-2 h-9",
                md: "text-base px-4 py-2.5 h-11",
                lg: "text-lg px-6 py-3 h-13",
                xl: "text-xl px-8 py-4 h-16",
            },
            radius: {
                none: "rounded-none",
                sm: "rounded-sm",
                md: "rounded-md",
                lg: "rounded-lg",
                xl: "rounded-xl",
                "2xl": "rounded-2xl",
                full: "rounded-full",
            },
            fullWidth: {
                true: "w-full",
                false: "w-auto",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
            radius: "md",
            fullWidth: false,
        },
    }
);

// Export types
export type InputVariants = VariantProps<typeof inputVariants>;
export type LabelVariants = VariantProps<typeof labelVariants>;
export type HelperTextVariants = VariantProps<typeof helperTextVariants>;
export type ButtonVariants = VariantProps<typeof buttonVariants>;

// Preset combinations for quick styling
export const inputPresets = {
    modern: {
        variant: "filled" as const,
        radius: "lg" as const,
        size: "lg" as const,
    },
    minimal: {
        variant: "ghost" as const,
        radius: "none" as const,
        size: "md" as const,
    },
    classic: {
        variant: "outlined" as const,
        radius: "sm" as const,
        size: "md" as const,
    },
    rounded: {
        variant: "default" as const,
        radius: "full" as const,
        size: "md" as const,
    },
    soft: {
        variant: "soft" as const,
        radius: "xl" as const,
        size: "md" as const,
    },
} as const;

export type InputPreset = keyof typeof inputPresets;
