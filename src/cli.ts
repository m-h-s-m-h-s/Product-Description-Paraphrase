/**
 * Simple command-line interface for the product description simplifier
 * Handles user input and displays results with clear formatting
 * @module cli
 */

import readlineSync from 'readline-sync';
import { validateDescription, sanitizeInput } from './utils/validation';

/**
 * CLI color codes for better user experience
 */
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

/**
 * Prints a colored message to the console
 * @param message - The message to print
 * @param color - The color to use
 */
function printColored(message: string, color: string): void {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Prints the application header
 */
export function printHeader(): void {
  console.clear();
  printColored('\n╔════════════════════════════════════════════╗', colors.cyan);
  printColored('║    Product Description Simplifier         ║', colors.cyan);
  printColored('║      Powered by OpenAI gpt-5-nano         ║', colors.cyan);
  printColored('╚════════════════════════════════════════════╝\n', colors.cyan);
}

/**
 * Gets the product description from user input
 * Supports multi-line input (press Enter twice to finish)
 * @returns The validated and sanitized description
 */
export function promptForDescription(): string {
  printColored('Enter the product description to simplify:', colors.yellow);
  printColored('(Press Enter twice when done)', colors.dim);
  
  const lines: string[] = [];
  let emptyLineCount = 0;
  
  while (emptyLineCount < 2) {
    const line = readlineSync.question('> ');
    if (line === '') {
      emptyLineCount++;
    } else {
      emptyLineCount = 0;
      lines.push(line);
    }
  }
  
  const description = lines.join('\n');
  const sanitized = sanitizeInput(description);
  
  try {
    return validateDescription(sanitized);
  } catch (error) {
    if (error instanceof Error) {
      printColored(`\n❌ Error: ${error.message}`, colors.red);
    }
    throw error;
  }
}

/**
 * Displays the simplification results side by side
 * @param original - The original complex description
 * @param paraphrased - The simplified version
 * @param tokensUsed - API tokens consumed (optional)
 */
export function displayResult(original: string, paraphrased: string, tokensUsed?: number): void {
  console.log('\n' + '═'.repeat(50));
  
  printColored('\n📝 Original Description:', colors.blue);
  console.log(original);
  
  printColored('\n✨ Simplified Description:', colors.green);
  console.log(paraphrased);
  
  if (tokensUsed) {
    printColored(`\n📊 Tokens used: ${tokensUsed}`, colors.dim);
  }
  
  console.log('\n' + '═'.repeat(50) + '\n');
}

/**
 * Prompts the user to continue or exit
 * @returns True if the user wants to continue
 */
export function promptToContinue(): boolean {
  const answer = readlineSync.keyInYN('Would you like to simplify another description?');
  return answer === true;
}

/**
 * Displays an error message
 * @param message - The error message to display
 */
export function displayError(message: string): void {
  printColored(`\n❌ Error: ${message}`, colors.red);
  printColored('Please try again.\n', colors.yellow);
}

/**
 * Displays a loading message
 * @param message - The loading message to display
 */
export function displayLoading(message: string = 'Processing...'): void {
  printColored(`\n⏳ ${message}`, colors.yellow);
}

/**
 * Displays a goodbye message
 */
export function displayGoodbye(): void {
  printColored('\n👋 Thank you for using Product Description Simplifier!', colors.green);
  printColored('Goodbye!\n', colors.cyan);
}
