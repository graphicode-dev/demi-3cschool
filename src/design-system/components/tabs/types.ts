/**
 * Tabs Component - Type Definitions
 */

import type { ReactNode } from "react";

export type TabsVariant = "underline" | "pills" | "bordered";
export type TabsSize = "sm" | "md" | "lg";
export type TabsMode = "default" | "wizard";

export interface TabItemProps {
    /** Unique key for the tab */
    value: string;
    /** Tab label - can be string or ReactNode */
    label: ReactNode;
    /** Optional icon */
    icon?: ReactNode;
    /** Disabled state */
    disabled?: boolean;
    /** Additional class name */
    className?: string;
}

export interface TabsProps {
    /** Currently active tab value */
    value: string;
    /** Callback when tab changes */
    onChange: (value: string) => void;
    /** Tab items as children */
    children: ReactNode;
    /** Visual variant */
    variant?: TabsVariant;
    /** Size variant */
    size?: TabsSize;
    /** Full width tabs */
    fullWidth?: boolean;
    /** Additional class name for container */
    className?: string;
    /** Test ID for testing */
    testId?: string;
    /** Mode: default allows clicking tabs, wizard locks navigation to next/prev buttons */
    mode?: TabsMode;
    /** Ordered list of tab values for wizard mode navigation */
    tabOrder?: string[];
    /** Validation function for wizard mode - returns true if current step is valid */
    canProceed?: (currentTab: string) => boolean;
    /** Callback when submit is clicked on the last step (wizard mode only) */
    onSubmit?: () => void;
    /** Whether submit is loading (wizard mode only) */
    isSubmitting?: boolean;
    /** Custom labels for wizard navigation buttons */
    wizardLabels?: {
        next?: string;
        previous?: string;
        submit?: string;
    };
}

export interface TabsContextValue {
    activeTab: string;
    onChange: (value: string) => void;
    variant: TabsVariant;
    size: TabsSize;
    fullWidth: boolean;
    mode: TabsMode;
    isLocked: boolean;
}

export interface TabPanelProps {
    /** Value that matches the tab this panel belongs to */
    value: string;
    /** Content to render when this tab is active */
    children: ReactNode;
    /** Additional class name */
    className?: string;
    /** Keep panel mounted when inactive (for preserving state) */
    keepMounted?: boolean;
}

export interface TabContentProps {
    /** Tab panels as children */
    children: ReactNode;
    /** Additional class name */
    className?: string;
}
