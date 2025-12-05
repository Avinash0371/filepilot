// Structured Logger for Production
// Provides consistent logging with performance tracking

import { config } from './config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
    [key: string]: any;
}

class Logger {
    private logLevel: LogLevel;

    constructor() {
        this.logLevel = config.monitoring.logLevel as LogLevel;
    }

    private shouldLog(level: LogLevel): boolean {
        const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
        return levels.indexOf(level) >= levels.indexOf(this.logLevel);
    }

    private formatLog(level: LogLevel, message: string, context?: LogContext) {
        const timestamp = new Date().toISOString();
        const log = {
            timestamp,
            level,
            message,
            ...context,
        };

        if (config.monitoring.enableDetailedLogging) {
            return JSON.stringify(log, null, 2);
        }
        return JSON.stringify(log);
    }

    debug(message: string, context?: LogContext) {
        if (this.shouldLog('debug')) {
            console.log(this.formatLog('debug', message, context));
        }
    }

    info(message: string, context?: LogContext) {
        if (this.shouldLog('info')) {
            console.log(this.formatLog('info', message, context));
        }
    }

    warn(message: string, context?: LogContext) {
        if (this.shouldLog('warn')) {
            console.warn(this.formatLog('warn', message, context));
        }
    }

    error(message: string, error?: Error | unknown, context?: LogContext) {
        if (this.shouldLog('error')) {
            const errorContext = {
                ...context,
                error: error instanceof Error ? {
                    message: error.message,
                    stack: error.stack,
                    name: error.name,
                } : error,
            };
            console.error(this.formatLog('error', message, errorContext));
        }
    }

    // Performance tracking
    startTimer(label: string): () => void {
        const start = Date.now();
        return () => {
            const duration = Date.now() - start;
            this.info(`${label} completed`, { durationMs: duration });
            return duration;
        };
    }
}

export const logger = new Logger();
