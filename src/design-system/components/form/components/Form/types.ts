// src/components/Form/types.ts
import type {
    Control,
    ControllerRenderProps,
    FieldErrors,
    FieldValues,
    Path,
} from "react-hook-form";
import type { ResponsiveValue } from "../../config/formConfig";
import type { InputVariants, ButtonVariants } from "../../styles/variants";
import type { InputPreset } from "../../styles/variants";

// ============================================================================
// Style Configuration Types
// ============================================================================

export interface StyleConfig {
    variant?: InputVariants["variant"];
    size?: ResponsiveValue<InputVariants["size"]>;
    radius?: InputVariants["radius"];
    preset?: InputPreset;
    fullWidth?: boolean;
    className?: string;
}

export interface ButtonStyleConfig {
    variant?: ButtonVariants["variant"];
    size?: ResponsiveValue<ButtonVariants["size"]>;
    radius?: ButtonVariants["radius"];
    fullWidth?: boolean;
    className?: string;
}

// ============================================================================
// Label Configuration
// ============================================================================

export interface LabelConfig {
    text?: string;
    show?: boolean;
    required?: boolean;
    requiredText?: string;
    className?: string;
}

// ============================================================================
// Validation Configuration
// ============================================================================

export interface ValidationConfig {
    error?: string;
    successMessage?: string;
    showError?: boolean;
    showSuccess?: boolean;
}

// ============================================================================
// Layout Configuration
// ============================================================================

export interface LayoutConfig {
    className?: string;
    formClassName?: string;
    gap?: ResponsiveValue<string>;
    gapX?: ResponsiveValue<string>; // Horizontal gap between columns
    gapY?: ResponsiveValue<string>; // Vertical gap between rows
    columns?: ResponsiveValue<number>;
    gridCols?: ResponsiveValue<number>; // Alias for columns
    removeBorder?: boolean;
    noPadding?: boolean;
}

// ============================================================================
// Input Type Configurations
// ============================================================================

export interface BaseInputConfig {
    type: string;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export interface TextInputConfig extends BaseInputConfig {
    type: "text";
    readOnly?: boolean;
}

export interface EmailInputConfig extends BaseInputConfig {
    type: "email";
}

export interface PasswordInputConfig extends BaseInputConfig {
    type: "password";
}

export interface NumberInputConfig extends BaseInputConfig {
    type: "number";
    min?: number;
    max?: number;
    step?: number;
}

export interface SearchInputConfig extends BaseInputConfig {
    type: "search";
}

export interface UrlInputConfig extends BaseInputConfig {
    type: "url";
}

export interface TelInputConfig extends BaseInputConfig {
    type: "tel";
}

export interface TextareaInputConfig extends BaseInputConfig {
    type: "textarea";
    rows?: number;
}

export interface DropdownInputConfig extends BaseInputConfig {
    type: "dropdown";
    options: { label: string; value: string }[];
}

export interface CheckboxInputConfig extends Omit<
    BaseInputConfig,
    "placeholder"
> {
    type: "checkbox";
    label?: string;
    checkedIcon?: React.ReactNode;
    uncheckedIcon?: React.ReactNode;
}

export interface OTPInputConfig extends Omit<BaseInputConfig, "placeholder"> {
    type: "otp";
    length?: number;
    resendable?: boolean;
    resendInterval?: number;
    onResend?: () => void;
    onComplete?: (value: string) => void;
    autoFocus?: boolean;
}

export interface PhoneData {
    fullNumber: string;
    phoneCode: string;
    phoneNumber: string;
}

export interface PhoneInputConfig extends BaseInputConfig {
    type: "phone";
    preferredCountries?: string[];
    onPhoneExtracted?: (data: PhoneData) => void;
}

export interface DateInputConfig extends BaseInputConfig {
    type: "date";
    mode?: "single" | "range" | "multiple";
}

export interface TimeInputConfig extends BaseInputConfig {
    type: "time";
    min?: string;
    max?: string;
    step?: number;
}

export interface FileInputConfig extends BaseInputConfig {
    type: "file";
    accept?: string;
    multiple?: boolean;
    maxSize?: number;
}

export type InputTypeConfig =
    | TextInputConfig
    | EmailInputConfig
    | PasswordInputConfig
    | NumberInputConfig
    | SearchInputConfig
    | UrlInputConfig
    | TelInputConfig
    | TextareaInputConfig
    | DropdownInputConfig
    | CheckboxInputConfig
    | OTPInputConfig
    | PhoneInputConfig
    | DateInputConfig
    | TimeInputConfig
    | FileInputConfig;

export type ExtractTypeConfig<T extends string> = Extract<
    InputTypeConfig,
    { type: T }
>;

// ============================================================================
// Form Component Props
// ============================================================================

export interface BaseFormInputProps<
    TFieldValues extends FieldValues = FieldValues,
> {
    name: Path<TFieldValues>;
    control: Control<TFieldValues>;
    type: InputTypeConfig;
    style?: StyleConfig;
    label?: LabelConfig;
    validation?: ValidationConfig;
    layout?: LayoutConfig;
    onChange?: (value: any) => void;
    onBlur?: () => void;
    onFocus?: () => void;
    onKeyDown?: (e: React.KeyboardEvent) => void;
    format?: (value: string) => string;
}

export interface FormInputProps<
    TFieldValues extends FieldValues = FieldValues,
> extends Omit<BaseFormInputProps<TFieldValues>, "control"> {
    control?: Control<TFieldValues>;
}

export interface FormFieldProps<
    TFieldValues extends FieldValues = FieldValues,
> {
    name: Path<TFieldValues>;
    control: Control<TFieldValues>;
    label?: LabelConfig;
    validation?: ValidationConfig;
    layout?: LayoutConfig;
    style?: StyleConfig;
    children:
        | ((field: ControllerRenderProps<TFieldValues>) => React.ReactElement)
        | React.ReactElement
        | null;
}

export interface FormFieldWrapperProps {
    children: React.ReactNode;
    label?: LabelConfig;
    validation?: ValidationConfig;
    layout?: LayoutConfig;
    labelClassName?: string;
    size?: InputVariants["size"];
}

export interface FormButtonConfig {
    text?: string;
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    radius?: "sm" | "md" | "lg" | "full";
    fullWidth?: boolean;
    disabled?: boolean;
    loading?: boolean;
    className?: string;
    color?: string;
    bgColor?: string;
    borderColor?: string;
}

export interface FormButtonAction {
    type?: "submit" | "button";
    onClick?: () => void;
    onSubmit?: () => void;
    preventDefault?: boolean;
}

export interface FormButtonProps {
    config?: FormButtonConfig;
    action?: FormButtonAction;
    layout?: "horizontal" | "vertical" | "space-between";
    className?: string;
    noWrapper?: boolean; // When true, renders button without container div
}

export interface FormButtonGroupProps {
    children: React.ReactNode;
    layout?: "horizontal" | "vertical" | "space-between";
    className?: string;
}

export interface FormProps<TFieldValues extends FieldValues = FieldValues> {
    children: React.ReactNode;
    control: Control<TFieldValues>;
    errors?: FieldErrors<TFieldValues>;
    onSubmit?: (e?: React.FormEvent<HTMLFormElement>) => void;
    layout?: LayoutConfig;
}
