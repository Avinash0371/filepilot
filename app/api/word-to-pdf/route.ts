import { NextRequest } from 'next/server';
import * as path from 'path';
import {
  saveUploadedFile,
  cleanupFiles,
  readFileAsBuffer,
  errorResponse,
  fileResponse,
  validateFileType,
  validateFileTypeAndContent,
  validateFileSize,
  execAsync,
} from '@/lib/fileUtils';
import { checkRateLimit, createRateLimitHeaders, rateLimitResponse, rateLimitConfigs } from '@/lib/rateLimit';
import { withProductionFeatures } from '@/lib/apiWrapper';
import { registerForCleanup, unregisterFromCleanup } from '@/lib/fileUtilsEnhanced';

async function wordToPdfHandler(request: NextRequest) {
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
    const validation = await validateFileTypeAndContent(file, ['.docx', '.doc']);
    if (!validation.valid) {
      return errorResponse(validation.error || 'Invalid Word file');
    }

    inputPath = await saveUploadedFile(file);
    registerForCleanup(inputPath);
    const outputDir = path.dirname(inputPath);

    // Convert DOCX to PDF using LibreOffice
    await execAsync(`libreoffice --headless --convert-to pdf --outdir "${outputDir}" "${inputPath}"`);

    // Get the output filename
    const ext = path.extname(inputPath);
    const baseName = path.basename(inputPath, ext);
    outputPath = path.join(outputDir, `${baseName}.pdf`);
    registerForCleanup(outputPath);

    const buffer = await readFileAsBuffer(outputPath);
    const outputFilename = file.name.replace(/\.(docx?|doc)$/i, '.pdf');

    const response = fileResponse(buffer, outputFilename, 'application/pdf');
    const rateLimitHeaders = createRateLimitHeaders(rateLimit.limit, rateLimit.remaining, rateLimit.reset);
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  } finally {
    unregisterFromCleanup(inputPath);
    unregisterFromCleanup(outputPath);
    await cleanupFiles(inputPath, outputPath);
  }
}

export const POST = withProductionFeatures(wordToPdfHandler, {
  toolName: 'word-to-pdf',
  category: 'pdf',
});
