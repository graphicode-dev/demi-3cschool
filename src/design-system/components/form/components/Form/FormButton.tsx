import { FormButtonProps, FormButtonGroupProps } from "./types";
import { cn } from "../../utils/cn";
import { getFormConfig, getMergedClassName } from "../../config/formConfig";
import { buttonVariants } from "../../styles/variants";
import {
    resolveResponsiveValue,
    getResponsiveClasses,
} from "../../utils/responsive";

export const FormButton = ({
    config = {},
    action = {},
    layout = "horizontal",
    className,
    noWrapper = false,
}: FormButtonProps) => {
    const globalConfig = getFormConfig();

    const buttonConfig = {
        text: config.text || "Submit",
        variant: config.variant || globalConfig.button?.variant || "primary",
        size: config.size || globalConfig.button?.size || "md",
        radius: config.radius || globalConfig.button?.radius || "md",
        fullWidth: config.fullWidth !== undefined ? config.fullWidth : false,
        disabled: config.disabled || false,
        loading: config.loading || false,
        className: config.className || "",
        color: config.color,
        bgColor: config.bgColor,
        borderColor: config.borderColor,
    };

    const buttonAction = {
        type: action.type || "submit",
        onClick: action.onClick,
        onSubmit: action.onSubmit,
        preventDefault: action.preventDefault || false,
    };

    const handleClick = (e: React.FormEvent) => {
        if (buttonAction.preventDefault) {
            e.preventDefault();
        }

        if (buttonAction.onClick) {
            buttonAction.onClick();
        }

        if (buttonAction.onSubmit) {
            buttonAction.onSubmit();
        }
    };

    const containerClass = cn(
        "flex gap-3 mt-6",
        layout === "vertical" && "flex-col",
        layout === "space-between" && "justify-between",
        layout === "horizontal" && "justify-end",
        className
    );

    const buttonClass = cn(
        buttonVariants({
            variant: buttonConfig.variant,
            size: resolveResponsiveValue(buttonConfig.size, "md"),
            radius: resolveResponsiveValue(buttonConfig.radius, "md"),
            fullWidth: buttonConfig.fullWidth,
        }),
        getResponsiveClasses(buttonConfig.size, ""),
        getMergedClassName("button", buttonConfig.className)
    );

    const buttonStyle = {
        ...(buttonConfig.color && { color: buttonConfig.color }),
        ...(buttonConfig.bgColor && { backgroundColor: buttonConfig.bgColor }),
        ...(buttonConfig.borderColor && {
            borderColor: buttonConfig.borderColor,
        }),
    };

    const buttonElement = (
        <button
            type={buttonAction.type}
            onClick={handleClick}
            disabled={buttonConfig.disabled || buttonConfig.loading}
            className={buttonClass}
            style={buttonStyle}
        >
            {buttonConfig.loading ? (
                <div className="flex items-center gap-2">
                    <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
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
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    <span>Loading...</span>
                </div>
            ) : (
                buttonConfig.text
            )}
        </button>
    );

    // If noWrapper is true, return just the button (for use inside FormButtonGroup)
    if (noWrapper) {
        return buttonElement;
    }

    return <div className={containerClass}>{buttonElement}</div>;
};

// Button group component for multiple buttons in a row
export const FormButtonGroup = ({
    children,
    layout = "horizontal",
    className,
}: FormButtonGroupProps) => {
    const containerClass = cn(
        "flex gap-3 mt-6",
        layout === "vertical" && "flex-col",
        layout === "space-between" && "justify-between",
        layout === "horizontal" && "justify-end",
        className
    );

    return <div className={containerClass}>{children}</div>;
};
