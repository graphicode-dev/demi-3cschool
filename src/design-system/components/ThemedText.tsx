import React from "react";
import { useLanguage } from "@/shared/hooks";
import { cn } from "@/utils";

// Types and Interfaces
export interface ThemedTextProps {
    children: React.ReactNode;
    variant?: "heading" | "body" | "caption" | "label";
    size?:
        | "xs"
        | "sm"
        | "base"
        | "lg"
        | "xl"
        | "2xl"
        | "3xl"
        | "4xl"
        | "5xl"
        | "6xl";
    weight?:
        | "thin"
        | "light"
        | "normal"
        | "medium"
        | "semibold"
        | "bold"
        | "extrabold"
        | "black";
    color?:
        | "primary"
        | "secondary"
        | "accent"
        | "success"
        | "warning"
        | "error"
        | "info"
        | "foreground"
        | "muted"
        | "background";
    font?:
        | "poppins"
        | "akaya-telivigala"
        | "segoe-arabic"
        | "expo-arabic"
        | "outfit";
    align?: "left" | "center" | "right" | "justify" | "start" | "end";
    transform?: "none" | "uppercase" | "lowercase" | "capitalize";
    className?: string;
    as?: React.ElementType;
    truncate?: boolean;
    italic?: boolean;
    underline?: boolean;
    lineThrough?: boolean;
}

// Configuration Objects
const FONT_FAMILIES = {
    poppins: "font-poppins",
    "akaya-telivigala": "font-akaya-telivigala",
    "segoe-arabic": "font-segoe-arabic",
    "expo-arabic": "font-expo-arabic",
    outfit: "font-outfit",
} as const;

const FONT_WEIGHTS = {
    thin: "font-thin",
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
    black: "font-black",
} as const;

const TEXT_SIZES = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
    "5xl": "text-5xl",
    "6xl": "text-6xl",
} as const;

const TEXT_COLORS = {
    primary: "text-brand-500 dark:text-brand-400",
    secondary: "text-gray-600 dark:text-gray-400",
    accent: "text-accent-500 dark:text-accent-400",
    success: "text-success-500 dark:text-success-400",
    warning: "text-warning-500 dark:text-warning-400",
    error: "text-error-500 dark:text-error-400",
    info: "text-info-500 dark:text-info-400",
    foreground: "text-foreground dark:text-foreground-dark",
    muted: "text-muted-foreground dark:text-muted-foreground-dark",
    background: "text-background dark:text-background-dark",
} as const;

const VARIANT_STYLES = {
    heading: "leading-tight tracking-tight",
    body: "leading-relaxed tracking-normal",
    caption: "leading-none tracking-wide",
    label: "leading-snug tracking-wide",
} as const;

const TEXT_ALIGNMENTS = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
    start: "text-start",
    end: "text-end",
} as const;

const TEXT_TRANSFORMS = {
    none: "",
    uppercase: "uppercase",
    lowercase: "lowercase",
    capitalize: "capitalize",
} as const;

// Utility Functions
const getAlignmentClass = (
    align: ThemedTextProps["align"],
    isRTL: boolean
): string => {
    if (!align) return "";

    // Handle RTL-aware alignment
    if (isRTL) {
        switch (align) {
            case "left":
                return TEXT_ALIGNMENTS.right;
            case "right":
                return TEXT_ALIGNMENTS.left;
            case "start":
                return TEXT_ALIGNMENTS.right;
            case "end":
                return TEXT_ALIGNMENTS.left;
            default:
                return TEXT_ALIGNMENTS[align];
        }
    }

    return TEXT_ALIGNMENTS[align];
};

// Main Component
const ThemedText: React.FC<ThemedTextProps> = ({
    children,
    variant = "body",
    size = "base",
    weight = "normal",
    color = "foreground",
    font = "poppins",
    align,
    transform = "none",
    className,
    as: Component = "p",
    truncate = false,
    italic = false,
    underline = false,
    lineThrough = false,
    ...props
}) => {
    const { isRTL } = useLanguage();

    // Build className array
    const classes = [
        // Base classes
        "transition-colors duration-200",

        // Font family (always use Expo Arabic for RTL languages, otherwise use specified font or default to Poppins)
        isRTL
            ? FONT_FAMILIES["expo-arabic"]
            : font
              ? FONT_FAMILIES[font]
              : FONT_FAMILIES.poppins,

        // Font weight
        FONT_WEIGHTS[weight],

        // Text size
        TEXT_SIZES[size],

        // Color with dark mode support
        TEXT_COLORS[color],

        // Variant-specific styles
        VARIANT_STYLES[variant],

        // RTL-aware text alignment
        align ? getAlignmentClass(align, isRTL) : "",

        // Text transform
        TEXT_TRANSFORMS[transform],

        // Text decorations
        italic && "italic",
        underline && "underline",
        lineThrough && "line-through",

        // Truncation
        truncate && "truncate",

        // Custom className
        className,
    ];

    const combinedClassName = cn(...classes);

    return React.createElement(
        Component,
        { className: combinedClassName, ...props },
        children
    );
};

// Display name for debugging
ThemedText.displayName = "ThemedText";

export default ThemedText;
