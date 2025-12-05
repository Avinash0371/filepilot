// Process Pool Manager
// Reuses LibreOffice and FFmpeg processes for better performance

import { exec, ChildProcess } from 'child_process';
import { logger } from './logger';

interface PooledProcess {
    process: ChildProcess | null;
    busy: boolean;
    lastUsed: number;
    failures: number;
}

class ProcessPool {
    private pools: Map<string, PooledProcess[]> = new Map();
    private maxPoolSize = 3;
    private maxIdleTime = 60000; // 1 minute
    private cleanupInterval: NodeJS.Timeout;

    constructor() {
        // Cleanup idle processes periodically
        this.cleanupInterval = setInterval(() => {
            this.cleanupIdleProcesses();
        }, 30000);
    }

    // Get or create a process for the given type
    async getProcess(type: 'libreoffice' | 'ffmpeg'): Promise<void> {
        // For now, we'll use direct execution instead of pooling
        // Process pooling for LibreOffice and FFmpeg is complex and can cause issues
        // We'll rely on the OS to manage process lifecycle efficiently
        return;
    }

    // Release a process back to the pool
    releaseProcess(type: string): void {
        // Not implemented - using direct execution
        return;
    }

    // Cleanup idle processes
    private cleanupIdleProcesses(): void {
        const now = Date.now();

        for (const [type, pool] of this.pools.entries()) {
            const toRemove: number[] = [];

            pool.forEach((item, index) => {
                if (!item.busy && now - item.lastUsed > this.maxIdleTime) {
                    if (item.process) {
                        item.process.kill();
                    }
                    toRemove.push(index);
                }
            });

            // Remove from pool
            toRemove.reverse().forEach(index => {
                pool.splice(index, 1);
            });

            if (toRemove.length > 0) {
                logger.debug(`Cleaned up ${toRemove.length} idle ${type} processes`);
            }
        }
    }

    // Destroy all processes
    destroy(): void {
        clearInterval(this.cleanupInterval);

        for (const pool of this.pools.values()) {
            pool.forEach(item => {
                if (item.process) {
                    item.process.kill();
                }
            });
        }

        this.pools.clear();
    }
}

export const processPool = new ProcessPool();

// Cleanup on process exit
process.on('exit', () => {
    processPool.destroy();
});
