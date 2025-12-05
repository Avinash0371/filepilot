import { NextRequest } from 'next/server';
import * as path from 'path';
import * as fs from 'fs/promises';
import {
  saveUploadedFile,
  cleanupFiles,
  readFileAsBuffer,
  errorResponse,
  fileResponse,
  validateFileTypeAndContent,
  validateFileSize,
  execAsync,
  TMP_DIR,
} from '@/lib/fileUtils';
import { checkRateLimit, createRateLimitHeaders, rateLimitResponse, rateLimitConfigs } from '@/lib/rateLimit';
import { withProductionFeatures } from '@/lib/apiWrapper';
import { registerForCleanup, unregisterFromCleanup } from '@/lib/fileUtilsEnhanced';

async function pdfToWordHandler(request: NextRequest) {
  // Check rate limit
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

    // Validate file type and content (checks actual PDF signature)
    const validation = await validateFileTypeAndContent(file, ['.pdf']);
    if (!validation.valid) {
      return errorResponse(validation.error || 'Invalid PDF file');
    }

    inputPath = await saveUploadedFile(file);
    registerForCleanup(inputPath);

    const outputDir = path.dirname(inputPath);

    // Convert PDF to DOCX using LibreOffice
    // Set HOME to tmp dir to avoid permission issues
    const { stdout, stderr } = await execAsync(
      `HOME=${TMP_DIR} libreoffice --headless --infilter="writer_pdf_import" --convert-to docx --outdir "${outputDir}" "${inputPath}"`,
      { timeout: 120000 }
    );

    // Get the output filename
    const baseName = path.basename(inputPath, '.pdf');
    outputPath = path.join(outputDir, `${baseName}.docx`);
    registerForCleanup(outputPath);

    // Check if file exists
    try {
      await fs.access(outputPath);
    } catch {
      // List directory to see what files were created
      const files = await fs.readdir(outputDir);
      throw new Error('Conversion failed - output file not created');
    }

    const buffer = await readFileAsBuffer(outputPath);
    const outputFilename = file.name.replace(/\.pdf$/i, '.docx');

    const response = fileResponse(
      buffer,
      outputFilename,
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );

    // Add rate limit headers
    const rateLimitHeaders = createRateLimitHeaders(
      rateLimit.limit,
      rateLimit.remaining,
      rateLimit.reset
    );
    Object.entries(rateLimitHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } finally {
    // Cleanup files
    unregisterFromCleanup(inputPath);
    unregisterFromCleanup(outputPath);
    await cleanupFiles(inputPath, outputPath);
  }
}

// Export with production features
export const POST = withProductionFeatures(pdfToWordHandler, {
  toolName: 'pdf-to-word',
  category: 'pdf',
  timeout: 120000,
});
