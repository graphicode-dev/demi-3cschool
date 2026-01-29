/**
 * Tooltip Component
 *
 * A reusable tooltip component with smooth animations and multiple placement options.
 * Wraps children and shows tooltip on hover.
 */

import { useState, useRef, useEffect, type ReactNode } from "react";

type TooltipPlacement = "top" | "bottom" | "left" | "right";

interface TooltipProps {
    children: ReactNode;
    content: ReactNode;
    placement?: TooltipPlacement;
    delay?: number;
    disabled?: boolean;
    parentClassName?: string;
    childClassName?: string;
}

const placementStyles: Record<
    TooltipPlacement,
    {
        position: string;
        arrow: string;
        initial: string;
        animate: string;
    }
> = {
    top: {
        position: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        arrow: "top-full left-1/2 -translate-x-1/2 border-t-gray-900 dark:border-t-gray-700 border-x-transparent border-b-transparent",
        initial: "opacity-0 translate-y-1",
        animate: "opacity-100 translate-y-0",
    },
    bottom: {
        position: "top-full left-1/2 -translate-x-1/2 mt-2",
        arrow: "bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 dark:border-b-gray-700 border-x-transparent border-t-transparent",
        initial: "opacity-0 -translate-y-1",
        animate: "opacity-100 translate-y-0",
    },
    left: {
        position: "right-full top-1/2 -translate-y-1/2 mr-2",
        arrow: "left-full top-1/2 -translate-y-1/2 border-l-gray-900 dark:border-l-gray-700 border-y-transparent border-r-transparent",
        initial: "opacity-0 translate-x-1",
        animate: "opacity-100 translate-x-0",
    },
    right: {
        position: "left-full top-1/2 -translate-y-1/2 ml-2",
        arrow: "right-full top-1/2 -translate-y-1/2 border-r-gray-900 dark:border-r-gray-700 border-y-transparent border-l-transparent",
        initial: "opacity-0 -translate-x-1",
        animate: "opacity-100 translate-x-0",
    },
};

export function Tooltip({
    children,
    content,
    placement = "top",
    delay = 200,
    disabled = false,
    parentClassName = "",
    childClassName = "",
}: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const styles = placementStyles[placement];

    const showTooltip = () => {
        if (disabled) return;
        timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
            requestAnimationFrame(() => {
                setIsAnimating(true);
            });
        }, delay);
    };

    const hideTooltip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsAnimating(false);
        setTimeout(() => {
            setIsVisible(false);
        }, 150);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={`relative inline-flex ${parentClassName}`}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
            onFocus={showTooltip}
            onBlur={hideTooltip}
        >
            {children}

            {isVisible && (
                <div
                    role="tooltip"
                    className={`
                        absolute z-50 ${styles.position}
                        ${childClassName}
                        px-3 py-2 text-xs font-medium text-white
                        bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg
                         pointer-events-none
                        transition-all duration-150 ease-out
                        ${isAnimating ? styles.animate : styles.initial}
                    `}
                >
                    {content}
                    <span
                        className={`
                            absolute w-0 h-0 border-4 ${styles.arrow}
                        `}
                    />
                </div>
            )}
        </div>
    );
}

export default Tooltip;
