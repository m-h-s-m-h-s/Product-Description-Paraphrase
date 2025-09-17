/**
 * Main entry point for the Product Description Paraphraser application
 * @module index
 */

import { config } from './config';
import { getParaphraseService } from './services';
import { log } from './utils/logger';
import { AppError, ErrorType, type ParaphraseRequest } from './types';
import * as cli from './cli';

/**
 * Main application class
 */
class Application {
  private readonly paraphraseService = getParaphraseService();

  /**
   * Runs the application
   */
  async run(): Promise<void> {
    try {
      // Initialize configuration (this will validate environment variables)
      config();
      
      log.info('Application started');
      
      // Run the interactive CLI
      await this.runInteractiveCLI();
      
    } catch (error) {
      this.handleFatalError(error);
      process.exit(1);
    }
  }

  /**
   * Runs the interactive CLI loop
   */
  private async runInteractiveCLI(): Promise<void> {
    cli.printHeader();
    
    let continueRunning = true;
    
    while (continueRunning) {
      try {
        // Get user input
        const description = cli.promptForDescription();
        const targetLength = cli.promptForTargetLength();
        
        // Create paraphrase request
        const request: ParaphraseRequest = {
          description,
          targetLength,
        };
        
        // Show loading message
        cli.displayLoading('Generating paraphrase...');
        
        // Call the paraphrase service
        const response = await this.paraphraseService.paraphrase(request);
        
        // Display result
        cli.displayResult(
          response.original,
          response.paraphrased,
          response.tokensUsed,
        );
        
        // Check if the paraphrase is significantly different
        if (!this.paraphraseService.isSignificantlyDifferent(
          response.original,
          response.paraphrased,
        )) {
          log.warn('Generated paraphrase is too similar to the original');
          cli.displayError(
            'The generated paraphrase is very similar to the original. ' +
            'Try using a different tone or length setting.',
          );
        }
        
        // Ask if user wants to continue
        continueRunning = cli.promptToContinue();
        
        if (continueRunning) {
          console.clear();
          cli.printHeader();
        }
        
      } catch (error) {
        this.handleError(error);
        // Continue the loop unless it's a fatal error
        if (this.isFatalError(error)) {
          throw error;
        }
      }
    }
    
    cli.displayGoodbye();
  }

  /**
   * Handles application errors
   * @param error - The error to handle
   */
  private handleError(error: unknown): void {
    if (error instanceof AppError) {
      switch (error.type) {
        case ErrorType.API_KEY_ERROR:
          cli.displayError('API key error: ' + error.message);
          cli.displayError('Please check your OPENAI_API_KEY in the .env file');
          break;
          
        case ErrorType.RATE_LIMIT_ERROR:
          cli.displayError('Rate limit exceeded. Please wait a moment and try again.');
          break;
          
        case ErrorType.NETWORK_ERROR:
          cli.displayError('Network error. Please check your internet connection.');
          break;
          
        case ErrorType.VALIDATION_ERROR:
          cli.displayError(error.message);
          break;
          
        default:
          cli.displayError('An unexpected error occurred. Please try again.');
          log.error('Application error', { error });
      }
    } else {
      cli.displayError('An unexpected error occurred.');
      log.error('Unknown error', { error });
    }
  }

  /**
   * Handles fatal errors that should terminate the application
   * @param error - The error to handle
   */
  private handleFatalError(error: unknown): void {
    console.error('\n💀 Fatal Error:');
    
    if (error instanceof AppError && error.type === ErrorType.API_KEY_ERROR) {
      console.error('Missing or invalid OpenAI API key.');
      console.error('\nTo fix this:');
      console.error('1. Copy env.example to .env');
      console.error('2. Add your OpenAI API key to the .env file');
      console.error('3. Run the application again');
    } else if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('An unknown error occurred');
    }
    
    log.error('Fatal error', { error });
  }

  /**
   * Determines if an error is fatal and should terminate the application
   * @param error - The error to check
   * @returns True if the error is fatal
   */
  private isFatalError(error: unknown): boolean {
    if (error instanceof AppError) {
      return error.type === ErrorType.API_KEY_ERROR;
    }
    return false;
  }
}

/**
 * Application entry point
 */
async function main(): Promise<void> {
  const app = new Application();
  await app.run();
}

// Run the application
main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
