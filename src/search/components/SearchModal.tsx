/**
 * Search Modal Component
 *
 * Global search modal with keyboard navigation.
 * Displays search results grouped by category.
 */

import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
    Search,
    X,
    ArrowUp,
    ArrowDown,
    CornerDownLeft,
    Trash2,
} from "lucide-react";
import { useSearch } from "../context";
import type { SearchableEntity } from "../types";

// ============================================================================
// Search Result Item
// ============================================================================

interface SearchResultItemProps {
    result: SearchableEntity;
    isSelected: boolean;
    onClick: () => void;
}

function SearchResultItem({
    result,
    isSelected,
    onClick,
}: SearchResultItemProps) {
    const { t } = useTranslation();
    const Icon = result.icon;

    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                w-full flex items-center gap-3 px-4 py-3 text-start transition-colors
                ${
                    isSelected
                        ? "bg-brand-50 dark:bg-brand-900/20"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }
            `}
        >
            {Icon && (
                <div
                    className={`
                    shrink-0 w-8 h-8 flex items-center justify-center rounded-lg
                    ${
                        isSelected
                            ? "bg-brand-100 dark:bg-brand-800/30 text-brand-600 dark:text-brand-400"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    }
                `}
                >
                    <Icon className="w-4 h-4" />
                </div>
            )}
            <div className="flex-1 min-w-0">
                <p
                    className={`
                    text-sm font-medium truncate
                    ${
                        isSelected
                            ? "text-brand-700 dark:text-brand-300"
                            : "text-gray-900 dark:text-white"
                    }
                `}
                >
                    {result.titleKey
                        ? t(result.titleKey, result.title)
                        : result.title}
                </p>
                {result.subtitle && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {result.subtitle}
                    </p>
                )}
            </div>
            {isSelected && (
                <div className="shrink-0 text-xs text-gray-400 dark:text-gray-500">
                    <CornerDownLeft className="w-4 h-4" />
                </div>
            )}
        </button>
    );
}

// ============================================================================
// Search Modal
// ============================================================================

export function SearchModal() {
    const { t } = useTranslation("search");
    const {
        state,
        isOpen,
        closeSearch,
        setQuery,
        selectResult,
        getFlatResults,
        recentSearches,
        clearHistory,
        removeRecentSearch,
        selectedRecentIndex,
    } = useSearch();

    const inputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(e.target as Node)
            ) {
                closeSearch();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, closeSearch]);

    if (!isOpen) return null;

    const flatResults = getFlatResults();
    const hasResults = flatResults.length > 0;
    const hasQuery = state.query.trim().length > 0;

    return (
        <div className="fixed inset-0 z-9999 flex items-start justify-center pt-[10vh] bg-black/50 backdrop-blur-sm">
            <div
                ref={modalRef}
                className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={state.query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t(
                            "search.placeholder",
                            "Search pages, courses, groups..."
                        )}
                        className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 text-base outline-none"
                    />
                    {state.isLoading && (
                        <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                    )}
                    <button
                        type="button"
                        onClick={closeSearch}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {/* No query - show recent searches */}
                    {!hasQuery && recentSearches.length > 0 && (
                        <div className="p-2">
                            <div className="flex items-center justify-between px-3 py-2">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {t("search.recent", "Recent Searches")}
                                </p>
                                <button
                                    type="button"
                                    onClick={clearHistory}
                                    className="text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                >
                                    {t("search.clearAll", "Clear All")}
                                </button>
                            </div>
                            {recentSearches.map((recent, index) => {
                                const isSelected =
                                    index === selectedRecentIndex;
                                return (
                                    <div
                                        key={recent.query}
                                        className={`
                                            flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group
                                            ${
                                                isSelected
                                                    ? "bg-brand-50 dark:bg-brand-900/20"
                                                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                                            }
                                        `}
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setQuery(recent.query)
                                            }
                                            className="flex-1 flex items-center gap-3 text-start"
                                        >
                                            <Search
                                                className={`w-4 h-4 ${isSelected ? "text-brand-500" : "text-gray-400"}`}
                                            />
                                            <span
                                                className={`text-sm ${isSelected ? "text-brand-700 dark:text-brand-300 font-medium" : "text-gray-700 dark:text-gray-300"}`}
                                            >
                                                {recent.query}
                                            </span>
                                            <span className="ms-auto text-xs text-gray-400">
                                                {recent.resultCount}{" "}
                                                {t("search.results", "results")}
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeRecentSearch(
                                                    recent.query
                                                );
                                            }}
                                            className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                            title={t("search.delete", "Delete")}
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                        {isSelected && (
                                            <div className="shrink-0 text-xs text-gray-400 dark:text-gray-500">
                                                <CornerDownLeft className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* No query and no recent - show hint */}
                    {!hasQuery && recentSearches.length === 0 && (
                        <div className="p-8 text-center">
                            <Search className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {t("search.hint", "Start typing to search...")}
                            </p>
                        </div>
                    )}

                    {/* Has query but no results */}
                    {hasQuery && !hasResults && !state.isLoading && (
                        <div className="p-8 text-center">
                            <Search className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {t("search.noResults", "No results found for")}{" "}
                                "{state.query}"
                            </p>
                        </div>
                    )}

                    {/* Results grouped by category */}
                    {hasResults && (
                        <div className="p-2">
                            {Object.entries(state.results).map(
                                ([categoryId, category]) => {
                                    const CategoryIcon = category.icon;
                                    return (
                                        <div key={categoryId} className="mb-2">
                                            <div className="flex items-center gap-2 px-3 py-2">
                                                <CategoryIcon className="w-4 h-4 text-gray-400" />
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    {t(
                                                        category.labelKey,
                                                        category.label
                                                    )}
                                                </p>
                                            </div>
                                            <div className="space-y-0.5">
                                                {category.items.map(
                                                    (result) => {
                                                        const globalIndex =
                                                            flatResults.findIndex(
                                                                (r) =>
                                                                    r.id ===
                                                                    result.id
                                                            );
                                                        return (
                                                            <SearchResultItem
                                                                key={result.id}
                                                                result={result}
                                                                isSelected={
                                                                    globalIndex ===
                                                                    state.selectedIndex
                                                                }
                                                                onClick={() => {
                                                                    selectResult();
                                                                }}
                                                            />
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    )}
                </div>

                {/* Footer with keyboard hints */}
                <div className="flex items-center gap-4 px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-[10px] font-medium">
                            <ArrowUp className="w-3 h-3 inline" />
                        </kbd>
                        <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-[10px] font-medium">
                            <ArrowDown className="w-3 h-3 inline" />
                        </kbd>
                        <span className="ms-1">
                            {t("search.navigate", "Navigate")}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-[10px] font-medium">
                            Enter
                        </kbd>
                        <span className="ms-1">
                            {t("search.select", "Select")}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-[10px] font-medium">
                            Esc
                        </kbd>
                        <span className="ms-1">
                            {t("search.close", "Close")}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchModal;
