// src/config/formConfig.ts

/**
 * Responsive value type that supports breakpoint-specific values
 * Can be a single value or an object with breakpoint keys
 */
export type ResponsiveValue<T> =
    | T
    | {
          base?: T | null;
          sm?: T | null;
          md?: T | null;
          lg?: T | null;
          xl?: T | null;
          "2xl"?: T | null;
      }
    | null
    | undefined;

// Configuration change listeners
type ConfigChangeListener = (config: FormPackageConfig) => void;
const listeners: Set<ConfigChangeListener> = new Set();

export interface ColorPalette {
    50?: string;
    100?: string;
    200?: string;
    300?: string;
    400?: string;
    500?: string; // Main color
    600?: string;
    700?: string;
    800?: string;
    900?: string;
    950?: string;
}

export interface BackgroundColors {
    primary?: string;
    secondary?: string;
    tertiary?: string;
    dark?: string;
    darkSecondary?: string;
}

export interface TextColors {
    primary?: string;
    secondary?: string;
    tertiary?: string;
    muted?: string;
    inverse?: string;
}

export interface FormThemeConfig {
    colors?: {
        primary?: ColorPalette;
        secondary?: ColorPalette;
        success?: ColorPalette;
        warning?: ColorPalette;
        error?: ColorPalette;
        background?: BackgroundColors;
        text?: TextColors;
    };
    sizes?: {
        xs?: string;
        sm?: string;
        md?: string;
        lg?: string;
        xl?: string;
        "2xl"?: string;
    };
    spacing?: {
        xs?: string;
        sm?: string;
        md?: string;
        lg?: string;
        xl?: string;
    };
}

export interface FormPackageConfig {
    // Global theme configuration
    theme?: FormThemeConfig;

    // Global defaults for all form elements
    defaults?: {
        variant?: "default" | "filled" | "outlined" | "ghost" | "soft";
        size?: ResponsiveValue<"xs" | "sm" | "md" | "lg" | "xl">;
        radius?: ResponsiveValue<
            "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full"
        >;
        fullWidth?: boolean;
    };

    // Button-specific configuration
    button?: {
        variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
        size?: ResponsiveValue<"xs" | "sm" | "md" | "lg" | "xl">;
        radius?: ResponsiveValue<
            "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full"
        >;
    };

    // Label configuration
    label?: {
        show?: boolean;
        required?: boolean;
        className?: string;
    };

    // Validation behavior
    validation?: {
        showError?: boolean;
        showSuccess?: boolean;
    };

    // Layout configuration
    layout?: {
        gap?: ResponsiveValue<string>;
        gapX?: ResponsiveValue<string>; // Horizontal gap between columns
        gapY?: ResponsiveValue<string>; // Vertical gap between rows
        columns?: ResponsiveValue<number>;
        removeBorder?: boolean;
        noPadding?: boolean;
    };

    // Custom CSS classes for global theming
    classNames?: {
        input?: string;
        label?: string;
        error?: string;
        success?: string;
        helper?: string;
        wrapper?: string;
        form?: string;
        button?: string;
    };
}

let globalConfig: FormPackageConfig = {};

/**
 * Deep merge two objects
 */
function deepMerge<T extends Record<string, any>>(
    target: T,
    source: Partial<T>
): T {
    const result = { ...target };

    for (const key in source) {
        if (source[key] !== undefined) {
            if (
                typeof source[key] === "object" &&
                source[key] !== null &&
                !Array.isArray(source[key]) &&
                typeof target[key] === "object" &&
                target[key] !== null
            ) {
                result[key] = deepMerge(target[key], source[key] as any);
            } else {
                result[key] = source[key] as any;
            }
        }
    }

    return result;
}

/**
 * Configure global defaults for the form package
 * Supports deep merging of nested configuration objects
 * @param config - The configuration object
 */
export function configureFormPackage(config: FormPackageConfig): void {
    globalConfig = deepMerge(globalConfig, config);
    // Notify all listeners of the change
    listeners.forEach((listener) => listener(globalConfig));
}

/**
 * Get the current global configuration
 */
export function getFormConfig(): FormPackageConfig {
    return globalConfig;
}

/**
 * Subscribe to configuration changes
 * @param listener - Callback function called when config changes
 * @returns Unsubscribe function
 */
export function subscribeToConfig(listener: ConfigChangeListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

/**
 * Update a specific section of the configuration
 * @param section - The section key to update
 * @param value - The new value for that section
 */
export function updateFormConfig<K extends keyof FormPackageConfig>(
    section: K,
    value: FormPackageConfig[K]
): void {
    globalConfig = {
        ...globalConfig,
        [section]:
            typeof value === "object" && value !== null
                ? deepMerge((globalConfig[section] as any) || {}, value as any)
                : value,
    };
    listeners.forEach((listener) => listener(globalConfig));
}

/**
 * Get a specific section of the configuration
 * @param section - The section key to retrieve
 */
export function getFormConfigSection<K extends keyof FormPackageConfig>(
    section: K
): FormPackageConfig[K] {
    return globalConfig[section];
}

/**
 * Get theme color from palette with specific shade
 */
export function getThemeColor(
    colorType: "primary" | "secondary" | "success" | "warning" | "error",
    shade: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 = 500
): string {
    const config = getFormConfig();
    const palette = config.theme?.colors?.[colorType];
    return palette?.[shade] || "#000000";
}

/**
 * Get background color from theme
 */
export function getBackgroundColor(
    colorType: "primary" | "secondary" | "tertiary" | "dark" | "darkSecondary"
): string {
    const config = getFormConfig();
    const backgrounds = config.theme?.colors?.background;
    return backgrounds?.[colorType] || "#ffffff";
}

/**
 * Get text color from theme
 */
export function getTextColor(
    colorType: "primary" | "secondary" | "tertiary" | "muted" | "inverse"
): string {
    const config = getFormConfig();
    const textColors = config.theme?.colors?.text;
    return textColors?.[colorType] || "#000000";
}

/**
 * Generate CSS classes for a specific color and shade
 */
export function getColorClasses(
    colorType: "primary" | "secondary" | "success" | "warning" | "error",
    shade: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 = 500,
    type: "bg" | "text" | "border" | "ring" = "bg"
): string {
    const color = getThemeColor(colorType, shade);
    const colorName = colorType === "secondary" ? "gray" : colorType;
    return `${type}-${colorName}-${shade}`;
}

/**
 * Get size classes based on configuration
 */
export function getSizeClasses(
    size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
): string {
    const config = getFormConfig();
    return config.theme?.sizes?.[size] || "";
}

/**
 * Get spacing classes based on configuration
 */
export function getSpacingClasses(
    spacing: "xs" | "sm" | "md" | "lg" | "xl"
): string {
    const config = getFormConfig();
    return config.theme?.spacing?.[spacing] || "";
}

/**
 * Reset configuration to defaults
 */
export function resetFormConfig(): void {
    globalConfig = {};
    listeners.forEach((listener) => listener(globalConfig));
}

/**
 * Check if configuration has been initialized
 */
export function isConfigInitialized(): boolean {
    return Object.keys(globalConfig).length > 0;
}

/**
 * Get merged class names for a specific element type
 * Combines global classNames with component-specific classes
 */
export function getMergedClassName(
    elementType: keyof NonNullable<FormPackageConfig["classNames"]>,
    componentClassName?: string
): string {
    const globalClassName = globalConfig.classNames?.[elementType] || "";
    if (!componentClassName) return globalClassName;
    if (!globalClassName) return componentClassName;
    return `${globalClassName} ${componentClassName}`;
}
