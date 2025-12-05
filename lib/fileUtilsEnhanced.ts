// Enhanced File Utilities Wrapper
// Adds production features to file operations

import * as baseFileUtils from './fileUtils';
import { logger } from './logger';
import { resourceManager } from './resourceManager';
import { withRetry, getUserFriendlyError } from './errorHandler';
import { config } from './config';
import * as fs from 'fs/promises';

// Re-export all base utilities
export * from './fileUtils';

// Enhanced cleanup with resource tracking
export async function cleanupFilesEnhanced(...filePaths: string[]): Promise<void> {
    for (const filePath of filePaths) {
        try {
            if (filePath) {
                const stats = await fs.stat(filePath);
                await fs.unlink(filePath);
                resourceManager.removeTempFile(stats.size);
                logger.debug('File cleaned up', { path: filePath, size: stats.size });
            }
        } catch (error) {
            // File might not exist, ignore
            logger.debug('Cleanup skipped', { path: filePath });
        }
    }
}

// Enhanced save with resource tracking
export async function saveUploadedFileEnhanced(file: File): Promise<string> {
    const filePath = await baseFileUtils.saveUploadedFile(file);
    resourceManager.addTempFile(file.size);
    logger.debug('File saved', { path: filePath, size: file.size });
    return filePath;
}

// Cleanup on process exit
const filesToCleanup = new Set<string>();

export function registerForCleanup(filePath: string): void {
    filesToCleanup.add(filePath);
}

export function unregisterFromCleanup(filePath: string): void {
    filesToCleanup.delete(filePath);
}

// Cleanup handler
async function cleanupOnExit() {
    logger.info('Cleaning up temp files on exit', { count: filesToCleanup.size });
    await cleanupFilesEnhanced(...Array.from(filesToCleanup));
}

process.on('exit', () => {
    // Synchronous cleanup
    for (const filePath of filesToCleanup) {
        try {
            require('fs').unlinkSync(filePath);
        } catch {
            // Ignore
        }
    }
});

process.on('SIGINT', async () => {
    await cleanupOnExit();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await cleanupOnExit();
    process.exit(0);
});
