/**
 * Feature Paths Registry
 *
 * Separate file to avoid circular dependencies.
 * Features import from here to register their paths.
 * paths.ts imports from here to expose them.
 */

// ============================================================================
// Feature Paths Registry
// ============================================================================

/**
 * Feature paths are registered here by each feature module.
 * This allows centralized access while keeping definitions local.
 */
export const featurePaths: Record<
    string,
    Record<string, (...args: any[]) => string>
> = {};

/**
 * Register feature paths
 */
export const registerFeaturePaths = <
    T extends Record<string, (...args: any[]) => string>,
>(
    featureId: string,
    paths: T
): T => {
    featurePaths[featureId] = paths;
    return paths;
};

export type FeaturePaths = typeof featurePaths;
