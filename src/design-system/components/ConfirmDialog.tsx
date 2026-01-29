/**
 * ConfirmDialog Component
 *
 * A reusable confirmation dialog for actions like delete, submit, etc.
 * Supports customizable title, message, icon, and buttons.
 */

import { useState, useEffect, type ReactNode } from "react";
import { AlertTriangle, X, Info, CheckCircle, HelpCircle } from "lucide-react";

type DialogVariant = "danger" | "warning" | "info" | "success" | "question";

interface ConfirmDialogButton {
    text: string;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "danger";
    loading?: boolean;
    disabled?: boolean;
}

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message: ReactNode;
    variant?: DialogVariant;
    icon?: ReactNode;
    buttons?: ConfirmDialogButton[];
    confirmText?: string;
    cancelText?: string;
    onConfirm?: (...params: any) => void | Promise<void>;
    onCancel?: () => void;
    loading?: boolean;
}

const variantConfig: Record<
    DialogVariant,
    {
        icon: ReactNode;
        iconBgClass: string;
        iconRingClass: string;
        iconColorClass: string;
    }
> = {
    danger: {
        icon: <AlertTriangle className="h-7 w-7" />,
        iconBgClass: "bg-error-50 dark:bg-error-500/15",
        iconRingClass: "ring-error-50/50 dark:ring-error-500/10",
        iconColorClass: "text-error-500 dark:text-error-400",
    },
    warning: {
        icon: <AlertTriangle className="h-7 w-7" />,
        iconBgClass: "bg-warning-50 dark:bg-warning-500/15",
        iconRingClass: "ring-warning-50/50 dark:ring-warning-500/10",
        iconColorClass: "text-warning-500 dark:text-warning-400",
    },
    info: {
        icon: <Info className="h-7 w-7" />,
        iconBgClass: "bg-brand-50 dark:bg-brand-500/15",
        iconRingClass: "ring-brand-50/50 dark:ring-brand-500/10",
        iconColorClass: "text-brand-500 dark:text-brand-400",
    },
    success: {
        icon: <CheckCircle className="h-7 w-7" />,
        iconBgClass: "bg-success-50 dark:bg-success-500/15",
        iconRingClass: "ring-success-50/50 dark:ring-success-500/10",
        iconColorClass: "text-success-500 dark:text-success-400",
    },
    question: {
        icon: <HelpCircle className="h-7 w-7" />,
        iconBgClass: "bg-gray-100 dark:bg-gray-700",
        iconRingClass: "ring-gray-100/50 dark:ring-gray-700/50",
        iconColorClass: "text-gray-500 dark:text-gray-400",
    },
};

const buttonVariantClasses: Record<string, string> = {
    primary:
        "bg-brand-500 text-white hover:bg-brand-600 shadow-theme-xs hover:shadow-theme-sm focus:ring-brand-500/50",
    secondary:
        "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 focus:ring-gray-300 dark:focus:ring-gray-600",
    danger: "bg-error-500 text-white hover:bg-error-600 shadow-theme-xs hover:shadow-theme-sm focus:ring-error-500/50",
};

export function ConfirmDialog({
    isOpen,
    onClose,
    title,
    message,
    variant = "danger",
    icon,
    buttons,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
    loading = false,
}: ConfirmDialogProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => setIsVisible(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onCancel?.();
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose, onCancel]);

    if (!isOpen) return null;

    const config = variantConfig[variant];
    const displayIcon = icon ?? config.icon;

    const handleConfirm = async () => {
        if (onConfirm) {
            await onConfirm();
        }
        onClose();
    };

    const handleCancel = () => {
        onCancel?.();
        onClose();
    };

    const defaultButtons: ConfirmDialogButton[] = [
        {
            text: cancelText ?? "Cancel",
            variant: "secondary",
            onClick: handleCancel,
        },
        {
            text: confirmText ?? "Confirm",
            variant: variant === "danger" ? "danger" : "primary",
            onClick: handleConfirm,
            loading,
        },
    ];

    const displayButtons = buttons ?? defaultButtons;

    return (
        <>
            <div
                className={`h-screen fixed inset-0 z-99999 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300 ${
                    isVisible ? "opacity-100" : "opacity-0"
                }`}
                onClick={handleCancel}
            />

            <div
                className={`fixed z-99999 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl p-6 bg-white dark:bg-gray-800 shadow-theme-xl border border-gray-200 dark:border-gray-800 transition-all duration-300 ease-out ${
                    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={handleCancel}
                    className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-white/5 dark:hover:text-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                >
                    <X className="h-5 w-5" />
                </button>

                <div
                    className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${config.iconBgClass} ring-8 ${config.iconRingClass}`}
                >
                    <span className={config.iconColorClass}>{displayIcon}</span>
                </div>

                <div className="text-center">
                    {title && (
                        <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                            {title}
                        </h3>
                    )}
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="flex items-center justify-center gap-3">
                    {displayButtons.map((button, index) => {
                        const variantClass =
                            buttonVariantClasses[button.variant ?? "primary"];

                        return (
                            <button
                                key={index}
                                type="button"
                                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${variantClass} ${
                                    button.disabled || button.loading
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }`}
                                onClick={button.onClick}
                                disabled={button.disabled || button.loading}
                            >
                                {button.loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg
                                            className="animate-spin h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        {button.text}
                                    </span>
                                ) : (
                                    button.text
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export type { ConfirmDialogProps, ConfirmDialogButton, DialogVariant };
export default ConfirmDialog;
