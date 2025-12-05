// Metrics API
// Provides performance metrics and statistics

import { NextRequest, NextResponse } from 'next/server';
import { metrics } from '@/lib/metrics';
import { resourceManager } from '@/lib/resourceManager';

export async function GET(request: NextRequest) {
    try {
        const allStats = metrics.getAllToolStats();
        const recentErrors = metrics.getRecentErrors(20);
        const systemStats = resourceManager.getStats();

        return NextResponse.json({
            timestamp: new Date().toISOString(),
            system: systemStats,
            tools: allStats,
            recentErrors,
            summary: {
                totalConversions: allStats.reduce((sum, s) => sum + s.total, 0),
                totalSuccess: allStats.reduce((sum, s) => sum + s.success, 0),
                totalFailures: allStats.reduce((sum, s) => sum + s.failure, 0),
                overallSuccessRate: allStats.length > 0
                    ? Math.round(
                        (allStats.reduce((sum, s) => sum + s.success, 0) /
                            allStats.reduce((sum, s) => sum + s.total, 0)) *
                        100
                    )
                    : 100,
            },
        });
    } catch (error) {
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
