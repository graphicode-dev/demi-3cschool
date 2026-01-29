import { ReactNode, useEffect, useRef, useState } from "react";

const DefaultTriggerIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
    </svg>
);

export interface DropdownAction {
    id: string;
    label: string;
    onClick: (itemId: string) => void;
    icon?: ReactNode;
    className?: string;
    divider?: boolean;
    disabled?: boolean;
}

export interface DropdownProps {
    itemId: string;
    actions: DropdownAction[];
    triggerIcon?: ReactNode;
    triggerLabel?: string;
    triggerClassName?: string;
    menuClassName?: string;
    direction?: "auto" | "top" | "bottom";
    width?: "w-40" | "w-48" | "w-56" | "w-64" | string;
    alignment?: "left" | "right" | "center";
}

const ActionsDropdown: React.FC<DropdownProps> = ({
    itemId,
    actions,
    triggerIcon,
    triggerLabel,
    triggerClassName = "p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded",
    menuClassName = "",
    direction = "auto",
    width = "w-48",
    alignment = "right",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showAbove, setShowAbove] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const menuHeight = Math.min(actions.length * 40 + 16, 400);
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;

            if (direction === "auto") {
                setShowAbove(
                    spaceBelow < menuHeight && spaceAbove > menuHeight
                );
            } else {
                setShowAbove(direction === "top");
            }
        }
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                buttonRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const getAlignmentClass = () => {
        switch (alignment) {
            case "left":
                return "-left-[80%]";
            case "center":
                return "-translate-x-1/2";
            default:
                return "right-5";
        }
    };

    const getPositionClass = () => {
        return showAbove ? "bottom-full mb-2" : "-top-5";
    };

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={toggleDropdown}
                className={triggerClassName}
                aria-label={triggerLabel || "Actions"}
                aria-expanded={isOpen}
            >
                {triggerIcon || <DefaultTriggerIcon />}
            </button>

            {isOpen && (
                <div
                    ref={menuRef}
                    className={`absolute ${getAlignmentClass()} ${getPositionClass()}  z-50 ${width} bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 max-h-40 overflow-y-auto ${menuClassName}`}
                >
                    {actions.map((action) => (
                        <div key={action.id}>
                            {action.divider && (
                                <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
                            )}
                            <button
                                onClick={() => {
                                    if (!action.disabled) {
                                        action?.onClick?.(itemId);
                                        setIsOpen(false);
                                    }
                                }}
                                disabled={action.disabled}
                                className={`
                                    w-full text-left px-4 py-2 text-sm
                                    flex items-center gap-2
                                    transition-colors duration-150
                                    ${
                                        action.disabled
                                            ? "opacity-50 cursor-not-allowed"
                                            : "cursor-pointer"
                                    }
                                    ${
                                        action.className ||
                                        "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }
                                `}
                            >
                                {action.icon && (
                                    <span className="w-4 h-4 shrink-0">
                                        {action.icon}
                                    </span>
                                )}
                                <span>{action.label}</span>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActionsDropdown;
