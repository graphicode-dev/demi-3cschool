import { useEffect, useState } from "react";
import { useDebounce } from "@/shared/observability";

type UseServerTableSearchOptions = {
    initialQuery?: string;
    delayMs?: number;
    onDebouncedChange?: (query: string) => void;
};

export function useServerTableSearch(options: UseServerTableSearchOptions = {}) {
    const { initialQuery = "", delayMs = 400, onDebouncedChange } = options;

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const debouncedSearchQuery = useDebounce(searchQuery, delayMs);

    useEffect(() => {
        onDebouncedChange?.(debouncedSearchQuery);
    }, [debouncedSearchQuery, onDebouncedChange]);

    return { searchQuery, setSearchQuery, debouncedSearchQuery };
}
