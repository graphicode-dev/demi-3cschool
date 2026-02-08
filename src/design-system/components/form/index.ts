// src/index.ts
// Export the main Form component
export { Form, default as FormDefault } from "./components/Form/Form";

// Export context hook
export { useFormContext, FormProvider } from "./components/Form/FormContext";

// Export configuration
export {
    configureFormPackage,
    getFormConfig,
    resetFormConfig,
    subscribeToConfig,
    updateFormConfig,
    getFormConfigSection,
    isConfigInitialized,
    getMergedClassName,
    getThemeColor,
    getBackgroundColor,
    getTextColor,
    getColorClasses,
    getSizeClasses,
    getSpacingClasses,
} from "./config/formConfig";
export type { FormPackageConfig, ResponsiveValue } from "./config/formConfig";

// Export presets
export { inputPresets } from "./styles/variants";
export type { InputPreset } from "./styles/variants";

// Export all types
export type {
    FormProps,
    FormFieldProps,
    FormButtonProps,
    FormButtonGroupProps,
    BaseFormInputProps,
    FormInputProps,
    InputTypeConfig,
    StyleConfig,
    ButtonStyleConfig,
    LabelConfig,
    ValidationConfig,
    LayoutConfig,
    TextInputConfig,
    EmailInputConfig,
    PasswordInputConfig,
    NumberInputConfig,
    SearchInputConfig,
    UrlInputConfig,
    TelInputConfig,
    DropdownInputConfig,
    TextareaInputConfig,
    CheckboxInputConfig,
    OTPInputConfig,
    PhoneInputConfig,
    DateInputConfig,
    FileInputConfig,
    PhoneData,
    BaseInputConfig,
    ExtractTypeConfig,
    FormFieldWrapperProps,
} from "./components/Form/types";

// Export utilities
export { cn } from "./utils/cn";
export {
    getResponsiveClasses,
    getResponsiveGridClasses,
    getResponsiveGapClasses,
    resolveResponsiveValue,
} from "./utils/responsive";

// Export variants
export {
    inputVariants,
    labelVariants,
    helperTextVariants,
    buttonVariants as FormButtonVariants,
} from "./styles/variants";
export type {
    InputVariants,
    LabelVariants,
    HelperTextVariants,
    ButtonVariants,
} from "./styles/variants";

// Export individual components (optional, for advanced usage)
export { FormCheckBox } from "./components/CheckBox";
export { OTP } from "./components/OTP";
export { DropdownInput } from "./components/DropdownInput";
export { DateInput } from "./components/DateInput";
export { FileInput } from "./components/FileInput";
export { Calendar, formatDate } from "./components/Calendar";
export { CheckboxInput } from "./components/CheckboxInput";
export { OTPInput } from "./components/OTPInput";

// Export component types
export type { CheckBoxProps } from "./components/CheckBox/types";
export type { OTPProps } from "./components/OTP/types";
export type { DropdownInputProps } from "./components/DropdownInput/types";
export type { DateInputProps } from "./components/DateInput/types";
export type { FileInputProps } from "./components/FileInput/types";
export type {
    CalendarProps,
    DateFormatters,
} from "./components/Calendar/types";
export type { CheckboxInputProps } from "./components/CheckboxInput/types";
export type { OTPInputProps } from "./components/OTPInput/types";
