/**
 * useChartAnimation Hook
 *
 * Provides animation state management for chart components.
 * Triggers animation after component mounts and resets on data changes.
 */

import { useState, useEffect } from "react";

interface UseChartAnimationOptions {
    /** Delay before animation starts (ms) */
    delay?: number;
    /** Dependencies that trigger re-animation when changed */
    dependencies?: unknown[];
}

/**
 * Hook to manage chart animation state
 * @param isLoading - Whether the chart is in loading state
 * @param options - Animation options
 * @returns isAnimated - Whether the animation should be active
 */
export function useChartAnimation(
    isLoading: boolean = false,
    options: UseChartAnimationOptions = {}
): boolean {
    const { delay = 100, dependencies = [] } = options;
    const [isAnimated, setIsAnimated] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            const timer = setTimeout(() => setIsAnimated(true), delay);
            return () => clearTimeout(timer);
        }
        setIsAnimated(false);
    }, [isLoading, delay, ...dependencies]);

    return isAnimated;
}

export default useChartAnimation;
