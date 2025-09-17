/**
 * Input validation utilities
 * Provides validation functions for user input
 * @module utils/validation
 */

import { z } from 'zod';
import { AppError, ErrorType, TargetLength } from '../types';

/**
 * Maximum allowed length for product descriptions
 */
export const MAX_DESCRIPTION_LENGTH = 5000;

/**
 * Minimum allowed length for product descriptions
 */
export const MIN_DESCRIPTION_LENGTH = 10;

/**
 * Schema for validating product descriptions
 */
const descriptionSchema = z
  .string()
  .min(MIN_DESCRIPTION_LENGTH, `Description must be at least ${MIN_DESCRIPTION_LENGTH} characters`)
  .max(MAX_DESCRIPTION_LENGTH, `Description must be at most ${MAX_DESCRIPTION_LENGTH} characters`)
  .trim();

/**
 * Schema for validating target length
 */
const targetLengthSchema = z.nativeEnum(TargetLength).optional();

/**
 * Validates a product description
 * @param description - The description to validate
 * @returns The validated and trimmed description
 * @throws {AppError} If validation fails
 */
export function validateDescription(description: string): string {
  try {
    return descriptionSchema.parse(description);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AppError(
        ErrorType.VALIDATION_ERROR,
        `Invalid description: ${error.errors[0]?.message || 'Unknown validation error'}`,
        error,
      );
    }
    throw error;
  }
}

/**
 * Validates the target length option
 * @param length - The target length to validate
 * @returns The validated target length or undefined
 * @throws {AppError} If validation fails
 */
export function validateTargetLength(length: string | undefined): TargetLength | undefined {
  if (!length) return undefined;
  
  try {
    return targetLengthSchema.parse(length);
  } catch (error) {
    const validLengths = Object.values(TargetLength).join(', ');
    throw new AppError(
      ErrorType.VALIDATION_ERROR,
      `Invalid target length: "${length}". Valid options are: ${validLengths}`,
      error,
    );
  }
}

/**
 * Sanitizes user input by removing potentially harmful content
 * @param input - The input to sanitize
 * @returns The sanitized input
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/\\n/g, '\n') // Convert escaped newlines to actual newlines
    .trim();
}

/**
 * Checks if a string contains only whitespace
 * @param str - The string to check
 * @returns True if the string is empty or only whitespace
 */
export function isEmptyOrWhitespace(str: string): boolean {
  return str.trim().length === 0;
}
