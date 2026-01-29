/**
 * Global Search Module
 *
 * Provides global search functionality across the application.
 *
 * @example
 * ```tsx
 * // Register a search provider
 * import { searchRegistry } from '@/search';
 * searchRegistry.register(mySearchProvider);
 *
 * // Use search in components
 * import { useSearch } from '@/search';
 * const { openSearch, state } = useSearch();
 * ```
 */

// Types
export * from "./types";

// Registry
export { searchRegistry, type SearchRegistry } from "./registry";

// Providers
export { navigationSearchProvider } from "./providers";

// Context
export { SearchProvider, useSearch } from "./context";

// Hooks
export { useGlobalSearch, type UseGlobalSearchReturn } from "./hooks";

// Components
export { SearchModal } from "./components";
