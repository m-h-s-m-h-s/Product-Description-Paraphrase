/**
 * OpenAI API client wrapper
 * Provides a configured instance of the OpenAI client
 * @module utils/openai-client
 */

import OpenAI from 'openai';
import type { ClientOptions } from 'openai';
import { config } from '../config';
import { log } from './logger';
import { AppError, ErrorType } from '../types';

/**
 * Creates and configures an OpenAI client instance
 * @returns {OpenAI} Configured OpenAI client
 * @throws {AppError} If API key is missing or invalid
 */
export function createOpenAIClient(): OpenAI {
  const appConfig = config();
  
  if (!appConfig.openai.apiKey) {
    throw new AppError(
      ErrorType.API_KEY_ERROR,
      'OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.',
    );
  }

  const clientOptions: ClientOptions = {
    apiKey: appConfig.openai.apiKey,
    timeout: 30000, // 30 seconds timeout
    maxRetries: 3,
  };

  log.debug('Creating OpenAI client', {
    model: appConfig.openai.model,
  });

  return new OpenAI(clientOptions);
}

/**
 * Singleton instance of the OpenAI client
 */
let openaiClient: OpenAI | null = null;

/**
 * Gets or creates the OpenAI client instance
 * @returns {OpenAI} The OpenAI client instance
 */
export function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = createOpenAIClient();
  }
  return openaiClient;
}

/**
 * Handles OpenAI API errors and converts them to AppError
 * @param error - The error from OpenAI API
 * @throws {AppError} Converted application error
 */
export function handleOpenAIError(error: unknown): never {
  if (error instanceof OpenAI.APIError) {
    log.error('OpenAI API error', {
      status: error.status,
      message: error.message,
      type: error.type,
    });

    if (error.status === 401) {
      throw new AppError(
        ErrorType.API_KEY_ERROR,
        'Invalid OpenAI API key. Please check your configuration.',
        error,
      );
    }

    if (error.status === 429) {
      throw new AppError(
        ErrorType.RATE_LIMIT_ERROR,
        'OpenAI API rate limit exceeded. Please try again later.',
        error,
      );
    }

    throw new AppError(
      ErrorType.API_ERROR,
      `OpenAI API error: ${error.message}`,
      error,
    );
  }

  if (error instanceof Error) {
    if (error.message.includes('ECONNREFUSED') || error.message.includes('ETIMEDOUT')) {
      throw new AppError(
        ErrorType.NETWORK_ERROR,
        'Unable to connect to OpenAI API. Please check your internet connection.',
        error,
      );
    }
  }

  log.error('Unknown error in OpenAI client', { error });
  throw new AppError(
    ErrorType.UNKNOWN_ERROR,
    'An unexpected error occurred while calling OpenAI API',
    error,
  );
}
