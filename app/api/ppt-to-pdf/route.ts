import { NextRequest } from 'next/server';
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
import { registerForCleanup, unregisterFromCleanup } from '@/lib/fileUtilsEnhanced';
import { withProductionFeatures } from '@/lib/apiWrapper';
import { checkRateLimit, createRateLimitHeaders, rateLimitResponse, rateLimitConfigs } from '@/lib/rateLimit';

async function ppttopdfHandler(request: NextRequest) {
  let inputPath = '';
  let outputPath = '';
    
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return errorResponse('No file provided');
    }
    
    if (!validateFileSize(file.size)) {
      return errorResponse('File size exceeds 50MB limit');
    }
    
    if (!validateFileType(file.name, ['.pptx', '.ppt'])) {
      return errorResponse('Only PowerPoint files (.pptx, .ppt) are allowed');
    }
    
    inputPath = await saveUploadedFile(file);
    registerForCleanup(inputPath);
    const outputDir = path.dirname(inputPath);
    
    // Convert PowerPoint to PDF using LibreOffice
    await execAsync(`libreoffice --headless --convert-to pdf --outdir "${outputDir}" "${inputPath}"`);
    
    // Get the output filename
    const ext = path.extname(inputPath);
    const baseName = path.basename(inputPath, ext);
    outputPath = path.join(outputDir, `${baseName}.pdf`);
    registerForCleanup(outputPath);
    
    const buffer = await readFileAsBuffer(outputPath);
    const outputFilename = file.name.replace(/\.(pptx?|ppt)$/i, '.pdf');
    
    return fileResponse(buffer, outputFilename, 'application/pdf');
  } catch (error) {
    console.error('PowerPoint to PDF conversion error:', error);
    return errorResponse('Conversion failed. Please try again.', 500);
  } finally {
    unregisterFromCleanup(inputPath);
    unregisterFromCleanup(outputPath);
    await cleanupFiles(inputPath, outputPath);
  }
}

// Export with production features
export const POST = withProductionFeatures(ppttopdfHandler, {
  toolName: 'ppt-to-pdf',
  category: 'pdf',
});
