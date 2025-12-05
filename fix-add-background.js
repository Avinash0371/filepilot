const fs = require('fs');
const path = require('path');

const content = `import { NextRequest } from 'next/server';
import * as path from 'path';
import {
  saveUploadedFile,
  cleanupFiles,
  readFileAsBuffer,
  errorResponse,
  fileResponse,
  validateFileType,
  validateFileSize,
  execAsync,
} from '@/lib/fileUtils';
import { checkRateLimit, createRateLimitHeaders, rateLimitResponse, rateLimitConfigs } from '@/lib/rateLimit';
import { withProductionFeatures } from '@/lib/apiWrapper';
import { registerForCleanup, unregisterFromCleanup } from '@/lib/fileUtilsEnhanced';

async function addbackgroundHandler(request: NextRequest) {
  const rateLimit = await checkRateLimit(request, rateLimitConfigs.conversion);
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.reset);
  }

  let inputPath = '';
  let outputPath = '';
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const bgColor = formData.get('color') as string || '#FFFFFF';
    const outputFormat = formData.get('format') as string || 'png';
    
    if (!file) {
      return errorResponse('No file provided');
    }
    
    if (!validateFileSize(file.size)) {
      return errorResponse('File size exceeds 50MB limit');
    }
    
    if (!validateFileType(file.name, ['.png', '.webp', '.gif'])) {
      return errorResponse('Only PNG, WEBP, or GIF files with transparency are allowed');
    }
    
    // Validate color format (hex color)
    const colorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!colorRegex.test(bgColor)) {
      return errorResponse('Invalid color format. Use hex format like #FFFFFF');
    }
    
    inputPath = await saveUploadedFile(file);
    registerForCleanup(inputPath);
    const ext = path.extname(inputPath);
    const baseName = path.basename(inputPath, ext);
    const outputDir = path.dirname(inputPath);
    const outExt = outputFormat === 'jpg' ? 'jpg' : 'png';
    outputPath = path.join(outputDir, \`\${baseName}_bg.\${outExt}\`);
    registerForCleanup(outputPath);
    
    // Add background color using ImageMagick
    // First flatten the image onto the background color
    if (outputFormat === 'jpg') {
      // For JPG output, flatten to remove transparency
      await execAsync(\`convert "\${inputPath}" -background "\${bgColor}" -flatten -quality 95 "\${outputPath}"\`);
    } else {
      // For PNG, keep the file but with background
      await execAsync(\`convert "\${inputPath}" -background "\${bgColor}" -flatten "\${outputPath}"\`);
    }
    
    const buffer = await readFileAsBuffer(outputPath);
    const mimeType = outputFormat === 'jpg' ? 'image/jpeg' : 'image/png';
    const outputFilename = file.name.replace(/\\\\.(png|webp|gif)$/i, \`_bg.\${outExt}\`);
    
    const response = fileResponse(buffer, outputFilename, mimeType);
    const rateLimitHeaders = createRateLimitHeaders(rateLimit.limit, rateLimit.remaining, rateLimit.reset);
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  } catch (error) {
    console.error('Add background error:', error);
    return errorResponse('Failed to add background. Please try again.', 500);
  } finally {
    unregisterFromCleanup(inputPath);
    unregisterFromCleanup(outputPath);
    await cleanupFiles(inputPath, outputPath);
  }
}

export const POST = withProductionFeatures(addbackgroundHandler, {
  toolName: 'add-background',
  category: 'image',
});
`;

const filePath = path.join(__dirname, 'app', 'api', 'add-background', 'route.ts');
fs.writeFileSync(filePath, content, 'utf8');
console.log('add-background route fixed');
