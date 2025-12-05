// Error Handler with Retry Logic
// Provides intelligent error handling and retry mechanisms

import { config } from './config';
import { logger } from './logger';

export class RetryableError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'RetryableError';
    }
}

export class PermanentError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'PermanentError';
    }
}

interface RetryOptions {
    maxRetries?: number;
    delayMs?: number;
    onRetry?: (attempt: number, error: Error) => void;
}

export async function withRetry<T>(
    operation: () => Promise<T>,
    options: RetryOptions = {}
): Promise<T> {
    const maxRetries = options.maxRetries ?? config.errors.maxRetries;
    const delayMs = options.delayMs ?? config.errors.retryDelayMs;

    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error as Error;

            // Don't retry permanent errors
            if (error instanceof PermanentError) {
                throw error;
            }

            // Don't retry on last attempt
            if (attempt === maxRetries) {
                break;
            }

            logger.warn(`Retry attempt ${attempt + 1}/${maxRetries}`, {
                error: lastError.message,
            });

            if (options.onRetry) {
                options.onRetry(attempt + 1, lastError);
            }

            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, delayMs * (attempt + 1)));
        }
    }

    throw lastError!;
}

export function categorizeError(error: unknown): Error {
    if (error instanceof Error) {
        const message = error.message.toLowerCase();

        // Retryable errors (temporary issues)
        if (
            message.includes('timeout') ||
            message.includes('econnreset') ||
            message.includes('econnrefused') ||
            message.includes('temporarily unavailable')
        ) {
            return new RetryableError(error.message);
        }

        // Permanent errors (won't succeed on retry)
        if (
            message.includes('invalid') ||
            message.includes('corrupted') ||
            message.includes('unsupported') ||
            message.includes('not found') ||
            message.includes('permission denied')
        ) {
            return new PermanentError(error.message);
        }

        // Default to retryable for unknown errors
        return new RetryableError(error.message);
    }

    return new Error('Unknown error');
}

export function getUserFriendlyError(error: unknown): string {
    if (error instanceof Error) {
        const message = error.message.toLowerCase();

        if (message.includes('timeout')) {
            return 'The conversion took too long. Please try with a smaller file.';
        }
        if (message.includes('memory') || message.includes('out of')) {
            return 'The file is too large to process. Please try a smaller file.';
        }
        if (message.includes('invalid') || message.includes('corrupted')) {
            return 'The file appears to be corrupted or invalid. Please try another file.';
        }
        if (message.includes('unsupported')) {
            return 'This file format is not supported. Please check the file type.';
        }

        return 'Conversion failed. Please try again.';
    }

    return 'An unexpected error occurred. Please try again.';
}
