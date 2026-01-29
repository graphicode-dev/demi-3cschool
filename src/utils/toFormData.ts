/**
 * toFormData Utility
 *
 * Converts JavaScript objects to FormData with support for:
 * - Nested objects (flattened with bracket notation)
 * - Arrays (configurable format: brackets[], indices[0], or flat)
 * - Files and Blobs (passed through directly)
 * - Dates (converted to ISO string)
 * - Booleans (converted to "1"/"0" or "true"/"false")
 *
 * @example
 * ```ts
 * // Basic usage
 * const formData = toFormData({
 *     title: "My Report",
 *     attachments: [file1, file2],
 *     meta: { tags: ["urgent", "review"] }
 * });
 *
 * // With options
 * const formData = toFormData(payload, {
 *     arrayFormat: 'indices',  // Use [0], [1] instead of []
 *     booleanFormat: 'string', // Use "true"/"false" instead of "1"/"0"
 * });
 * ```
 */

/**
 * Supported value types for FormData conversion
 */
export type FormDataValue =
    | string
    | number
    | boolean
    | null
    | undefined
    | File
    | Blob
    | FileList
    | Date
    | FormDataValue[]
    | { [key: string]: FormDataValue };

/**
 * Array format options
 * - `brackets`: key[]=value (PHP/Laravel default)
 * - `indices`: key[0]=value (Java/.NET)
 * - `flat`: key=value repeated (some REST APIs)
 */
export type ArrayFormat = "brackets" | "indices" | "flat";

/**
 * Boolean format options
 * - `numeric`: "1" for true, "0" for false (PHP default)
 * - `string`: "true" or "false"
 */
export type BooleanFormat = "numeric" | "string";

/**
 * Date format options
 * - `iso`: ISO 8601 string (default)
 * - `timestamp`: Unix timestamp in milliseconds
 * - `date`: YYYY-MM-DD format
 */
export type DateFormat = "iso" | "timestamp" | "date";

/**
 * Options for toFormData conversion
 */
export interface ToFormDataOptions {
    /**
     * How to format array keys
     * @default 'brackets'
     */
    arrayFormat?: ArrayFormat;

    /**
     * How to format boolean values
     * @default 'numeric'
     */
    booleanFormat?: BooleanFormat;

    /**
     * How to format Date values
     * @default 'iso'
     */
    dateFormat?: DateFormat;

    /**
     * Skip null and undefined values
     * @default true
     */
    skipNull?: boolean;

    /**
     * Skip empty string values
     * @default false
     */
    skipEmpty?: boolean;

    /**
     * Skip empty arrays
     * @default true
     */
    skipEmptyArrays?: boolean;
}

const defaultOptions: Required<ToFormDataOptions> = {
    arrayFormat: "brackets",
    booleanFormat: "numeric",
    dateFormat: "iso",
    skipNull: true,
    skipEmpty: false,
    skipEmptyArrays: true,
};

/**
 * Build the key for nested properties
 */
const buildKey = (
    prefix: string,
    key: string,
    isArrayItem: boolean,
    arrayFormat: ArrayFormat,
    index?: number
): string => {
    if (!prefix) {
        return key;
    }

    if (isArrayItem) {
        switch (arrayFormat) {
            case "indices":
                return `${prefix}[${index}]`;
            case "flat":
                return prefix;
            case "brackets":
            default:
                return `${prefix}[]`;
        }
    }

    return `${prefix}[${key}]`;
};

/**
 * Format a boolean value based on options
 */
const formatBoolean = (value: boolean, format: BooleanFormat): string => {
    if (format === "string") {
        return value ? "true" : "false";
    }
    return value ? "1" : "0";
};

/**
 * Format a Date value based on options
 */
const formatDate = (value: Date, format: DateFormat): string => {
    switch (format) {
        case "timestamp":
            return String(value.getTime());
        case "date":
            return value.toISOString().split("T")[0];
        case "iso":
        default:
            return value.toISOString();
    }
};

/**
 * Recursively append values to FormData
 */
