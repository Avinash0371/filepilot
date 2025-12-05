// Metrics Collection for Performance Monitoring
// Tracks conversion success rates, processing times, and resource usage

interface ConversionMetric {
    tool: string;
    success: boolean;
    durationMs: number;
    fileSize: number;
    timestamp: number;
    error?: string;
}

class MetricsCollector {
    private metrics: ConversionMetric[] = [];
    private maxMetrics = 1000; // Keep last 1000 metrics in memory

    recordConversion(metric: ConversionMetric) {
        this.metrics.push(metric);

        // Keep only recent metrics
        if (this.metrics.length > this.maxMetrics) {
            this.metrics = this.metrics.slice(-this.maxMetrics);
        }
    }

    getStats(tool?: string) {
        const filtered = tool
            ? this.metrics.filter(m => m.tool === tool)
            : this.metrics;

        if (filtered.length === 0) {
            return {
                total: 0,
                success: 0,
                failure: 0,
                successRate: 0,
                avgDurationMs: 0,
                avgFileSize: 0,
            };
        }

        const success = filtered.filter(m => m.success).length;
        const failure = filtered.length - success;
        const avgDuration = filtered.reduce((sum, m) => sum + m.durationMs, 0) / filtered.length;
        const avgSize = filtered.reduce((sum, m) => sum + m.fileSize, 0) / filtered.length;

        return {
            total: filtered.length,
            success,
            failure,
            successRate: (success / filtered.length) * 100,
            avgDurationMs: Math.round(avgDuration),
            avgFileSize: Math.round(avgSize),
        };
    }

    getRecentErrors(limit: number = 10) {
        return this.metrics
            .filter(m => !m.success && m.error)
            .slice(-limit)
            .map(m => ({
                tool: m.tool,
                error: m.error,
                timestamp: new Date(m.timestamp).toISOString(),
            }));
    }

    getAllToolStats() {
        const tools = [...new Set(this.metrics.map(m => m.tool))];
        return tools.map(tool => ({
            tool,
            ...this.getStats(tool),
        }));
    }

    clear() {
        this.metrics = [];
    }
}

export const metrics = new MetricsCollector();
export type { ConversionMetric };
