/**
 * SearchInput Component
 *
 * A search input with icon for filtering lists.
 * Supports debouncing to delay API calls while typing.
 *
 * @example
 * ```tsx
 * <SearchInput
 *     value={search}
 *     onChange={setSearch}
 *     placeholder="Search courses"
 *     debounceMs={300}
 * />
 * ```
 */

import { BaseComponentProps } from "@/design-system";
import { useState, useEffect, useRef } from "react";

interface SearchInputProps extends BaseComponentProps {
    /** Current search value */
    value: string;
    /** Change handler */
    onChange: (value: string) => void;
    /** Placeholder text */
    placeholder?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Debounce delay in milliseconds (default: 300) */
    debounceMs?: number;
}

/**
 * Search input with icon and debouncing
 */
export function SearchInput({
    value,
    onChange,
    placeholder = "Search...",
    disabled = false,
    className = "",
    testId,
    debounceMs = 300,
}: SearchInputProps) {
    const [localValue, setLocalValue] = useState(value);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isFirstRender = useRef(true);

    // Sync local value when external value changes (e.g., URL navigation)
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    // Debounced onChange
    useEffect(() => {
        // Skip on first render to avoid unnecessary API call
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // Clear previous timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout
        timeoutRef.current = setTimeout(() => {
            if (localValue !== value) {
                onChange(localValue);
            }
        }, debounceMs);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [localValue, debounceMs, onChange, value]);

    return (
        <div className={`relative ${className}`} data-testid={testId}>
            <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
                <svg
                    className="w-5 h-5 text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                </svg>
            </div>
            <input
                type="search"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                className="block w-full p-3 ps-12 text-sm text-gray-900 border border-gray-200 rounded-lg bg-gray-50 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-500 dark:focus:border-brand-500"
                placeholder={placeholder}
                disabled={disabled}
            />
        </div>
    );
}

export default SearchInput;
