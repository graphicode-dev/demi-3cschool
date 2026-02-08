import React, { useState, useEffect } from "react";
import { useToast } from "@/design-system";
import { AlertTriangle, X } from "lucide-react";

interface AlertToastProps {
    id: string;
    title?: string;
    message: string;
    onClose: () => void;
    buttons: {
        text: string;
        onClick?: () => void;
        variant?: "primary" | "secondary" | "danger";
        handlerId?: string;
    }[];
}

const AlertToast: React.FC<AlertToastProps> = ({
    title = "Confirm Action",
    message,
    onClose,
    buttons,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const { getButtonHandler } = useToast();

    useEffect(() => {
        // Fade in animation
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [onClose]);

    const handleButtonClick = (button: AlertToastProps["buttons"][0]) => {
        if (button.handlerId) {
            const handler = getButtonHandler(button.handlerId);

            if (handler) {
                try {
                    handler();
                } catch (error) {
                    console.error(
                        "AlertToast: Error executing handler:",
                        error
                    );
                }
            } else {
                console.error(
                    `AlertToast: No handler found for ID: ${button.handlerId}`
                );
            }
        } else if (button.onClick) {
            try {
                button.onClick();
            } catch (error) {
                console.error(
                    "AlertToast: Error executing direct onClick:",
                    error
                );
            }
        }

        onClose();
    };

    return (
        <>
            {/* Overlay behind the alert */}
            <div
                className={`fixed inset-0 z-99999 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300 ${
                    isVisible ? "opacity-100" : "opacity-0"
                }`}
                onClick={onClose}
            />

            {/* Alert box above the overlay */}
            <div
                className={`fixed z-99999 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl p-6 bg-white dark:bg-gray-800 shadow-theme-xl border border-gray-200 dark:border-gray-800 transition-all duration-300 ease-out ${
                    isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-white/5 dark:hover:text-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Icon */}
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error-50 dark:bg-error-500/15 ring-8 ring-error-50/50 dark:ring-error-500/10">
                    <AlertTriangle className="h-7 w-7 text-error-500 dark:text-error-400" />
                </div>

                {/* Content */}
                <div className="text-center">
                    {title && (
                        <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                            {title}
                        </h3>
                    )}
                    {message && (
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                            {message}
                        </p>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-center gap-3">
                    {buttons.map((button, index) => {
                        const buttonVariant = button.variant || "primary";
                        let buttonClasses =
                            "px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900";

                        switch (buttonVariant) {
                            case "primary":
                                buttonClasses +=
                                    " bg-brand-500 text-white hover:bg-brand-600 shadow-theme-xs hover:shadow-theme-sm focus:ring-brand-500/50";
                                break;
                            case "secondary":
                                buttonClasses +=
                                    " border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 focus:ring-gray-300 dark:focus:ring-gray-600";
                                break;
                            case "danger":
                                buttonClasses +=
                                    " bg-error-500 text-white hover:bg-error-600 shadow-theme-xs hover:shadow-theme-sm focus:ring-error-500/50";
                                break;
                        }

                        return (
                            <button
                                key={index}
                                className={buttonClasses}
                                onClick={() => handleButtonClick(button)}
                                type="button"
                            >
                                {button.text}
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default AlertToast;
