/**
 * useGlobalSearch Hook
 *
 * Main hook for global search functionality.
 * Provides search execution, results management, and keyboard navigation.
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { searchRegistry } from "../registry";
import type { SearchState, SearchableEntity, RecentSearch } from "../types";

// ============================================================================
// Constants
// ============================================================================

const DEBOUNCE_MS = 200;
const MAX_RECENT_SEARCHES = 5;
const STORAGE_KEY = "global-search-history";

// ============================================================================
// Initial State
// ============================================================================

const initialState: SearchState = {
    query: "",
    results: {},
    isLoading: false,
    error: null,
    selectedIndex: 0,
    selectedCategory: null,
};

// ============================================================================
// Hook
// ============================================================================

export interface UseGlobalSearchOptions {
    /**
     * Auto-close modal after navigation
     */
    autoClose?: boolean;

    /**
     * Maximum results per category
     */
    limit?: number;
}

export interface UseGlobalSearchReturn {
    state: SearchState;
    isOpen: boolean;
    openSearch: () => void;
    closeSearch: () => void;
    setQuery: (query: string) => void;
    search: (query: string) => Promise<void>;
    clearResults: () => void;
    recentSearches: RecentSearch[];
    clearHistory: () => void;
    removeRecentSearch: (query: string) => void;
    selectedRecentIndex: number;
    selectNextRecent: () => void;
    selectPreviousRecent: () => void;
    selectRecentSearch: () => void;
    deleteSelectedRecent: () => void;
    selectNext: () => void;
    selectPrevious: () => void;
    selectResult: () => void;
    getSelectedResult: () => SearchableEntity | null;
    getFlatResults: () => SearchableEntity[];
}

