// Metadata types for dynamic search, filter, and sort functionality

export type FieldType = "text" | "select" | "date" | "number" | "boolean";

export type FilterOperator =
    | "="
    | "!="
    | "<>"
    | ">"
    | "<"
    | ">="
    | "<="
    | "like"
    | "notLike"
    | "in"
    | "notIn"
    | "between"
    | "notBetween"
    | "isNull"
    | "isNotNull";

export interface FilterMetadata {
    column: string;
    label: string;
    type: FieldType;
    operators: FilterOperator[];
    searchable: boolean;
    options?: string[] | number[]; // For select type
}

export interface SearchMetadata {
    column: string;
    label: string;
    type: FieldType;
    weight: number; // Priority/relevance weight for search
}

export interface SortMetadata {
    column: string;
    label: string;
    defaultDirection: "asc" | "desc";
}

export interface FieldTypeMetadata {
    label: string;
    component: string;
    validation: string;
}

export interface TableMetadata {
    filters: FilterMetadata[];
    searches: SearchMetadata[];
    sorts: SortMetadata[];
    operators: Record<FilterOperator, string>;
    fieldTypes: Record<FieldType, FieldTypeMetadata>;
}

export interface MetadataResponse {
    success: boolean;
    message: string;
    data: TableMetadata;
}

// Active filter state
export interface ActiveFilter {
    id: string; // Unique identifier for this filter instance
    column: string;
    operator: FilterOperator;
    value: string | number | boolean | (string | number)[];
    label?: string; // Display label
}

// Search query state
export interface SearchQuery {
    term: string;
    columns?: string[]; // Specific columns to search, if empty search all searchable columns
}

// Sort state
export interface SortState {
    column: string;
    direction: "asc" | "desc";
}

// Combined query parameters for API
export interface TableQueryParams {
    page?: number;
    perPage?: number;
    search?: string;
    searchColumns?: string[];
    filters?: ActiveFilter[];
    sort?: SortState;
}
