/**
 * Route Suspense Wrapper
 *
 * Provides consistent loading UI for lazy-loaded routes.
 * Wraps React.lazy components with Suspense.
 */

import { Loading } from "@/shared/components/ui/Loading";
import { Suspense, type ComponentType } from "react";

/**
 * Suspense wrapper for lazy-loaded route components
 *
 * @example
 * ```tsx
 * <Route
 *     path="/courses"
 *     element={
 *         <RouteSuspense
 *             component={lazy(() => import('./pages/CoursesList'))}
 *         />
 *     }
 * />
 * ```
 */
export function RouteSuspense({
    component: Component,
    fallback,
}: {
    component: React.LazyExoticComponent<ComponentType<unknown>>;
    fallback?: React.ReactNode;
}) {
    return (
        <Suspense fallback={fallback ?? <Loading />}>
            <Component />
        </Suspense>
    );
}

/**
 * Create a lazy route element with Suspense
 *
 * @example
 * ```tsx
 * const CoursesListLazy = lazy(() => import('./pages/CoursesList'));
 *
 * const routes = [
 *     {
 *         path: '/courses',
 *         element: createLazyElement(CoursesListLazy),
 *     },
 * ];
 * ```
 */
export function createLazyElement(
    LazyComponent: React.LazyExoticComponent<ComponentType<unknown>>,
    fallback?: React.ReactNode
) {
    return <RouteSuspense component={LazyComponent} fallback={fallback} />;
}

export default RouteSuspense;
