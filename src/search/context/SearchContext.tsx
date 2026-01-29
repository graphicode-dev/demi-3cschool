/**
 * Search Context
 *
 * Provides global search state and actions to the application.
 * Wrap your app with SearchProvider to enable global search.
 */

import { createContext, useContext, type ReactNode } from "react";
import { useGlobalSearch, type UseGlobalSearchReturn } from "../hooks";

// ============================================================================
// Context
// ============================================================================

const SearchContext = createContext<UseGlobalSearchReturn | null>(null);

// ============================================================================
// Provider
// ============================================================================

interface SearchProviderProps {
    children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
    const search = useGlobalSearch();

    return (
        <SearchContext.Provider value={search}>
            {children}
        </SearchContext.Provider>
    );
}

// ============================================================================
// Hook
// ============================================================================

export function useSearch(): UseGlobalSearchReturn {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error("useSearch must be used within a SearchProvider");
    }
    return context;
}

export default SearchProvider;
