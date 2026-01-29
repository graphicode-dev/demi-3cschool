/**
 * Global Search Types
 *
 * Type definitions for the global search system.
 * Follows Interface Segregation Principle - separate interfaces for different concerns.
 */

import type { ComponentType } from "react";

// ============================================================================
// Entity Types
// ============================================================================

/**
 * Searchable entity types across the application
 */
export type SearchEntityType =
    | "navigation"
    | "course"
    | "level"
    | "lesson"
    | "group"
    | "student"
    | "instructor"
    | "price-list"
    | "coupon"
    | "ticket";

// ============================================================================
// Searchable Entity
// ============================================================================

/**
 * Represents a single searchable item
 */
export interface SearchableEntity {
    /**
     * Unique identifier
     */
    id: string;

    /**
     * Entity type for categorization
     */
    type: SearchEntityType;

    /**
     * Primary display text
     */
    title: string;

    /**
     * Secondary display text (optional)
     */
    subtitle?: string;

    /**
     * Additional description (optional)
     */
    description?: string;

    /**
     * Navigation path when selected
     */
    path: string;

    /**
     * Icon component for display
     */
    icon?: ComponentType<{ className?: string }>;

    /**
     * Additional metadata for filtering/display
     */
    metadata?: Record<string, unknown>;

    /**
     * Additional keywords for search matching
     */
    keywords?: string[];

    /**
     * i18n translation key for title
     */
    titleKey?: string;
}

// ============================================================================
// Search Provider
// ============================================================================

/**
 * Search options passed to providers
 */
export interface SearchOptions {
    /**
     * Maximum results to return
     */
    limit?: number;

    /**
     * User role for permission filtering
     */
    role?: string;

    /**
     * Locale for translations
     */
    locale?: string;
}

/**
 * Search provider interface - each feature implements this
 * Follows Open/Closed Principle - extend by adding providers, not modifying core
 */
export interface SearchProvider {
    /**
     * Unique provider identifier
     */
    id: string;

    /**
     * Entity type this provider searches
     */
    entityType: SearchEntityType;

    /**
     * i18n translation key for category label
     */
    labelKey: string;

    /**
     * Fallback label (English)
     */
    label: string;

    /**
     * Icon for this category
     */
    icon: ComponentType<{ className?: string }>;

    /**
     * Search function - returns matching entities
     */
    search: (
        query: string,
        options?: SearchOptions
    ) => Promise<SearchableEntity[]>;

    /**
     * Whether this provider is enabled
     */
    enabled?: boolean;

    /**
     * Sort order (lower = higher priority)
     */
    order?: number;
}

// ============================================================================
// Search Results
// ============================================================================

/**
 * Grouped search results by entity type
 */
export interface GroupedSearchResults {
    [key: string]: {
        label: string;
        labelKey: string;
        icon: ComponentType<{ className?: string }>;
        items: SearchableEntity[];
    };
}

/**
 * Search state
 */
export interface SearchState {
    query: string;
    results: GroupedSearchResults;
    isLoading: boolean;
    error: string | null;
    selectedIndex: number;
    selectedCategory: string | null;
}

// ============================================================================
// Search History
// ============================================================================

/**
 * Recent search entry
 */
export interface RecentSearch {
    query: string;
    timestamp: number;
    resultCount: number;
}

// ============================================================================
// Search Context
// ============================================================================

/**
 * Search context value
 */
export interface SearchContextValue {
    /**
     * Current search state
     */
    state: SearchState;

    /**
     * Open the search modal
     */
    openSearch: () => void;

    /**
     * Close the search modal
     */
    closeSearch: () => void;

    /**
     * Whether search modal is open
     */
    isOpen: boolean;

    /**
     * Execute a search
     */
    search: (query: string) => Promise<void>;

    /**
     * Clear search results
     */
    clearResults: () => void;

    /**
     * Recent searches
     */
    recentSearches: RecentSearch[];

    /**
     * Clear search history
     */
    clearHistory: () => void;

    /**
     * Navigate to next result
     */
    selectNext: () => void;

    /**
     * Navigate to previous result
     */
    selectPrevious: () => void;

    /**
     * Get currently selected result
     */
    getSelectedResult: () => SearchableEntity | null;
}
