import { type FC } from "react";

interface CheckBoxProps {
    checked: boolean;
    onChange: () => void;
    className?: string;
    placeHolder?: string;
    disabled?: boolean;
    classnames?: {
        container?: string;
        checkbox?: string;
        active?: string;
        inactive?: string;
        checkedIcon?: string;
        placeHolder?: string;
    };
}

export const CheckBox: FC<CheckBoxProps> = ({
    checked,
    onChange,
    className = "",
    placeHolder,
    disabled = false,
    classnames,
}: CheckBoxProps) => {
    return (
        <div
            className={`w-fit flex items-center gap-2 ${classnames?.container}`}
        >
            <div
                className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all duration-200 ${
                    disabled
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer hover:shadow-sm"
                } ${
                    checked
                        ? `border-brand-500 bg-brand-500 ${classnames?.active}`
                        : `border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800 hover:border-brand-400 dark:hover:border-brand-500 ${classnames?.inactive}`
                } ${className} ${classnames?.checkbox}`}
                onClick={disabled ? undefined : onChange}
                role="checkbox"
                aria-checked={checked}
                aria-disabled={disabled}
                aria-label={placeHolder}
                title={placeHolder}
                tabIndex={disabled ? -1 : 0}
                onKeyDown={(e) => {
                    if (!disabled && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        onChange();
                    }
                }}
            >
                {checked && (
                    <svg
                        className={`w-3 h-3 text-white ${classnames?.checkedIcon}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                )}
            </div>

            {placeHolder && (
                <p
                    className={`text-sm text-gray-700 dark:text-gray-300 select-none ${
                        disabled ? "opacity-50" : ""
                    } ${classnames?.placeHolder}`}
                >
                    {placeHolder}
                </p>
            )}
        </div>
    );
};
