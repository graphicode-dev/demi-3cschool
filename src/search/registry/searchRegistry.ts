/**
 * Search Registry
 *
 * Central registry for search providers.
 * Features register their search providers here.
 * Follows Open/Closed Principle - extend by adding providers, not modifying core.
 *
 * @example
 * ```ts
 * import { searchRegistry } from '@/search';
 * searchRegistry.register(mySearchProvider);
 * ```
 */

import type {
    SearchProvider,
    SearchableEntity,
    SearchOptions,
    GroupedSearchResults,
} from "../types";

// ============================================================================
// Registry State
// ============================================================================

const registeredProviders: Map<string, SearchProvider> = new Map();

// ============================================================================
// Registry API
// ============================================================================

export const searchRegistry = {
    /**
     * Register a search provider
     */
    register(provider: SearchProvider): void {
        if (registeredProviders.has(provider.id)) {
            console.warn(
                `Search provider "${provider.id}" is already registered. Skipping.`
            );
            return;
        }
        registeredProviders.set(provider.id, provider);
    },

    /**
     * Unregister a search provider
     */
    unregister(id: string): boolean {
        return registeredProviders.delete(id);
    },

    /**
     * Get all registered providers
     */
    getAll(): SearchProvider[] {
        return Array.from(registeredProviders.values());
    },

    /**
     * Get enabled providers sorted by order
     */
    getEnabled(): SearchProvider[] {
        return this.getAll()
            .filter((p) => p.enabled !== false)
            .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    },

    /**
     * Get provider by ID
     */
    getById(id: string): SearchProvider | undefined {
        return registeredProviders.get(id);
    },

    /**
     * Execute search across all enabled providers
     */
    async search(
        query: string,
        options?: SearchOptions
    ): Promise<GroupedSearchResults> {
        if (!query.trim()) {
            return {};
        }

        const providers = this.getEnabled();
        const results: GroupedSearchResults = {};

        // Execute all provider searches in parallel
        const searchPromises = providers.map(async (provider) => {
            try {
                const items = await provider.search(query, options);
                return {
                    provider,
                    items,
                };
            } catch (error) {
                console.error(
                    `Search provider "${provider.id}" failed:`,
                    error
                );
                return {
                    provider,
                    items: [],
                };
            }
        });

        const searchResults = await Promise.all(searchPromises);

        // Group results by provider
        for (const { provider, items } of searchResults) {
            if (items.length > 0) {
                results[provider.id] = {
                    label: provider.label,
                    labelKey: provider.labelKey,
                    icon: provider.icon,
                    items,
                };
            }
        }

        return results;
    },

    /**
     * Get flat list of all results
     */
    async searchFlat(
        query: string,
        options?: SearchOptions
    ): Promise<SearchableEntity[]> {
        const grouped = await this.search(query, options);
        return Object.values(grouped).flatMap((group) => group.items);
    },

    /**
     * Clear all registered providers (useful for testing)
     */
    clear(): void {
        registeredProviders.clear();
    },

    /**
     * Get count of registered providers
     */
    get size(): number {
        return registeredProviders.size;
    },
};

export type SearchRegistry = typeof searchRegistry;
