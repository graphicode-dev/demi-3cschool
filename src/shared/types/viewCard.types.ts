// ViewCard types

// Field item in a section
export interface ViewCardFieldItem {
    label: string;
    value: string | number | null | React.ReactNode | undefined;
    colSpan?: number; // Number of columns this field should span (default: 1)
    type?: "file" | "image";
}

// Row structure for ViewCard
export interface ViewCardRow {
    mainTitle?: string;
    title?: string;
    fields?: ViewCardFieldItem[];
    customRender?: () => React.ReactNode; // Optional custom render function
}

// Generic data structure for ViewCard
export interface ViewCardData {
    rows: ViewCardRow[];
}

// Variant type
export type ViewCardVariant = "user" | "vessel" | "tabs" | "default";

// Props for the ViewCard component
export interface ViewCardProps {
    headerTitle?: string;
    hideHeaderTitle?: boolean;
    title?: string;
    subtitle?: string;
    variant?: ViewCardVariant;
    image?: string;
    data?: ViewCardData;
    buttons?: boolean;
    ticketButton?: boolean;
    hideBorder?: boolean;
    tabs?: ViewCardTabItem[];
    gridCols?: number; // Number of columns for the grid layout (1-6)
    onEdit?: () => void;
    onDelete?: () => void;
    onTicket?: () => void;

    customButtonLabel?: string;
    onCustomButton?: (() => void) | (() => React.ReactNode);
}

// Props for the ViewCardSection component
export interface ViewCardSectionProps {
    label?: string;
    children: React.ReactNode;
}

// Props for the ViewCardField component
export interface ViewCardFieldProps {
    label: string;
    value?: string | number | React.ReactNode | null;
    type?: "file" | "image";
}

// Props for the ViewCardButtons component
export interface ViewCardButtonsProps {
    customButtonLabel?: string;
    ticketButton?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onTicket?: () => void;
    onCustomButton?: (() => void) | (() => React.ReactNode);
}

export interface ViewCardHeaderProps {
    headerTitle?: string;
    hideHeaderTitle?: boolean;
    buttons?: boolean;
    ticketButton?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onTicket?: () => void;

    customButtonLabel?: string;
    onCustomButton?: (() => void) | (() => React.ReactNode);
}

export interface ViewCardTabItem {
    label: string;
    value: string;
    buttonLabel?: string;
    buttonHref?: string;
    entity?: string | string[];
    role?: string | string[];
    children: React.ReactNode;
    buttons?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onTicket?: () => void;

    customButtonLabel?: string;
    onCustomButton?: (() => void) | (() => React.ReactNode);
}
