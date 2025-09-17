/**
 * Type definitions for the Product Description Simplifier
 * @module types
 */

/**
 * Configuration for the OpenAI API client
 */
export interface OpenAIConfig {
  /** OpenAI API key for authentication */
  apiKey: string;
  /** GPT model to use (default: gpt-5-nano) */
  model: string;
}

/**
 * Application configuration
 */
export interface AppConfig {
  /** Current environment (development, production, test) */
  environment: string;
  /** Logging level */
  logLevel: string;
  /** OpenAI configuration */
  openai: OpenAIConfig;
}

/**
 * Request to simplify a product description
 */
export interface ParaphraseRequest {
  /** The product description to simplify into clearer language */
  description: string;
}

/**
 * Response containing the simplified product description
 */
export interface ParaphraseResponse {
  /** The original input description */
  original: string;
  /** The simplified, shorter description */
  paraphrased: string;
  /** When the simplification was created */
  timestamp: Date;
  /** API tokens consumed */
  tokensUsed?: number;
}

/**
 * Error types that can occur in the application
 */
export enum ErrorType {
  /** API key is missing or invalid */
  API_KEY_ERROR = 'API_KEY_ERROR',
  /** Network or connection error */
  NETWORK_ERROR = 'NETWORK_ERROR',
  /** OpenAI API returned an error */
  API_ERROR = 'API_ERROR',
  /** Input validation failed */
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  /** Rate limit exceeded */
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  /** Unknown or unexpected error */
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
  constructor(
    public type: ErrorType,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}
