// Production Configuration
// Centralized settings for performance, resources, and limits

export const config = {
  // Resource Management
  resources: {
    maxMemoryMB: 1500, // Safe limit for 2GB server (leaves 500MB for OS)
    maxTempFilesMB: 5120, // 5GB temp storage
    cleanupIntervalMs: 30000,
    maxConcurrentConversions: 10, // Increased global limit
  },

  // Queue Configuration
  queue: {
    maxConcurrent: {
      pdf: 3, // Can now run 3 LibreOffice instances (3x300MB = 900MB)
      image: 5, // Fast image processing
      video: 2, // Allow 2 simultaneous video conversions
      audio: 3,
      archive: 3,
      default: 3,
    },
    maxQueueSize: 50,
    jobTimeout: 300000,
    cleanupInterval: 60000,
  },

  // Conversion Timeouts (in milliseconds)
  timeouts: {
    pdf: 120000, // 2 minutes for PDF operations
    image: 60000, // 1 minute for image operations
    video: 300000, // 5 minutes for video operations
    audio: 120000, // 2 minutes for audio operations
    archive: 90000, // 1.5 minutes for archive operations
    text: 90000, // 1.5 minutes for text operations (OCR, etc.)
  },

  // Rate Limiting (per IP address)
  rateLimit: {
    // Global limits (server protection)
    global: {
      maxRequestsPerMinute: 200,
      maxConcurrentPerIP: 5,
    },
    // Per-tool limits
    conversion: {
      maxRequestsPerMinute: 30,
      maxConcurrentPerIP: 3,
    },
  },

  // Error Handling
  errors: {
    maxRetries: 2, // Retry failed operations up to 2 times
    retryDelayMs: 1000, // Wait 1 second between retries
    circuitBreakerThreshold: 5, // Open circuit after 5 consecutive failures
    circuitBreakerResetMs: 60000, // Try to close circuit after 1 minute
  },

  // Monitoring
  monitoring: {
    enableMetrics: true,
    enableDetailedLogging: process.env.NODE_ENV === 'development',
    logLevel: process.env.LOG_LEVEL || 'info',
  },

  // Performance
  performance: {
    enableCaching: false, // Disable caching for privacy
    enableCompression: true,
    streamingThresholdMB: 10, // Stream files larger than 10MB
  },
} as const;

export type Config = typeof config;