const appendToFormData = (
    formData: FormData,
    key: string,
    value: FormDataValue,
    options: Required<ToFormDataOptions>,
    seen: WeakSet<object>
): void => {
    // Handle null/undefined
    if (value === null || value === undefined) {
        if (!options.skipNull) {
            formData.append(key, "");
        }
        return;
    }

    // Handle empty strings
    if (value === "" && options.skipEmpty) {
        return;
    }

    // Handle FileList (convert to array of files)
    if (typeof FileList !== "undefined" && value instanceof FileList) {
        Array.from(value).forEach((file, index) => {
            const fileKey = buildKey(key, "", true, options.arrayFormat, index);
            formData.append(fileKey, file);
        });
        return;
    }

    // Handle File/Blob (passthrough)
    if (value instanceof File || value instanceof Blob) {
        formData.append(key, value);
        return;
    }

    // Handle Date
    if (value instanceof Date) {
        // Skip invalid dates
        if (Number.isNaN(value.getTime())) {
            console.warn(
                `[toFormData] Invalid Date value for key "${key}", skipping`
            );
            return;
        }
        formData.append(key, formatDate(value, options.dateFormat));
        return;
    }

    // Handle boolean
    if (typeof value === "boolean") {
        formData.append(key, formatBoolean(value, options.booleanFormat));
        return;
    }

    // Handle number
    if (typeof value === "number") {
        // Skip NaN and Infinity as they're not valid form values
        if (Number.isNaN(value) || !Number.isFinite(value)) {
            console.warn(
                `[toFormData] Invalid number value for key "${key}" (${value}), skipping`
            );
            return;
        }
        formData.append(key, String(value));
        return;
    }

    // Handle string
    if (typeof value === "string") {
        formData.append(key, value);
        return;
    }

    // Handle arrays
    if (Array.isArray(value)) {
        if (value.length === 0 && options.skipEmptyArrays) {
            return;
        }

        value.forEach((item, index) => {
            const arrayKey = buildKey(
                key,
                "",
                true,
                options.arrayFormat,
                index
            );
            appendToFormData(formData, arrayKey, item, options, seen);
        });
        return;
    }

    // Handle objects (nested)
    if (typeof value === "object") {
        // Circular reference protection
        if (seen.has(value)) {
            console.warn(
                `[toFormData] Circular reference detected for key "${key}", skipping`
            );
            return;
        }
        seen.add(value);

        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
            const fullKey = buildKey(
                key,
                nestedKey,
                false,
                options.arrayFormat
            );
            appendToFormData(formData, fullKey, nestedValue, options, seen);
        });
        return;
    }
};

/**
 * Convert a JavaScript object to FormData
 *
 * @param payload - The object to convert
 * @param options - Conversion options
 * @returns FormData instance
 *
 * @example
 * ```ts
 * // Example 1: Simple form with file
 * const formData = toFormData({
 *     title: "My Document",
 *     file: selectedFile,
 *     isActive: true
 * });
 * // Result:
 * // title: "My Document"
 * // file: [File object]
 * // isActive: "1"
 *
 * // Example 2: Nested object with arrays
 * const formData = toFormData({
 *     title: "Report",
 *     attachments: [file1, file2],
 *     meta: {
 *         tags: ["urgent", "review"],
 *         priority: 1
 *     }
 * });
 * // Result (brackets format - default):
 * // title: "Report"
 * // attachments[]: [File1]
 * // attachments[]: [File2]
 * // meta[tags][]: "urgent"
 * // meta[tags][]: "review"
 * // meta[priority]: "1"
 *
 * // Example 3: Using indices format for .NET backend
 * const formData = toFormData({
 *     items: ["a", "b", "c"]
 * }, { arrayFormat: 'indices' });
 * // Result:
 * // items[0]: "a"
 * // items[1]: "b"
 * // items[2]: "c"
 * ```
 */
export const toFormData = (
    payload: Record<string, FormDataValue>,
    options?: ToFormDataOptions
): FormData => {
    const formData = new FormData();
    const mergedOptions = { ...defaultOptions, ...options };
    const seen = new WeakSet<object>();

    Object.entries(payload).forEach(([key, value]) => {
        appendToFormData(formData, key, value, mergedOptions, seen);
    });

    return formData;
};

/**
 * Debug helper to log FormData contents
 */
export const logFormDataContents = (
    formData: FormData,
    label?: string
): void => {
    console.log(label ? `${label}:` : "FormData contents:");
    formData.forEach((value, key) => {
        if (value instanceof File) {
            console.log(`  ${key}: [File] ${value.name} (${value.size} bytes)`);
        } else if (typeof value === "object" && value !== null) {
            console.log(`  ${key}: [Blob] (${(value as Blob).size} bytes)`);
        } else {
            console.log(`  ${key}: ${value}`);
        }
    });
};

/**
 * Type-safe wrapper for React Hook Form integration
 *
 * @example
 * ```ts
 * const onSubmit = handleSubmit((data) => {
 *     const formData = formDataFromRHF(data);
 *     await api.post('/upload', formData, { meta: { multipart: true } });
 * });
 * ```
 */
export const formDataFromRHF = <T extends Record<string, unknown>>(
    data: T,
    options?: ToFormDataOptions
): FormData => {
    return toFormData(data as Record<string, FormDataValue>, options);
};

export default toFormData;
