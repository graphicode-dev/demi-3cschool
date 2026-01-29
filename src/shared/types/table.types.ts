export interface TableData {
    id: string;
    avatar?: string;
    columns: Record<string, string | number | boolean>;
    group?: string;
    selected?: boolean;
}

export type ViewMode = "grid" | "cards" | "group";

export interface TableColumn {
    id: string;
    header: string;
    accessorKey: string;
    sortable?: boolean;
    cell?: (props: { row: any }) => React.ReactNode;
}

export interface FilterOption {
    id: string;
    label: string;
    value: string;
}

// Legacy filter operator - deprecated, use metadata.types FilterOperator instead
export type LegacyFilterOperator =
    | "equals"
    | "contains"
    | "startsWith"
    | "endsWith"
    | "greaterThan"
    | "lessThan";

export interface FilterConfig {
    column: string;
    operator: LegacyFilterOperator;
    value: string;
}

export type SortDirection = "asc" | "desc" | null;

export interface SortConfig {
    column: string;
    direction: SortDirection;
}
