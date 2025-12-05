import { NextRequest } from 'next/server';
import * as path from 'path';
import * as fs from 'fs/promises';
import {
  saveUploadedFile,
  cleanupFiles,
  errorResponse,
  validateFileType,
  validateFileTypeAndContent,
  validateFileSize,
  execAsync,
  generateTmpPath,
} from '@/lib/fileUtils';
import { checkRateLimit, createRateLimitHeaders, rateLimitResponse, rateLimitConfigs } from '@/lib/rateLimit';
import { withProductionFeatures } from '@/lib/apiWrapper';
import { registerForCleanup, unregisterFromCleanup } from '@/lib/fileUtilsEnhanced';

async function pdftotextHandler(request: NextRequest) {
  const rateLimit = await checkRateLimit(request, rateLimitConfigs.conversion);
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.reset);
  }
  
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

    // Validate file type and content
    const validation = await validateFileTypeAndContent(file, ['.pdf']);
    if (!validation.valid) {
      return errorResponse(validation.error || 'Invalid file');
    }
    
    
    
    inputPath = await saveUploadedFile(file);
    registerForCleanup(inputPath);
    outputPath = generateTmpPath('.txt');
    registerForCleanup(outputPath);
    
    // Extract text using pdftotext
    await execAsync(`pdftotext "${inputPath}" "${outputPath}"`);
    
    // Read the output text file
    const textContent = await fs.readFile(outputPath, 'utf-8');
    
    // Return as plain text
    return new Response(textContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${path.basename(file.name, '.pdf')}.txt"`,
      },
    });
  } catch (error) {
    console.error('PDF to Text error:', error);
    return errorResponse('Conversion failed. Please try again.', 500);
  } finally {
    unregisterFromCleanup(inputPath);
    unregisterFromCleanup(outputPath);
    await cleanupFiles(inputPath, outputPath);
  }
}

// Export with production features
export const POST = withProductionFeatures(pdftotextHandler, {
  toolName: 'pdf-to-text',
  category: 'text',
});
