/**
 * Type definitions for the Product Description Paraphrase application
 * @module types
 */

/**
 * Configuration for the OpenAI API client
 */
export interface OpenAIConfig {
  /** OpenAI API key for authentication */
  apiKey: string;
  /** Model to use for text generation (e.g., gpt-4, gpt-3.5-turbo) */
  model: string;
  /** Maximum number of tokens to generate */
  maxTokens: number;
  /** Sampling temperature (0-2). Higher values make output more random */
  temperature: number;
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
 * Request parameters for paraphrasing a product description
 */
export interface ParaphraseRequest {
  /** The original product description to paraphrase */
  description: string;
  /** Optional target length (short, medium, long) */
  targetLength?: TargetLength;
}

/**
 * Response from the paraphrase service
 */
export interface ParaphraseResponse {
  /** The original input description */
  original: string;
  /** The paraphrased description */
  paraphrased: string;
  /** Timestamp of when the paraphrase was generated */
  timestamp: Date;
  /** Number of tokens used in the API call */
  tokensUsed?: number;
}

/**
 * Target length options for the paraphrased text
 */
export enum TargetLength {
  /** Shorter than the original */
  SHORT = 'short',
  /** Similar length to the original */
  MEDIUM = 'medium',
  /** Longer and more detailed than the original */
  LONG = 'long',
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