export const useGlobalSearch = (
    options: UseGlobalSearchOptions = {}
): UseGlobalSearchReturn => {
    const { autoClose = true, limit = 5 } = options;
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [state, setState] = useState<SearchState>(initialState);
    const [isOpen, setIsOpen] = useState(false);
    const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
    const [selectedRecentIndex, setSelectedRecentIndex] = useState(-1);

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Load recent searches from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setRecentSearches(JSON.parse(stored));
            }
        } catch {
            // Ignore localStorage errors
        }
    }, []);

    // Save recent searches to localStorage
    const saveRecentSearch = useCallback(
        (query: string, resultCount: number) => {
            if (!query.trim()) return;

            setRecentSearches((prev) => {
                const filtered = prev.filter((s) => s.query !== query);
                const updated = [
                    { query, timestamp: Date.now(), resultCount },
                    ...filtered,
                ].slice(0, MAX_RECENT_SEARCHES);

                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                } catch {
                    // Ignore localStorage errors
                }

                return updated;
            });
        },
        []
    );

    // Clear history
    const clearHistory = useCallback(() => {
        setRecentSearches([]);
        setSelectedRecentIndex(-1);
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {
            // Ignore localStorage errors
        }
    }, []);

    // Remove single recent search
    const removeRecentSearch = useCallback((queryToRemove: string) => {
        setRecentSearches((prev) => {
            const updated = prev.filter((s) => s.query !== queryToRemove);
            try {
                if (updated.length > 0) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                } else {
                    localStorage.removeItem(STORAGE_KEY);
                }
            } catch {
                // Ignore localStorage errors
            }
            return updated;
        });
        setSelectedRecentIndex((prev) => Math.max(-1, prev - 1));
    }, []);

    // Navigate to next recent search
    const selectNextRecent = useCallback(() => {
        if (recentSearches.length === 0) return;
        setSelectedRecentIndex((prev) =>
            prev < recentSearches.length - 1 ? prev + 1 : 0
        );
    }, [recentSearches.length]);

    // Navigate to previous recent search
    const selectPreviousRecent = useCallback(() => {
        if (recentSearches.length === 0) return;
        setSelectedRecentIndex((prev) =>
            prev <= 0 ? recentSearches.length - 1 : prev - 1
        );
    }, [recentSearches.length]);

    // Delete selected recent search
    const deleteSelectedRecent = useCallback(() => {
        if (
            selectedRecentIndex >= 0 &&
            selectedRecentIndex < recentSearches.length
        ) {
            const recent = recentSearches[selectedRecentIndex];
            removeRecentSearch(recent.query);
        }
    }, [selectedRecentIndex, recentSearches, removeRecentSearch]);

    // Execute search
    const search = useCallback(
        async (query: string) => {
            // Cancel previous request
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            if (!query.trim()) {
                setState((prev) => ({
                    ...prev,
                    query,
                    results: {},
                    isLoading: false,
                    selectedIndex: 0,
                }));
                return;
            }

            setState((prev) => ({
                ...prev,
                query,
                isLoading: true,
                error: null,
            }));

            abortControllerRef.current = new AbortController();

            try {
                const results = await searchRegistry.search(query, { limit });

                setState((prev) => ({
                    ...prev,
                    results,
                    isLoading: false,
                    selectedIndex: 0,
                    selectedCategory: Object.keys(results)[0] ?? null,
                }));

                // Count total results
                const totalResults = Object.values(results).reduce(
                    (sum, group) => sum + group.items.length,
                    0
                );
                saveRecentSearch(query, totalResults);
            } catch (error) {
                if ((error as Error).name !== "AbortError") {
                    setState((prev) => ({
                        ...prev,
                        isLoading: false,
                        error: t("search:search.error", "Search failed"),
                    }));
                }
            }
        },
        [limit, saveRecentSearch, t]
    );

    // Debounced query setter
    const setQuery = useCallback(
        (query: string) => {
            setState((prev) => ({ ...prev, query }));

            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }

            debounceRef.current = setTimeout(() => {
                search(query);
            }, DEBOUNCE_MS);
        },
        [search]
    );

    // Select current recent search and execute
    const selectRecentSearch = useCallback(() => {
        if (
            selectedRecentIndex >= 0 &&
            selectedRecentIndex < recentSearches.length
        ) {
            const recent = recentSearches[selectedRecentIndex];
            setQuery(recent.query);
            setSelectedRecentIndex(-1);
        }
    }, [selectedRecentIndex, recentSearches, setQuery]);

    // Get flat list of all results
    const getFlatResults = useCallback((): SearchableEntity[] => {
        return Object.values(state.results).flatMap((group) => group.items);
    }, [state.results]);

    // Get currently selected result
    const getSelectedResult = useCallback((): SearchableEntity | null => {
        const flatResults = getFlatResults();
        return flatResults[state.selectedIndex] ?? null;
    }, [getFlatResults, state.selectedIndex]);

    // Navigate to next result
    const selectNext = useCallback(() => {
        const flatResults = getFlatResults();
        if (flatResults.length === 0) return;

        setState((prev) => ({
            ...prev,
            selectedIndex: (prev.selectedIndex + 1) % flatResults.length,
        }));
    }, [getFlatResults]);

    // Navigate to previous result
    const selectPrevious = useCallback(() => {
        const flatResults = getFlatResults();
        if (flatResults.length === 0) return;

        setState((prev) => ({
            ...prev,
            selectedIndex:
                prev.selectedIndex === 0
                    ? flatResults.length - 1
                    : prev.selectedIndex - 1,
        }));
    }, [getFlatResults]);

    // Select current result and navigate
    const selectResult = useCallback(() => {
        const result = getSelectedResult();
        if (result) {
            navigate(result.path);
            if (autoClose) {
                setIsOpen(false);
                setState(initialState);
            }
        }
    }, [getSelectedResult, navigate, autoClose]);

    // Open search modal
    const openSearch = useCallback(() => {
        setIsOpen(true);
    }, []);

    // Close search modal
    const closeSearch = useCallback(() => {
        setIsOpen(false);
        setState(initialState);
        setSelectedRecentIndex(-1);
    }, []);

    // Clear results
    const clearResults = useCallback(() => {
        setState(initialState);
    }, []);

    // Keyboard shortcut (Cmd/Ctrl + K) - supports both English and Arabic keyboard layouts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Check for Ctrl/Cmd + K (English) or Ctrl/Cmd + ن (Arabic keyboard layout)
            // Using e.code for physical key position (KeyK) works regardless of keyboard layout
            const isSearchShortcut =
                (e.metaKey || e.ctrlKey) &&
                (e.key === "k" ||
                    e.key === "K" ||
                    e.key === "ن" ||
                    e.code === "KeyK");

            if (isSearchShortcut) {
                e.preventDefault();
                if (isOpen) {
                    closeSearch();
                } else {
                    openSearch();
                }
            }

            if (isOpen) {
                const hasQuery = state.query.trim().length > 0;
                const hasResults = Object.keys(state.results).length > 0;

                if (e.key === "Escape") {
                    e.preventDefault();
                    closeSearch();
                } else if (e.key === "ArrowDown") {
                    e.preventDefault();
                    if (!hasQuery && recentSearches.length > 0) {
                        selectNextRecent();
                    } else if (hasResults) {
                        selectNext();
                    }
                } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    if (!hasQuery && recentSearches.length > 0) {
                        selectPreviousRecent();
                    } else if (hasResults) {
                        selectPrevious();
                    }
                } else if (e.key === "Enter") {
                    e.preventDefault();
                    if (!hasQuery && selectedRecentIndex >= 0) {
                        selectRecentSearch();
                    } else if (hasResults) {
                        selectResult();
                    }
                } else if (
                    (e.key === "Delete" || e.key === "Backspace") &&
                    !hasQuery &&
                    selectedRecentIndex >= 0
                ) {
                    e.preventDefault();
                    deleteSelectedRecent();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [
        isOpen,
        state.query,
        state.results,
        recentSearches,
        selectedRecentIndex,
        openSearch,
        closeSearch,
        selectNext,
        selectPrevious,
        selectResult,
        selectNextRecent,
        selectPreviousRecent,
        selectRecentSearch,
        deleteSelectedRecent,
    ]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return {
        state,
        isOpen,
        openSearch,
        closeSearch,
        setQuery,
        search,
        clearResults,
        recentSearches,
        clearHistory,
        removeRecentSearch,
        selectedRecentIndex,
        selectNextRecent,
        selectPreviousRecent,
        selectRecentSearch,
        deleteSelectedRecent,
        selectNext,
        selectPrevious,
        selectResult,
        getSelectedResult,
        getFlatResults,
    };
};

export default useGlobalSearch;
