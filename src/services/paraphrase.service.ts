/**
 * Paraphrase service for simplifying product descriptions
 * Automatically converts complex product descriptions into shorter, clearer versions
 * @module services/paraphrase
 */

import { config } from '../config';
import { getOpenAIClient, handleOpenAIError, log } from '../utils';
import type { 
  ParaphraseRequest, 
  ParaphraseResponse
} from '../types';

/**
 * Generates the system prompt that instructs gpt-5-nano to create simple, short paraphrases
 * @returns The system prompt emphasizing clarity and brevity
 */
function generateSystemPrompt(): string {
  // Clear instructions to avoid adding information
  return 'Rewrite the product description in simple, clear language. Make it shorter. IMPORTANT: Do NOT add any information, features, or details that are not explicitly mentioned in the original description. Only simplify what is already there.';
}

/**
 * Generates a user prompt for the paraphrase request
 * @param description - The product description to paraphrase
 * @returns The user prompt
 */
function generateUserPrompt(description: string): string {
  return description;
}

/**
 * Service for converting product descriptions into simpler, shorter versions
 * Uses gpt-5-nano to maintain meaning while improving readability
 */
export class ParaphraseService {
  private readonly openaiClient = getOpenAIClient();
  private readonly config = config();

  /**
   * Converts a product description into a simpler, shorter version
   * @param request - Contains the product description to simplify
   * @returns Original and simplified versions with metadata
   * @throws {AppError} If the AI request fails
   */
  async paraphrase(request: ParaphraseRequest): Promise<ParaphraseResponse> {
    const startTime = Date.now();
    
    log.info('Starting paraphrase request', {
      descriptionLength: request.description.length,
    });

    try {
      // Prepare messages for the chat completion
      const messages = [
        {
          role: 'system' as const,
          content: generateSystemPrompt(),
        },
        {
          role: 'user' as const,
          content: generateUserPrompt(request.description),
        },
      ];

      // Call OpenAI API
      const completion = await this.openaiClient.chat.completions.create({
        model: this.config.openai.model,
        messages,
        n: 1,
      });

      log.debug('OpenAI API response', { completion });
      
      const paraphrasedText = completion.choices[0]?.message?.content?.trim();
      
      if (!paraphrasedText) {
        log.error('No content in API response', { 
          choices: completion.choices,
          usage: completion.usage 
        });
        throw new Error('No paraphrase generated from the API');
      }

      const response: ParaphraseResponse = {
        original: request.description,
        paraphrased: paraphrasedText,
        timestamp: new Date(),
        tokensUsed: completion.usage?.total_tokens,
      };

      const duration = Date.now() - startTime;
      log.info('Paraphrase completed successfully', {
        duration,
        tokensUsed: response.tokensUsed,
        paraphrasedLength: paraphrasedText.length,
      });

      return response;
    } catch (error) {
      log.error('Paraphrase operation failed', {
        error,
        duration: Date.now() - startTime,
      });
      
      // Let the error handler convert it to an AppError
      handleOpenAIError(error);
    }
  }

}

/**
 * Singleton instance of the paraphrase service
 */
let serviceInstance: ParaphraseService | null = null;

/**
 * Gets or creates the paraphrase service instance
 * @returns {ParaphraseService} The paraphrase service instance
 */
export function getParaphraseService(): ParaphraseService {
  if (!serviceInstance) {
    serviceInstance = new ParaphraseService();
  }
  return serviceInstance;
}
