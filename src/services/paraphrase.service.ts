/**
 * Paraphrase service for product descriptions
 * Handles the core business logic for paraphrasing text using OpenAI
 * @module services/paraphrase
 */

import { config } from '../config';
import { getOpenAIClient, handleOpenAIError, log } from '../utils';
import type { 
  ParaphraseRequest, 
  ParaphraseResponse, 
  TargetLength 
} from '../types';

/**
 * Generates a system prompt based on the requested length
 * @param targetLength - The desired length for the paraphrase
 * @returns The system prompt for the AI
 */
function generateSystemPrompt(targetLength?: TargetLength): string {
  let prompt = 'You are a helpful assistant that rewrites product descriptions. ';
  prompt += 'Use simple, clear language that anyone can understand. ';
  prompt += 'Keep the meaning and all important details, but use different words and sentence structures. ';
  
  // Add length-specific instructions
  if (targetLength) {
    switch (targetLength) {
      case 'short':
        prompt += 'Make the paraphrase concise and shorter than the original. ';
        break;
      case 'long':
        prompt += 'Expand the description with more details and context. ';
        break;
      case 'medium':
      default:
        prompt += 'Keep the paraphrase approximately the same length as the original. ';
        break;
    }
  }
  
  prompt += 'The paraphrase should be easy to read and understand while being completely different from the original text.';
  
  return prompt;
}

/**
 * Generates a user prompt for the paraphrase request
 * @param description - The product description to paraphrase
 * @returns The user prompt
 */
function generateUserPrompt(description: string): string {
  return `Please paraphrase the following product description:\n\n${description}`;
}

/**
 * Main service class for paraphrasing product descriptions
 */
export class ParaphraseService {
  private readonly openaiClient = getOpenAIClient();
  private readonly config = config();

  /**
   * Paraphrases a product description according to the given parameters
   * @param request - The paraphrase request parameters
   * @returns The paraphrase response
   * @throws {AppError} If the paraphrase operation fails
   */
  async paraphrase(request: ParaphraseRequest): Promise<ParaphraseResponse> {
    const startTime = Date.now();
    
    log.info('Starting paraphrase request', {
      descriptionLength: request.description.length,
      targetLength: request.targetLength,
    });

    try {
      // Prepare messages for the chat completion
      const messages = [
        {
          role: 'system' as const,
          content: generateSystemPrompt(request.targetLength),
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
        max_tokens: this.config.openai.maxTokens,
        temperature: this.config.openai.temperature,
        n: 1,
      });

      const paraphrasedText = completion.choices[0]?.message?.content?.trim();
      
      if (!paraphrasedText) {
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

  /**
   * Validates that the paraphrased text is sufficiently different from the original
   * @param original - The original text
   * @param paraphrased - The paraphrased text
   * @returns True if the texts are sufficiently different
   */
  isSignificantlyDifferent(original: string, paraphrased: string): boolean {
    // Simple check: ensure they're not identical and have some variation
    if (original.toLowerCase() === paraphrased.toLowerCase()) {
      return false;
    }
    
    // Calculate word-level similarity (simple approach)
    const originalWords = original.toLowerCase().split(/\s+/);
    const paraphrasedWords = paraphrased.toLowerCase().split(/\s+/);
    
    const commonWords = originalWords.filter((word) => paraphrasedWords.includes(word));
    const similarity = commonWords.length / Math.max(originalWords.length, paraphrasedWords.length);
    
    // Consider it different if less than 70% similar
    return similarity < 0.7;
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
