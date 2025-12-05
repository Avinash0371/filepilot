// Health Check API
// Provides system health status for monitoring

import { NextRequest, NextResponse } from 'next/server';
import { resourceManager } from '@/lib/resourceManager';
import { metrics } from '@/lib/metrics';
import { execAsync } from '@/lib/fileUtils';

export async function GET(request: NextRequest) {
    try {
        const stats = resourceManager.getStats();
        const allStats = metrics.getAllToolStats();

        // Check if critical dependencies are available
        const checks = await Promise.allSettled([
            checkLibreOffice(),
            checkFFmpeg(),
            checkImageMagick(),
        ]);

        const dependencies = {
            libreoffice: checks[0].status === 'fulfilled' && checks[0].value,
            ffmpeg: checks[1].status === 'fulfilled' && checks[1].value,
            imagemagick: checks[2].status === 'fulfilled' && checks[2].value,
        };

        const allHealthy = Object.values(dependencies).every(v => v);

        return NextResponse.json({
            status: allHealthy ? 'healthy' : 'degraded',
            timestamp: new Date().toISOString(),
            system: stats,
            dependencies,
            metrics: {
                totalConversions: allStats.reduce((sum, s) => sum + s.total, 0),
                successRate: allStats.length > 0
                    ? Math.round(allStats.reduce((sum, s) => sum + s.successRate, 0) / allStats.length)
                    : 100,
            },
        });
    } catch (error) {
        return NextResponse.json(
            {
                status: 'unhealthy',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

async function checkLibreOffice(): Promise<boolean> {
    try {
        await execAsync('libreoffice --version', { timeout: 5000 });
        return true;
    } catch {
        return false;
    }
}

async function checkFFmpeg(): Promise<boolean> {
    try {
        await execAsync('ffmpeg -version', { timeout: 5000 });
        return true;
    } catch {
        return false;
    }
}

async function checkImageMagick(): Promise<boolean> {
    try {
        await execAsync('convert -version', { timeout: 5000 });
        return true;
    } catch {
        return false;
    }
}
