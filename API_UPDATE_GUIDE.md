# API Routes Update Guide

This guide explains how to update the remaining 21 API routes to use the production features.

## Pattern to Follow

Use the `pdf-to-word` route as a template. Here's the pattern:

### 1. Import the production wrapper
```typescript
import { withProductionFeatures } from '@/lib/apiWrapper';
import { registerForCleanup, unregisterFromCleanup } from '@/lib/fileUtilsEnhanced';
```

### 2. Wrap your existing handler
```typescript
async function yourToolHandler(request: NextRequest) {
  // Your existing conversion logic here
  // Register files for cleanup
  registerForCleanup(inputPath);
  registerForCleanup(outputPath);
  
  try {
    // ... conversion logic ...
  } finally {
    // Unregister and cleanup
    unregisterFromCleanup(inputPath);
    unregisterFromCleanup(outputPath);
    await cleanupFiles(inputPath, outputPath);
  }
}

// Export with production wrapper
export const POST = withProductionFeatures(yourToolHandler, {
  toolName: 'your-tool-name',
  category: 'pdf' | 'image' | 'video' | 'audio' | 'archive' | 'text',
  timeout: 120000, // Optional, uses config default if not specified
});
```

## Routes to Update

### PDF Tools (8 routes)
- [x] `/api/pdf-to-word` - DONE (template)
- [ ] `/api/word-to-pdf`
- [ ] `/api/merge-pdf`
- [ ] `/api/split-pdf`
- [ ] `/api/compress-pdf`
- [ ] `/api/images-to-pdf`
- [ ] `/api/pdf-to-png`
- [ ] `/api/ppt-to-pdf`
- [ ] `/api/pdf-to-ppt`

### Image Tools (6 routes)
- [ ] `/api/jpg-to-png`
- [ ] `/api/png-to-jpg`
- [ ] `/api/image-compressor`
- [ ] `/api/image-to-webp`
- [ ] `/api/background-remover`
- [ ] `/api/add-background`

### Text Tools (2 routes)
- [ ] `/api/ocr-image`
- [ ] `/api/pdf-to-text`

### Archive Tools (2 routes)
- [ ] `/api/zip-files`
- [ ] `/api/unzip-files`

### Audio Tools (1 route)
- [ ] `/api/audio-converter`

### Video Tools (2 routes)
- [ ] `/api/video-converter`
- [ ] `/api/video-compressor`

## Benefits

Each updated route will automatically get:
- ✅ Resource management (prevents server overload)
- ✅ Error handling with retry logic
- ✅ Performance monitoring and metrics
- ✅ Structured logging
- ✅ Timeout protection
- ✅ User-friendly error messages
- ✅ Automatic cleanup on crashes

## Notes

- The wrapper is **non-blocking** - conversions run immediately if resources are available
- Only blocks when server is at capacity (protects from crashes)
- All existing rate limiting continues to work
- No changes needed to frontend code
