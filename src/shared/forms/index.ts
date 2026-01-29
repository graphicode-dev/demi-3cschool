/**
 * Forms Module - Public Exports
 *
 * Shared form utilities with React Hook Form integration.
 *
 * @example
 * ```tsx
 * import {
 *     mapApiErrorToRHF,
 *     useFormSubmit,
 *     requiredString,
 *     emailSchema,
 * } from '@/shared/forms';
 * ```
 */

// Types
export type {
    ApiValidationError,
    UseFormWithValidationOptions,
    UseFormSubmitOptions,
    UseFormSubmitReturn,
    FormFieldError,
    MapApiErrorOptions,
} from "./types";

export { isApiValidationError } from "./types";

// Utilities
export {
    mapApiErrorToRHF,
    getApiErrorMessage,
    hasFieldErrors,
} from "./mapApiErrorToRHF";

// Hooks
export { useFormSubmit } from "./useFormSubmit";

// Schemas
export {
    requiredString,
    optionalString,
    emailSchema,
    passwordSchema,
    urlSchema,
    slugSchema,
    requiredNumber,
    positiveNumber,
    integerSchema,
    fileSchema,
    imageSchema,
    requiredId,
    optionalId,
    requiredDate,
    dateStringSchema,
    requiredCheckbox,
} from "./schemas/common";
