import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
    {
        variants: {
            variant: {
                default:
                    "bg-brand-500 text-white hover:bg-brand-600 shadow-sm hover:shadow-md",
                destructive:
                    "bg-error-500 text-white hover:bg-error-600 shadow-sm hover:shadow-md",
                outline:
                    "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700",
                secondary:
                    "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700",
                ghost: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                link: "underline-offset-4 hover:underline text-brand-500 dark:text-brand-400",
                success:
                    "bg-success-500 text-white hover:bg-success-600 shadow-sm hover:shadow-md",
                warning:
                    "bg-warning-500 text-white hover:bg-warning-600 shadow-sm hover:shadow-md",
            },
            size: {
                default: "h-10 py-2.5 px-4",
                sm: "h-9 px-3 text-xs",
                lg: "h-12 px-6 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    isDisabled?: boolean;
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        { className, variant, size, isDisabled, isLoading, children, ...props },
        ref
    ) => {
        return (
            <button
                className={cn(
                    buttonVariants({ variant, size }),
                    className,
                    isDisabled && "opacity-50"
                )}
                ref={ref}
                disabled={isDisabled || isLoading}
                {...props}
            >
                {isLoading && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                )}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
