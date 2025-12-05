// Resource Manager
// Monitors and manages system resources for optimal performance

import { config } from './config';
import { logger } from './logger';
import * as os from 'os';

class ResourceManager {
    private activeConversions = 0;
    private tempFilesSize = 0;

    // Check if we can accept a new conversion
    canAcceptConversion(): boolean {
        // Check concurrent conversions limit
        if (this.activeConversions >= config.resources.maxConcurrentConversions) {
            logger.warn('Max concurrent conversions reached', {
                active: this.activeConversions,
                max: config.resources.maxConcurrentConversions,
            });
            return false;
        }

        // Check memory usage
        const memoryUsage = this.getMemoryUsageMB();
        if (memoryUsage > config.resources.maxMemoryMB * 0.9) {
            logger.warn('Memory usage too high', {
                current: memoryUsage,
                max: config.resources.maxMemoryMB,
            });
            return false;
        }

        return true;
    }

    // Start tracking a conversion
    startConversion(): void {
        this.activeConversions++;
        logger.debug('Conversion started', {
            active: this.activeConversions,
        });
    }

    // Stop tracking a conversion
    endConversion(): void {
        this.activeConversions = Math.max(0, this.activeConversions - 1);
        logger.debug('Conversion ended', {
            active: this.activeConversions,
        });
    }

    // Get current memory usage in MB
    getMemoryUsageMB(): number {
        const used = process.memoryUsage();
        return Math.round(used.heapUsed / 1024 / 1024);
    }

    // Get system stats
    getStats() {
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const processMemory = this.getMemoryUsageMB();

        return {
            activeConversions: this.activeConversions,
            maxConversions: config.resources.maxConcurrentConversions,
            processMemoryMB: processMemory,
            systemMemoryUsedMB: Math.round(usedMem / 1024 / 1024),
            systemMemoryTotalMB: Math.round(totalMem / 1024 / 1024),
            cpuCount: os.cpus().length,
            uptime: Math.round(process.uptime()),
        };
    }

    // Track temp file size
    addTempFile(sizeBytes: number): void {
        this.tempFilesSize += sizeBytes;
    }

    removeTempFile(sizeBytes: number): void {
        this.tempFilesSize = Math.max(0, this.tempFilesSize - sizeBytes);
    }

    getTempFilesSizeMB(): number {
        return Math.round(this.tempFilesSize / 1024 / 1024);
    }
}

export const resourceManager = new ResourceManager();
