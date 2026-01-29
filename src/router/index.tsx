/**
 * Feature-Based Router
 *
 * Main router configuration that combines feature routes.
 * Supports lazy loading, error boundaries, and legacy route migration.
 *
 * @example
 * ```tsx
 * // In main.tsx
 * import { AppRouter } from '@/router';
 *
 * createRoot(document.getElementById('root')!).render(
 *     <StrictMode>
 *         <Providers>
 *             <AppRouter />
 *         </Providers>
 *     </StrictMode>
 * );
 * ```
 */

// ============================================================================
// Feature Registration (auto-discovers and registers all routes and navigation)
// ============================================================================

import { loadFeatures } from "./featureLoader";

loadFeatures();

// ============================================================================
// Exports
// ============================================================================

export { RouteErrorBoundary } from "./RouteErrorBoundary";
export { RouteSuspense, createLazyElement } from "./RouteSuspense";
export type {
    RouteConfig,
    FeatureRouteConfig,
    FeatureRouteModule,
    LazyLoader,
    RouteGuard,
    LayoutConfig,
    NavItem,
    BreadcrumbItem,
} from "./routes.types";

// Route & Nav Registries
export { routeRegistry } from "./routeRegistry";
export { navRegistry } from "@/navigation/navRegistry";

// Paths (all paths accessible via `paths` object from ./paths)
export { paths, featurePaths } from "./paths";
