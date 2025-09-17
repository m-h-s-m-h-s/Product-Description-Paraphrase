/**
 * Configuration module for the application
 * Handles environment variables and configuration validation
 * @module config
 */

import dotenv from 'dotenv';
import { z } from 'zod';
import type { AppConfig } from '../types';
import { AppError, ErrorType } from '../types';

// Load environment variables
dotenv.config();

/**
 * Environment variable schema for validation
 */
const envSchema = z.object({
  // OpenAI Configuration
  OPENAI_API_KEY: z.string().min(1, 'OpenAI API key is required'),
  OPENAI_MODEL: z.string().default('gpt-5-nano'),
  MAX_TOKENS: z.string().transform(Number).default('150'),
  TEMPERATURE: z.string().transform(Number).default('0.7'),
  
  // Application Configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

/**
 * Validates and parses environment variables
 * @returns Validated environment variables
 * @throws {AppError} If validation fails
 */
function validateEnv(): z.infer<typeof envSchema> {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
      throw new AppError(
        ErrorType.VALIDATION_ERROR,
        `Environment validation failed: ${issues.join(', ')}`,
        error,
      );
    }
    throw error;
  }
}

/**
 * Creates the application configuration from environment variables
 * @returns {AppConfig} The application configuration
 */
export function getConfig(): AppConfig {
  const env = validateEnv();

  return {
    environment: env.NODE_ENV,
    logLevel: env.LOG_LEVEL,
    openai: {
      apiKey: env.OPENAI_API_KEY,
      model: env.OPENAI_MODEL,
      maxTokens: env.MAX_TOKENS,
      temperature: env.TEMPERATURE,
    },
  };
}

/**
 * Singleton instance of the configuration
 */
let configInstance: AppConfig | null = null;

/**
 * Gets the cached configuration instance
 * @returns {AppConfig} The application configuration
 */
export function config(): AppConfig {
  if (!configInstance) {
    configInstance = getConfig();
  }
  return configInstance;
}
