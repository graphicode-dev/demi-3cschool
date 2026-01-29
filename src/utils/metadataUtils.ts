import type {
    ActiveFilter,
    SearchQuery,
    SortState,
    TableMetadata,
    FilterMetadata,
    SearchMetadata,
    SortMetadata,
    FilterOperator,
    FieldType,
    FieldTypeMetadata,
} from "@/shared/types";

/**
 * Builds query parameters object for API requests based on metadata-driven filters
 */
export const buildQueryParams = (params: {
    page?: number;
    perPage?: number;
    search?: SearchQuery;
    filters?: ActiveFilter[];
    sort?: SortState;
}): Record<string, any> => {
    const queryParams: Record<string, any> = {};

    // Pagination
    if (params.page !== undefined) {
        queryParams.page = params.page;
    }
    if (params.perPage !== undefined) {
        queryParams.perPage = params.perPage;
    }

    // Search
    if (params.search?.term) {
        queryParams.search = params.search.term;
        if (params.search.columns && params.search.columns.length > 0) {
            queryParams.searchColumns = params.search.columns.join(",");
        }
    }

    // Filters - convert to API format: filter[column][operator] and filter[column][value][]
    // Each filter sends operator and value as a pair
    if (params.filters && params.filters.length > 0) {
        const filtersByColumn: Record<
            string,
            {
                operator: string;
                values: any[];
            }
        > = {};

        params.filters.forEach((filter) => {
            const column = filter.column;

            if (!filtersByColumn[column]) {
                filtersByColumn[column] = {
                    operator: filter.operator,
                    values: [],
                };
            }

            // Collect values
            if (Array.isArray(filter.value)) {
                filtersByColumn[column].values.push(...filter.value);
            } else {
                filtersByColumn[column].values.push(filter.value);
            }
        });

        // Build query params - one operator and one value array per column
        Object.entries(filtersByColumn).forEach(
            ([column, { operator, values }]) => {
                // Deduplicate values
                const uniqueValues = Array.from(new Set(values));

                queryParams[`filter[${column}][operator]`] = operator;
                queryParams[`filter[${column}][value][]`] = uniqueValues;
            }
        );
    }

    // Sort - match backend format: sort[column] and sort[direction]
    if (params.sort) {
        queryParams[`sort[column]`] = params.sort.column;
        queryParams[`sort[direction]`] = params.sort.direction;
    }

    return queryParams;
};

/**
 * Backend metadata field structure
 */
interface BackendMetadataField {
    column: string;
    label: string;
    type: string;
    operators: string[];
    searchable: boolean;
    options?: any[];
}

interface BackendMetadata {
    model: string;
    table: string;
    fields: BackendMetadataField[];
    searchable?: boolean;
    sortable?: boolean;
    filterable?: boolean;
}

/**
 * Transforms backend metadata format to frontend TableMetadata format
 */
export const transformBackendMetadata = (
    backendData: BackendMetadata
): TableMetadata => {
    // Map backend field types to frontend field types
    const typeMap: Record<string, FieldType> = {
        text: "text",
        string: "text",
        uuid: "text",
        select: "select",
        date: "date",
        datetime: "date",
        number: "number",
        integer: "number",
        float: "number",
        decimal: "number",
        boolean: "boolean",
    };

    // Convert fields to filters
    const filters: FilterMetadata[] = backendData.fields
        .filter(() => backendData.filterable !== false) // Include all if filterable is not explicitly false
        .map((field) => {
            const mappedType = typeMap[field.type] || "text";

            // Warn if select field has no options
            if (
                mappedType === "select" &&
                (!field.options || field.options.length === 0)
            ) {
                console.warn(
                    `[Metadata] Select field "${field.column}" (${field.label}) has no options. ` +
                        `Users won't be able to filter by this field. Backend should provide options array.`
                );
            }

            return {
                column: field.column,
                label: field.label,
                type: mappedType,
                operators: field.operators as FilterOperator[],
                searchable: field.searchable,
                options: field.options,
            };
        });

    // Convert searchable fields to searches
    const searches: SearchMetadata[] = backendData.fields
        .filter((field) => field.searchable && backendData.searchable !== false)
        .map((field, index) => ({
            column: field.column,
            label: field.label,
            type: typeMap[field.type] || "text",
            weight: 10 - index, // Higher weight for earlier fields
        }));

    // Convert fields to sorts (typically timestamp and text fields)
    const sorts: SortMetadata[] = backendData.fields
        .filter(
            (field) =>
                backendData.sortable !== false &&
                [
                    "text",
                    "string",
                    "date",
                    "datetime",
                    "number",
                    "integer",
                    "created_at",
                    "updated_at",
                ].includes(field.type)
        )
        .map((field) => ({
            column: field.column,
            label: field.label,
            defaultDirection:
                field.column.includes("created") ||
                field.column.includes("updated")
                    ? ("desc" as const)
                    : ("asc" as const),
        }));

    // Standard operators with labels
    const operators: Record<FilterOperator, string> = {
        "=": "Equals",
        "!=": "Not Equals",
        "<>": "Not Equals",
        ">": "Greater Than",
        "<": "Less Than",
        ">=": "Greater or Equal",
        "<=": "Less or Equal",
        like: "Contains",
        notLike: "Does Not Contain",
        in: "In List",
        notIn: "Not In List",
        between: "Between",
        notBetween: "Not Between",
        isNull: "Is Empty",
        isNotNull: "Is Not Empty",
    };

    // Standard field types
    const fieldTypes: Record<FieldType, FieldTypeMetadata> = {
        text: {
            label: "Text",
            component: "TextInput",
            validation: "string|max:255",
        },
        select: {
            label: "Select",
            component: "SelectInput",
            validation: "string",
        },
        date: {
            label: "Date",
            component: "DateInput",
            validation: "date",
        },
        number: {
            label: "Number",
            component: "NumberInput",
            validation: "numeric",
        },
        boolean: {
            label: "Boolean",
            component: "BooleanInput",
            validation: "boolean",
        },
    };

    return {
        filters,
        searches,
        sorts,
        operators,
        fieldTypes,
    };
};
