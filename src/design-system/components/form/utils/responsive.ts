// src/utils/responsive.ts
import { ResponsiveValue } from "../config/formConfig";

/**
 * Resolves a responsive value to a single value based on current breakpoint
 * Falls back to defaultValue if the resolved value is null or undefined
 */
export function resolveResponsiveValue<T>(
    value: ResponsiveValue<T>,
    defaultValue: T
): T {
    if (value === null || value === undefined) {
        return defaultValue;
    }

    if (typeof value === "object" && !Array.isArray(value)) {
        // In a real implementation, you'd check the current viewport width
        // For now, return base value or default
        return (value as any)?.base ?? defaultValue;
    }

    return value as T;
}

/**
 * Generates responsive CSS classes based on breakpoints
 */
export function getResponsiveClasses(
    value: ResponsiveValue<string> | undefined,
    prefix: string
): string {
    if (!value) return "";

    if (typeof value === "string") {
        return prefix ? `${prefix}-${value}` : value;
    }

    const classes: string[] = [];
    const breakpoints = ["base", "sm", "md", "lg", "xl", "2xl"] as const;

    breakpoints.forEach((breakpoint) => {
        const val = (value as any)[breakpoint];
        if (val) {
            const breakpointPrefix =
                breakpoint === "base" ? "" : `${breakpoint}:`;
            const className = prefix ? `${prefix}-${val}` : val;
            classes.push(`${breakpointPrefix}${className}`);
        }
    });

    return classes.join(" ");
}

/**
 * Generates responsive grid column classes
 */
export function getResponsiveGridClasses(
    columns: ResponsiveValue<number> | undefined
): string {
    if (!columns) return "grid-cols-1";

    if (typeof columns === "number") {
        return `grid-cols-${columns}`;
    }

    const classes: string[] = [];
    const breakpoints: Array<keyof typeof columns> = [
        "base",
        "sm",
        "md",
        "lg",
        "xl",
        "2xl",
    ];

    breakpoints.forEach((breakpoint) => {
        const cols = columns[breakpoint];
        if (cols !== undefined && cols !== null) {
            const breakpointPrefix =
                breakpoint === "base" ? "" : `${breakpoint}:`;
            classes.push(`${breakpointPrefix}grid-cols-${cols}`);
        }
    });

    return classes.join(" ");
}

/**
 * Generates responsive gap classes
 * Supports both Tailwind scale values (e.g., "4", "6") and arbitrary values (e.g., "1rem", "20px")
 */
export function getResponsiveGapClasses(
    gap: ResponsiveValue<string> | undefined
): string {
    if (!gap) return "gap-4"; // Default gap

    const formatGapClass = (value: string): string => {
        // If it's a number (Tailwind scale), use gap-{value}
        // If it contains units (rem, px, em, etc.), use arbitrary value gap-[{value}]
        if (/^\d+(\.\d+)?$/.test(value)) {
            return `gap-${value}`;
        }
        return `gap-[${value}]`;
    };

    if (typeof gap === "string") {
        return formatGapClass(gap);
    }

    const classes: string[] = [];
    const breakpoints: Array<keyof typeof gap> = [
        "base",
        "sm",
        "md",
        "lg",
        "xl",
        "2xl",
    ];

    breakpoints.forEach((breakpoint) => {
        const gapValue = gap[breakpoint];
        if (gapValue) {
            const breakpointPrefix =
                breakpoint === "base" ? "" : `${breakpoint}:`;
            classes.push(`${breakpointPrefix}${formatGapClass(gapValue)}`);
        }
    });

    return classes.join(" ");
}

/**
 * Generates responsive row gap (vertical) classes
 */
export function getResponsiveRowGapClasses(
    gap: ResponsiveValue<string> | undefined
): string {
    if (!gap) return "";

    const formatGapClass = (value: string): string => {
        if (/^\d+(\.\d+)?$/.test(value)) {
            return `gap-y-${value}`;
        }
        return `gap-y-[${value}]`;
    };

    if (typeof gap === "string") {
        return formatGapClass(gap);
    }

    const classes: string[] = [];
    const breakpoints: Array<keyof typeof gap> = [
        "base",
        "sm",
        "md",
        "lg",
        "xl",
        "2xl",
    ];

    breakpoints.forEach((breakpoint) => {
        const gapValue = gap[breakpoint];
        if (gapValue) {
            const breakpointPrefix =
                breakpoint === "base" ? "" : `${breakpoint}:`;
            classes.push(`${breakpointPrefix}${formatGapClass(gapValue)}`);
        }
    });

    return classes.join(" ");
}

/**
 * Generates responsive column gap (horizontal) classes
 */
export function getResponsiveColGapClasses(
    gap: ResponsiveValue<string> | undefined
): string {
    if (!gap) return "";

    const formatGapClass = (value: string): string => {
        if (/^\d+(\.\d+)?$/.test(value)) {
            return `gap-x-${value}`;
        }
        return `gap-x-[${value}]`;
    };

    if (typeof gap === "string") {
        return formatGapClass(gap);
    }

    const classes: string[] = [];
    const breakpoints: Array<keyof typeof gap> = [
        "base",
        "sm",
        "md",
        "lg",
        "xl",
        "2xl",
    ];

    breakpoints.forEach((breakpoint) => {
        const gapValue = gap[breakpoint];
        if (gapValue) {
            const breakpointPrefix =
                breakpoint === "base" ? "" : `${breakpoint}:`;
            classes.push(`${breakpointPrefix}${formatGapClass(gapValue)}`);
        }
    });

    return classes.join(" ");
}
