/**
 * Common Zod Schemas
 *
 * Reusable validation schemas for common field types.
 *
 * @example
 * ```tsx
 * import { z } from 'zod';
 * import { emailSchema, requiredString, fileSchema } from '@/shared/forms';
 *
 * const courseSchema = z.object({
 *     title: requiredString('Title'),
 *     email: emailSchema,
 *     image: fileSchema({ maxSize: 5 * 1024 * 1024 }),
 * });
 * ```
 */

import { z } from "zod";

// ============================================================================
// String Schemas
// ============================================================================

/**
 * Required string with custom field name
 */
export const requiredString = (fieldName: string = "This field") =>
    z.string().min(1, `${fieldName} is required`);

/**
 * Optional string that transforms empty strings to undefined
 */
export const optionalString = z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val));

/**
 * Email schema
 */
export const emailSchema = z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address");

/**
 * Password schema with minimum length
 */
export const passwordSchema = (minLength: number = 8) =>
    z
        .string()
        .min(1, "Password is required")
        .min(minLength, `Password must be at least ${minLength} characters`);

/**
 * URL schema
 */
export const urlSchema = z
    .string()
    .url("Invalid URL")
    .or(z.literal(""))
    .optional();

/**
 * Slug schema (lowercase, hyphens, no spaces)
 */
export const slugSchema = z
    .string()
    .min(1, "Slug is required")
    .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must be lowercase with hyphens only"
    );

// ============================================================================
// Number Schemas
// ============================================================================

/**
 * Required number
 */
export const requiredNumber = (fieldName: string = "This field") =>
    z.number({ message: `${fieldName} is required` });

/**
 * Positive number
 */
export const positiveNumber = (fieldName: string = "This field") =>
    z
        .number({ message: `${fieldName} is required` })
        .positive(`${fieldName} must be positive`);

/**
 * Integer schema
 */
export const integerSchema = (fieldName: string = "This field") =>
    z
        .number({ message: `${fieldName} is required` })
        .int(`${fieldName} must be a whole number`);

// ============================================================================
// File Schemas
// ============================================================================

interface FileSchemaOptions {
    maxSize?: number;
    acceptedTypes?: string[];
    required?: boolean;
}

/**
 * File schema with size and type validation
 */
export const fileSchema = (options: FileSchemaOptions = {}) => {
    const {
        maxSize = 10 * 1024 * 1024, // 10MB default
        acceptedTypes,
        required = false,
    } = options;

    const formatSize = (bytes: number) => {
        if (bytes >= 1024 * 1024) {
            return `${Math.round(bytes / 1024 / 1024)}MB`;
        }
        return `${Math.round(bytes / 1024)}KB`;
    };

    const baseSchema = z
        .instanceof(File)
        .refine(
            (file) => file.size <= maxSize,
            `File size must be less than ${formatSize(maxSize)}`
        );

    const withTypeCheck = acceptedTypes
        ? baseSchema.refine(
              (file) => acceptedTypes.includes(file.type),
              `File must be one of: ${acceptedTypes.join(", ")}`
          )
        : baseSchema;

    return required ? withTypeCheck : withTypeCheck.optional().nullable();
};

/**
 * Image file schema
 */
export const imageSchema = (
    options: Omit<FileSchemaOptions, "acceptedTypes"> = {}
) =>
    fileSchema({
        ...options,
        acceptedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    });

// ============================================================================
// ID Schemas
// ============================================================================

/**
 * Required ID (string or number)
 */
export const requiredId = (fieldName: string = "Selection") =>
    z
        .union([z.string(), z.number()])
        .refine((val) => val !== "" && val !== null && val !== undefined, {
            message: `${fieldName} is required`,
        });

/**
 * Optional ID
 */
export const optionalId = z
    .union([z.string(), z.number()])
    .optional()
    .nullable();

// ============================================================================
// Date Schemas
// ============================================================================

/**
 * Required date
 */
export const requiredDate = (fieldName: string = "Date") =>
    z.date({ message: `${fieldName} is required` });

/**
 * Date string schema (ISO format)
 */
export const dateStringSchema = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)");

// ============================================================================
// Boolean Schemas
// ============================================================================

/**
 * Required checkbox (must be true)
 */
export const requiredCheckbox = (message: string = "This field is required") =>
    z.boolean().refine((val) => val === true, { message });
