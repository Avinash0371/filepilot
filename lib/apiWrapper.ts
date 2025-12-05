// Production API Route Wrapper
// Adds monitoring, error handling, and resource management to API routes

import { NextRequest, NextResponse } from 'next/server';
import { logger } from './logger';
import { metrics } from './metrics';
import { resourceManager } from './resourceManager';
import { withRetry, getUserFriendlyError } from './errorHandler';
import { config } from './config';

interface ConversionHandler {
  (request: NextRequest): Promise<Response>;
}

interface ConversionOptions {
  toolName: string;
  category: 'pdf' | 'image' | 'video' | 'audio' | 'archive' | 'text';
  timeout?: number;
}

export function withProductionFeatures(
  handler: ConversionHandler,
  options: ConversionOptions
): ConversionHandler {
  return async (request: NextRequest): Promise<Response> => {
    const startTime = Date.now();
    const stopTimer = logger.startTimer(`${options.toolName} conversion`);
    let fileSize = 0;
    let success = false;

    try {
      if (!resourceManager.canAcceptConversion()) {
        logger.warn('Server at capacity', { tool: options.toolName });
        return NextResponse.json(
          { error: 'Server is currently at capacity. Please try again in a moment.' },
          { status: 503, headers: { 'Retry-After': '30' } }
        );
      }

      resourceManager.startConversion();

      try {
        const clonedRequest = request.clone();
        const formData = await clonedRequest.formData();
        const file = formData.get('file') as File | null;
        if (file) {
          fileSize = file.size;
        }
      } catch {
        // Ignore
      }

      logger.info('Starting conversion', { tool: options.toolName, fileSize });

      const timeoutMs = options.timeout || config.timeouts[options.category];
      const response = await Promise.race([
        withRetry(() => handler(request), {
          maxRetries: config.errors.maxRetries,
          onRetry: (attempt, error) => {
            logger.warn(`Retry attempt ${attempt}`, { tool: options.toolName, error: error.message });
          },
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Conversion timeout')), timeoutMs)
        ),
      ]);

      success = response.ok;
      if (success) {
        logger.info('Conversion successful', { tool: options.toolName, durationMs: Date.now() - startTime });
      }

      return response;
    } catch (error) {
      logger.error('Conversion failed', error, { tool: options.toolName, durationMs: Date.now() - startTime });
      const userMessage = getUserFriendlyError(error);
      return NextResponse.json({ error: userMessage }, { status: 500 });
    } finally {
      resourceManager.endConversion();
      stopTimer();
      metrics.recordConversion({
        tool: options.toolName,
        success,
        durationMs: Date.now() - startTime,
        fileSize,
        timestamp: Date.now(),
        error: success ? undefined : 'Conversion failed',
      });
    }
  };
}
