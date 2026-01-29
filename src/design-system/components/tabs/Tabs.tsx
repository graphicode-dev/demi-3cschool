/**
 * Tabs Component
 *
 * A flexible, compound component for tab navigation following SOLID principles.
 *
 * @example
 * ```tsx
 * <Tabs value={activeTab} onChange={setActiveTab}>
 *     <Tabs.Item value="videos" label="Videos" icon={<VideoIcon />} />
 *     <Tabs.Item value="quizzes" label="Quizzes" />
 *     <Tabs.Item value="assignments" label="Assignments" />
 * </Tabs>
 * ```
 */

import { TabsContext, useTabsContext } from "../../hooks";
import type {
    TabsProps,
    TabItemProps,
    TabsContextValue,
    TabsVariant,
    TabsSize,
    TabPanelProps,
    TabContentProps,
} from "./types";

// ============================================================================
// Style Utilities
// ============================================================================

const getContainerStyles = (variant: TabsVariant): string => {
    const base = "flex items-center";

    const variants: Record<TabsVariant, string> = {
        underline: "gap-6 border-b border-gray-200 dark:border-gray-700",
        pills: "gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg",
        bordered: "gap-2",
    };

    return `${base} ${variants[variant]}`;
};

const getItemStyles = (
    variant: TabsVariant,
    size: TabsSize,
    isActive: boolean,
    disabled: boolean,
    fullWidth: boolean,
    isLocked: boolean
): string => {
    const base =
        "font-medium transition-colors relative flex items-center justify-center gap-2";

    const sizes: Record<TabsSize, string> = {
        sm: "text-xs px-3 py-1.5",
        md: "text-sm px-4 py-2",
        lg: "text-base px-5 py-2.5",
    };

    const variants: Record<TabsVariant, { active: string; inactive: string }> =
        {
            underline: {
                active: "text-brand-500 pb-3",
                inactive:
                    "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 pb-3",
            },
            pills: {
                active: "bg-white dark:bg-gray-700 text-brand-500 rounded-md shadow-sm",
                inactive:
                    "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-md",
            },
            bordered: {
                active: "bg-brand-50 dark:bg-brand-900/20 text-brand-500 border border-brand-200 dark:border-brand-800 rounded-lg",
                inactive:
                    "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 rounded-lg",
            },
        };

    const isDisabled = disabled || isLocked;
    const disabledStyles = isDisabled
        ? "opacity-50 cursor-not-allowed pointer-events-none"
        : "cursor-pointer";

    const widthStyles = fullWidth ? "flex-1" : "";

    const variantStyles = isActive
        ? variants[variant].active
        : variants[variant].inactive;

    return `${base} ${sizes[size]} ${variantStyles} ${disabledStyles} ${widthStyles}`;
};

// ============================================================================
// Tab Item Component
// ============================================================================

function TabItem({
    value,
    label,
    icon,
    disabled = false,
    className = "",
}: TabItemProps) {
    const { activeTab, onChange, variant, size, fullWidth, isLocked } =
        useTabsContext();
    const isActive = activeTab === value;

    const handleClick = () => {
        if (!disabled && !isLocked) {
            onChange(value);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.key === "Enter" || e.key === " ") && !disabled && !isLocked) {
            e.preventDefault();
            onChange(value);
        }
    };

    return (
        <button
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-disabled={disabled || isLocked}
            tabIndex={disabled || isLocked ? -1 : 0}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className={`${getItemStyles(variant, size, isActive, disabled, fullWidth, isLocked)} ${className}`}
        >
            {icon && <span className="shrink-0">{icon}</span>}
            <span>{label}</span>
            {variant === "underline" && isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500" />
            )}
        </button>
    );
}

// ============================================================================
// Tab Panel Component (individual content panel)
// ============================================================================

function TabPanel({
    value,
    children,
    className = "",
    keepMounted = false,
}: TabPanelProps) {
    const { activeTab } = useTabsContext();
    const isActive = activeTab === value;

    if (!isActive && !keepMounted) {
        return null;
    }

    return (
        <div
            role="tabpanel"
            aria-hidden={!isActive}
            className={className}
            style={!isActive && keepMounted ? { display: "none" } : undefined}
        >
            {children}
        </div>
    );
}

// ============================================================================
// Tab Content Component (container for panels)
// ============================================================================

function TabContent({ children, className = "" }: TabContentProps) {
    return <div className={className}>{children}</div>;
}

// ============================================================================
// Tabs List Component (container for tab items)
// ============================================================================

function TabList({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const { variant } = useTabsContext();

    return (
        <div
            role="tablist"
            className={`${getContainerStyles(variant)} ${className}`}
        >
            {children}
        </div>
    );
}

// ============================================================================
// Tabs Container Component
// ============================================================================

function TabsRoot({
    value,
    onChange,
    children,
    variant = "underline",
    size = "md",
    fullWidth = false,
    className = "",
    testId,
    mode = "default",
    tabOrder = [],
    canProceed,
    onSubmit,
    isSubmitting = false,
    wizardLabels = {},
}: TabsProps) {
    const isLocked = mode === "wizard";
    const currentIndex = tabOrder.indexOf(value);
    const isFirstStep = currentIndex === 0;
    const isLastStep = currentIndex === tabOrder.length - 1;
    const canGoNext = canProceed ? canProceed(value) : true;

    const handleNext = () => {
        if (currentIndex < tabOrder.length - 1 && canGoNext) {
            onChange(tabOrder[currentIndex + 1]);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            onChange(tabOrder[currentIndex - 1]);
        }
    };

    const contextValue: TabsContextValue = {
        activeTab: value,
        onChange,
        variant,
        size,
        fullWidth,
        mode,
        isLocked,
    };

    const {
        next: nextLabel = "Next",
        previous: previousLabel = "Previous",
        submit: submitLabel = "Submit",
    } = wizardLabels;

    return (
        <TabsContext.Provider value={contextValue}>
            <div className={className} data-testid={testId}>
                {children}

                {mode === "wizard" && tabOrder.length > 0 && (
                    <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={handlePrevious}
                            disabled={isFirstStep}
                            className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                                isFirstStep
                                    ? "text-gray-400 bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700"
                            }`}
                        >
                            {previousLabel}
                        </button>

                        {isLastStep ? (
                            <button
                                type="button"
                                onClick={onSubmit}
                                disabled={!canGoNext || isSubmitting}
                                className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                                    !canGoNext || isSubmitting
                                        ? "bg-brand-300 text-white cursor-not-allowed"
                                        : "bg-brand-500 text-white hover:bg-brand-600"
                                }`}
                            >
                                {isSubmitting ? "Loading..." : submitLabel}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleNext}
                                disabled={!canGoNext}
                                className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                                    !canGoNext
                                        ? "bg-brand-300 text-white cursor-not-allowed"
                                        : "bg-brand-500 text-white hover:bg-brand-600"
                                }`}
                            >
                                {nextLabel}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </TabsContext.Provider>
    );
}

// ============================================================================
// Compound Component Export
// ============================================================================

export const Tabs = Object.assign(TabsRoot, {
    Item: TabItem,
    List: TabList,
    Content: TabContent,
    Panel: TabPanel,
});

export default Tabs;
