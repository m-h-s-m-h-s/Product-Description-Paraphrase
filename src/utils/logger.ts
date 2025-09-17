/**
 * Logger utility for the application
 * Provides structured logging with Winston
 * @module utils/logger
 */

import winston from 'winston';
import { config } from '../config';

/**
 * Custom log format for development
 */
const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `[${timestamp}] ${level}: ${message}${metaStr}`;
  }),
);

/**
 * Custom log format for production
 */
const prodFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

/**
 * Creates and configures the logger instance
 * @returns {winston.Logger} Configured logger instance
 */
function createLogger(): winston.Logger {
  const appConfig = config();
  const isDevelopment = appConfig.environment === 'development';

  return winston.createLogger({
    level: appConfig.logLevel,
    format: isDevelopment ? devFormat : prodFormat,
    transports: [
      new winston.transports.Console({
        stderrLevels: ['error'],
      }),
    ],
    // Don't exit on handled exceptions
    exitOnError: false,
  });
}

/**
 * Logger instance for the application
 */
export const logger = createLogger();

/**
 * Log levels available
 */
export const LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
} as const;

/**
 * Type-safe logging methods
 */
export const log = {
  /**
   * Logs an error message
   * @param message - The error message
   * @param meta - Additional metadata
   */
  error: (message: string, meta?: unknown): void => {
    logger.error(message, meta);
  },

  /**
   * Logs a warning message
   * @param message - The warning message
   * @param meta - Additional metadata
   */
  warn: (message: string, meta?: unknown): void => {
    logger.warn(message, meta);
  },

  /**
   * Logs an info message
   * @param message - The info message
   * @param meta - Additional metadata
   */
  info: (message: string, meta?: unknown): void => {
    logger.info(message, meta);
  },

  /**
   * Logs a debug message
   * @param message - The debug message
   * @param meta - Additional metadata
   */
  debug: (message: string, meta?: unknown): void => {
    logger.debug(message, meta);
  },
};
